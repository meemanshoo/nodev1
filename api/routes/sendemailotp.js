const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const Register = require('../model/register');
const StoreOtp = require('../model/storeotp');

/**
 * @swagger
 * /api/sendemailotp:
 *   post:
 *     tags:
 *     - Authentication
 *     summary: For sending otp
 *     description: https://long-boa-sombrero.cyclic.app/api/sendemailotp
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:  
 *               gmail:
 *                 type: string
 *                 format: gmail
 *                 description: The gmail of the user.      
 *     responses:
 *       '200':
 *         description: Register successful response
 */

router.post('/sendemailotp', (req, res,next) => {
    const gmail  = req.body.gmail;

    if(req.body.gmail == undefined){
        return res.status(300).json({   status:false, message: 'gmail must be provided' }); 
    }

    else if(typeof req.body.gmail !== 'string'){
        return res.status(300).json({   status:false, message: 'gmail must be string' });
    }
try{ 
    Register.findOne({ gmail : req.body.gmail })
    .then(existingGmail => {
      if (!existingGmail) {
        res.status(400).json({
          status:false, 
          message: 'Gmail is not registered please register first.', 
          });
      }
      else{
        
    // Generate a new OTP
    const otp = generateOTP();
  
    // Store OTP in memory (you should use a database for a production app)
    otps.set(gmail, otp);
  
    // Configure email data
    const mailOptions = {
      from: 'boss.meemanshoo.cool@gmail.com',
      to: gmail,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}`,
    };
  
    // Send the email
    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        return res.status(400).json({ 
            status: true,
            message: 'Error sending OTP',
            });
      }

      const currentDate = new Date();

      StoreOtp.findOne({gmail:req.body.gmail})
      .then(existingGmailFromStore => {


        if(existingGmailFromStore){

          const statusFromStore = existingGmailFromStore["status"].toString() === "true";
      
          if(statusFromStore)
          {

            const  attepts = parseInt(existingGmailFromStore["attepts"].toString()) + 1;
 
            const  dateTimeString  = existingGmailFromStore["dateTime"].toString();
 
            // Convert the dateTimeString to a JavaScript Date object
            const dateTime = new Date(dateTimeString).toISOString().split('T')[0];
     
            // Get the current date as a string in the same format
            const currentDate = new Date().toISOString().split('T')[0];
   
            // Check if the date portion matches
            // if (dateTime.startsWith(currentDate)) {
            //   console.log("The date is current.");
          
            // } else {
            //   console.log('The date is not current.');
            // }
  
            // console.log(dateTime);
         
            if(attepts >= 5 && dateTime.startsWith(currentDate)){
                // to many attepts
  
                res.status(400).json({ 
                  status: false,
                  message: 'Too many attepts try again later or tomorrow',
    
              });
            }
            else{
              StoreOtp.findOneAndUpdate({gmail:req.body.gmail},{
                $set:{
                  otp:otp,
                  dateTime:new Date(),
                  attepts: attepts
                }
            }).then(
                result =>{
              
                  res.status(200).json({ 
                    status: true,
                    message: 'OTP sent successfully. Note that otp is valid for 60 seconds only',
                    data:[
                        {
                            otp: otp,
                            attepts:attepts
                        }
                    ]
                });
    
                }
            ).catch(err => {
                res.status(500).json({
                    error:err
                })
            });
            }
  
          }
          else{
            // otp expire

            res.status(400).json({ 
              status: false,
              message: 'Failed to sending otp try again after some time.',

          });
          }

        
        }
        else{

          const userId = existingGmail["userId"].toString();

          const storeOtp = new StoreOtp({
            _id:new mongoose.Types.ObjectId,
            userId:userId,  
            gmail: req.body.gmail,
            status: true,
            otp:otp,
            dateTime: new Date(),
            attepts:1
        });
      
        storeOtp.save().then(
          result =>{
            console.log('OTP sent successfully');
            res.status(200).json({ 
              status: true,
              message: 'OTP sent successfully. Note that otp is valid for 60 seconds only',
              data:[
                  {
                      otp: otp,
                      attepts:1
                  }
              ]
          });
          }
      ).catch(err => {
          res.status(500).json({
              status:false,
              message: 'Otp failed to send please try again', 
              error: err 
          })
      });
         
        }

      }).catch(error => {
        res.status(500).json({
           status:false, 
           message: 'Failed to check gmail existence', 
           error: error });
      });

     


    });
      }
    }).catch(error => {
      res.status(500).json({
         status:false, 
         message: 'Failed to check gmail existence', 
         error: error });
    });

  } catch (err) {
    res.status(500).json({
        status:false,
        message: 'Something went wrong', 
        error:err
    });
}
    
  
  });




/**
 * @swagger
 * /api/validateotp:
 *   post:
 *     tags:
 *     - Authentication
 *     summary: For sending otp
 *     description: https://long-boa-sombrero.cyclic.app/api/validateotp
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:  
 *               gmail:
 *                 type: string
 *                 format: gmail
 *                 description: The gmail of the user.      
 *               otp:
 *                 type: string
 *                 format: otp
 *                 description: The otp of the user.   
 *     responses:
 *       '200':
 *         description: Register successful response
 */

router.post('/validateotp',(req,res,next) => {   
  if(req.body.gmail == undefined){
      return res.status(300).json({   status:false, message: 'gmail must be provided' }); 
  }
  else if(req.body.otp == undefined){
      return res.status(300).json({   status:false, message: 'otp must be provided' }); 
  }

  else if(typeof req.body.gmail !== 'string'){
      return res.status(300).json({   status:false, message: 'gmail must be string' });
  }
  else if(typeof req.body.otp !== 'string'){
      return res.status(300).json({   status:false, message: 'otp must be string' });
  }
 
  
  const  expectedKeys = ["gmail","otp"];
  // Check for extra fields
  const extraFields = Object.keys(req.body).filter(key => !expectedKeys.includes(key));


  if (extraFields.length > 0) {
      return res.status(300).json({
          status:false,
          message: 'Invalid fields: ' + extraFields.join(', ') 
      });
  }

  try{

      Register.findOne({ gmail : req.body.gmail })
      .then(existingGmail => {

          if(existingGmail){

              StoreOtp.findOne({ gmail : req.body.gmail })
              .then(existingStoreOtp => {
      
              if (existingStoreOtp) {

                 const otp = existingStoreOtp["otp"].toString();
                 const userId = existingStoreOtp["userId"].toString();

                 if(req.body.otp == otp){

                   
                  //valid otp

                  const  dateTimeString  = existingStoreOtp["dateTime"].toString();

                  // Convert the dateTimeString to a JavaScript Date object
                  const dateTime = new Date(dateTimeString);
           
                  // Get the current date as a string in the same format
                  const currentDate = new Date();
     
                  // Calculate the time difference in milliseconds
                  const timeDifference = currentDate.getTime() - dateTime.getTime();        
              
                  // Check if the difference is greater than or equal to 30 seconds (in milliseconds)
                  if (timeDifference >= 60 * 1000) {
                    
                      // otp check after 1 minute

                      res.status(400).json({
                          status:false,
                          message: 'Otp Expire try again'
                      })
                  } else {

                      // otp check before 1 minute
                  


                      StoreOtp.findOneAndUpdate({gmail:req.body.gmail},{
                          $set:{
                              otp:"",
                          }
                      }).then(
                          result =>{
                            
                      return res.status(200).json({
                          status:true,
                          message: 'Valid Otp',
                          userId: userId
                      });
              
                          }
                      ).catch(err => {
                          res.status(500).json({
                              status:false,
                              message: 'Something went wrong', 
                              error:err
                          })
                      });
                  
                  }
              
                      




                 }
                 else{
                      //invalid otp

                      return res.status(400).json({
                          status:false,
                          message: 'Invalid Otp',
                      });
                 }
      
                 
                }
                else{
                  return res.status(400).json({
                      status:false,
                      message: 'Please check provided email is valid',
                  });
                }
      
              })
              .catch(error => {
                res.status(500).json({
                   status:false, 
                   message: 'Failed to check userName existence', 
                   error: error });
              });

          }
          else{
          res.status(400).json({
             status:false, 
             message: 'Provided email is not valid.', 
             });
          }


      }).catch(error => {
          res.status(500).json({
             status:false, 
             message: 'Failed to check gmail existence', 
             error: error });
        });
      

  } catch (err) {
      res.status(500).json({
          status:false,
          message: 'Something went wrong', 
          error:err
      });
  }


});



/**
 * @swagger
 * /api/clearstoredotps:
 *   delete:
 *     tags:
 *     - Admin
 *     summary: For truncate stored otps
 *     description: https://long-boa-sombrero.cyclic.app/api/clearstoredotps
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:  
 *               adminUserName:
 *                 type: string
 *                 format: gmail
 *                 description: The gmail of the user.      
 *               adminPassword:
 *                 type: string
 *                 format: otp
 *                 description: The otp of the user.   
 *     responses:
 *       '200':
 *         description: Register successful response
 */

router.delete('/clearstoredotps',(req,res,next) => {   
  // delete store otp collection from db.

  if(req.body.adminUserName == undefined){
      return res.status(300).json({   status:false, message: 'adminUserName must be provided' }); 
  }
  else if(req.body.adminPassword == undefined){
      return res.status(300).json({   status:false, message: 'adminPassword must be provided' }); 
  }

  else if(typeof req.body.adminUserName !== 'string'){
      return res.status(300).json({   status:false, message: 'adminUserName must be string' });
  }
  else if(typeof req.body.adminPassword !== 'string'){
      return res.status(300).json({   status:false, message: 'adminPassword must be string' });
  }
 
  
  const  expectedKeys = ["adminUserName","adminPassword"];
  // Check for extra fields
  const extraFields = Object.keys(req.body).filter(key => !expectedKeys.includes(key));


  if (extraFields.length > 0) {
      return res.status(300).json({
          status:false,
          message: 'Invalid fields: ' + extraFields.join(', ') 
      });
  }

  if(req.body.adminUserName !== "meem"){
      return res.status(400).json({
          status:false,
          message: 'Invalid Admin Username'
      });
  }
  else if(req.body.adminPassword !== "123456"){
      return res.status(400).json({
          status:false,
          message: 'Invalid Admin Password'
      });
  }
  else{
      truncateCollection(res);
  }


});


async function truncateCollection(res) {
  try {
    // Connect to your MongoDB database
    await mongoose.connect('mongodb+srv://Meemanshoo:zysPz6ifrWXETmPV@cluster0.x44mmbb.mongodb.net/?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const count = await StoreOtp.countDocuments();

    if(count === 0){
      
      // no document available

      res.status(400).json({ 
          status: false, 
          message: 'No documents to delete.' 
      });
      return; // Stop here

    }else{

      // document available

      
    // Truncate (remove all documents from) the collection
    const result = await StoreOtp.deleteMany({});

    res.status(200).json({
      status:true,
      message: 'Deleted ' + result.deletedCount + ' documents from the collection successfully.'
  });

    // Close the Mongoose connection
    mongoose.connection.close();

    }

  } catch (err) {

      res.status(500).json({
      status:false,
      message: 'Error truncating collection:', 
      error:err
  });
  }
}









// Configure nodemailer to send emails (replace with your email provider settings)
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'boss.meemanshoo.cool@gmail.com',
      pass: 'azqx tybk gjqp npzv',
    },
  });

//   Generate and store OTPs (in-memory for this example)
const otps = new Map();

// Generate a new OTP
function generateOTP() {
  return otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
}


module.exports = router;