const express = require('express');
const router = express.Router();
const Register = require('../model/register');
const mongoose = require('mongoose');

/**
 * @swagger
 * /api/register:
 *   post:
 *     tags:
 *     - Authentication
 *     summary: For Register User
 *     description: https://long-boa-sombrero.cyclic.app/api/register
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The firstName of the user.      
 *               lastName:
 *                 type: string
 *                 format: string
 *                 description: The lastName address of the user.
 *               userName:
 *                 type: string
 *                 format: string
 *                 description: The userName of the user.
 *               gmail:
 *                 type: string
 *                 format: email
 *                 description: The gmail of the user.
 *               phoneNo:
 *                 type: string
 *                 format: number
 *                 description: The phoneNo of the user.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The password of the user.
 *     responses:
 *       '200':
 *         description: Register successful response
 */

router.post('/',(req,res,next) => {


    if (!req.body.firstName){
        return res.status(300).json({   status:false, message: 'firstName must be provided' });
    } 
    else if(!req.body.lastName){
        return res.status(300).json({   status:false, message: 'lastName must be provided' }); 
    }
    else if(!req.body.userName){
        return res.status(300).json({   status:false, message: 'userName must be provided' }); 
    }
    else if(!req.body.gmail){
        return res.status(300).json({   status:false, message: 'gmail must be provided' }); 
    }
    else if(!req.body.phoneNo){
        return res.status(300).json({   status:false, message: 'phoneNo must be provided' }); 
    }
    else if(!req.body.password){
        return res.status(300).json({   status:false, message: 'password must be provided' }); 
    }

    else if(typeof req.body.firstName !== 'string'){
        return res.status(300).json({   status:false, message: 'firstName must be string' });
    }
    else if(typeof req.body.lastName !== 'string'){
        return res.status(300).json({   status:false, message: 'lastName must be string' });
    }
    else if(typeof req.body.userName !== 'string'){
        return res.status(300).json({   status:false, message: 'userName must be string' });
    }
    else if(typeof req.body.gmail !== 'string'){
        return res.status(300).json({   status:false, message: 'gmail must be string' });
    }
    else if(typeof req.body.phoneNo !== 'string'){
        return res.status(300).json({   status:false, message: 'phoneNo must be string' });
    }
    else if(typeof req.body.password !== 'string'){
        return res.status(300).json({   status:false, message: 'password must be string' });
    }

    const  expectedKeys = ["firstName","lastName","userName","gmail","phoneNo","password"];
    // Check for extra fields
    const extraFields = Object.keys(req.body).filter(key => !expectedKeys.includes(key));


    if (extraFields.length > 0) {
        return res.status(300).json({
            status:false,
            msg: 'Invalid fields: ' + extraFields.join(', ') 
        });
    }

    try{

        Register.findOne({ gmail : req.body.gmail })
        .then(data => {
    
        if (data) {
            return res.status(400).json({ status:false, message: 'Gmail already exists'});
        }

        Register.findOne({ userName : req.body.userName })
        .then(data => {
            if (data) {
                return res.status(400).json({ status:false, message: 'UserName must be unique' });
            } 

            
         const userId = new mongoose.Types.ObjectId;

         const register = new Register({
           _id:new mongoose.Types.ObjectId,
           userId:userId,
           firstName: req.body.firstName,
           lastName: req.body.lastName,
           userName: req.body.userName,
           gmail: req.body.gmail,
           phoneNo: req.body.phoneNo,
           password: req.body.password,
           isActivated: true
       });
       
       register.save().then(
           result =>{
           res.status(200).json({
               status:true,
               msg: result.gmail + " Register Successfully",
               data:[
                   {
                       userId: userId 
                   }
               ]
           })
           }
       ).catch(err => {
           res.status(500).json({
               status:false,
               message: 'Failed to register user', 
               error: err 
           })
       });
        }).catch(error => {
            res.status(500).json({ 
              status:false, 
              message: 'Failed to check userName existence', 
              error: error 
          });
          });


        })
        .catch(error => {
          res.status(500).json({ 
            status:false, 
            message: 'Failed to check gmail existence', 
            error: error 
        });
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