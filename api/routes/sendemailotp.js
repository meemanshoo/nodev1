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

router.post('/', (req, res,next) => {
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