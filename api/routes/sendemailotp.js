const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');


/**
 * @swagger
 * /api/sendemailotp:
 *   post:
 *     summary: For sending otp
 *     description: For sending otp to specific email.
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
 *                 description: The userName of the user.      
 *     responses:
 *       '200':
 *         description: Register successful response
 */

router.post('/', (req, res,next) => {
    const gmail  = req.body.gmail;

    if(!req.body.gmail){
        return res.status(300).json({   status:false, message: 'gmail must be provided' }); 
    }

    else if(typeof req.body.gmail !== 'string'){
        return res.status(300).json({   status:false, message: 'gmail must be string' });
    }
  
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
        return res.status(500).json({ 
            status: true,
            message: 'Error sending OTP',
            });
      }
      console.log('OTP sent successfully');
      res.status(200).json({ 
        status: true,
        message: 'OTP sent successfully',
        data:[
            {
                otp: otp
            }
        ]
     });
    });
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