const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const StoreOtp = require('../model/storeotp');
const Register = require('../model/register');

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


router.post('/',(req,res,next) => {   
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

module.exports = router;