const express = require('express');
const router = express.Router();
const Register = require('../model/register');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');



/**
 * @swagger
 * /api/login:
 *   post:
 *     tags:
 *     - Authentication
 *     summary: For Login User
 *     description: https://long-boa-sombrero.cyclic.app/api/login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:  
 *               userNameOrGmail:
 *                 type: string
 *                 format: string
 *                 description: The userName/gmail of the user.      
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The password of the user.
 *     responses:
 *       '200':
 *         description: Register successful response
 */


router.post('/',(req,res,next) => {

    if(req.body.userNameOrGmail == undefined){
        return res.status(300).json({   status:false, message: 'userNameOrGmail must be provided' }); 
    }
    else if(!req.body.password == undefined){
        return res.status(300).json({   status:false, message: 'password must be provided' }); 
    }

    else if(typeof req.body.userNameOrGmail !== 'string'){
        return res.status(300).json({   status:false, message: 'userNameOrGmail must be string' });
    }
    else if(typeof req.body.password !== 'string'){
        return res.status(300).json({   status:false, message: 'password must be string' });
    }

    const  expectedKeys = ["userNameOrGmail","password"];
    // Check for extra fields
    const extraFields = Object.keys(req.body).filter(key => !expectedKeys.includes(key));


    if (extraFields.length > 0) {
        return res.status(300).json({
            status:false,
            message: 'Invalid fields: ' + extraFields.join(', ') 
        });
    }

    try{
        let  reqJson = {};
        if(req.body.userNameOrGmail.endsWith("@gmail.com")){
            reqJson = { gmail : req.body.userNameOrGmail }
        }
        else{
            reqJson = { userName : req.body.userNameOrGmail }
        }

        Register.findOne(reqJson)
        .then(existingUser => {

        if (existingUser) {
            if(existingUser["password"] == req.body.password){
                return res.status(200).json({
                    status:true,
                    message: 'Login Successfull',
                    data:[
                        {
                            userId: existingUser["userId"]
                        }
                    ]
                    
                });
            }
            else{
                return res.status(400).json({
                    status:false,
                    message: 'Login Unsuccessfull due to incorrect password',
                });
            }
           
          }
          else{
            return res.status(400).json({
                status:false,
                message: 'Login Unsuccessfull. Please Check gmail/userName or password carefully',
            });
          }

        })
        .catch(error => {
          res.status(500).json({
             status:false, 
             message: 'Failed to check userName existence', 
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