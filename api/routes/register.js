const express = require('express');
const router = express.Router();
const Register = require('../model/register');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

/**
 * @swagger
 * /register:
 *   post:
 *     summary: For Register User
 *     description: Add User Data to db.
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
 *                 format: email
 *                 description: The lastName address of the user.
 *               userName:
 *                 type: string
 *                 format: password
 *                 description: The userName of the user.
 *               gmail:
 *                 type: string
 *                 format: password
 *                 description: The gmail of the user.
 *               phoneNo:
 *                 type: string
 *                 format: password
 *                 description: The phoneNo of the user.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The password of the user.
 *     responses:
 *       '200':
 *         description: A successful response
 */

router.post('/',(req,res,next) => {


    if (!req.body.firstName){
        return res.status(400).json({   status:false, error: 'firstName must be provided' });
    } 
    else if(!req.body.lastName){
        return res.status(400).json({   status:false, error: 'lastName must be provided' }); 
    }
    else if(!req.body.userName){
        return res.status(400).json({   status:false, error: 'userName must be provided' }); 
    }
    else if(!req.body.gmail){
        return res.status(400).json({   status:false, error: 'gmail must be provided' }); 
    }
    else if(!req.body.phoneNo){
        return res.status(400).json({   status:false, error: 'phoneNo must be provided' }); 
    }
    else if(!req.body.password){
        return res.status(400).json({   status:false, error: 'password must be provided' }); 
    }

    else if(typeof req.body.firstName !== 'string'){
        return res.status(400).json({   status:false, error: 'firstName must be string' });
    }
    else if(typeof req.body.lastName !== 'string'){
        return res.status(400).json({   status:false, error: 'lastName must be string' });
    }
    else if(typeof req.body.userName !== 'string'){
        return res.status(400).json({   status:false, error: 'userName must be string' });
    }
    else if(typeof req.body.gmail !== 'string'){
        return res.status(400).json({   status:false, error: 'gmail must be string' });
    }
    else if(typeof req.body.phoneNo !== 'string'){
        return res.status(400).json({   status:false, error: 'phoneNo must be string' });
    }
    else if(typeof req.body.password !== 'string'){
        return res.status(400).json({   status:false, error: 'password must be string' });
    }

    const  expectedKeys = ["firstName","lastName","userName","gmail","phoneNo","password"];
    // Check for extra fields
    const extraFields = Object.keys(req.body).filter(key => !expectedKeys.includes(key));


    if (extraFields.length > 0) {
        return res.status(500).json({
            status:false,
            msg: 'Invalid fields: ' + extraFields.join(', ') 
        });
    }

    try{

        Register.findOne({ gmail : req.body.gmail })
        .then(existingGmail => {

        if (existingGmail) {
            return res.status(400).json({ status:false, error: 'Gmail already exists' });
          }


          const register = new Register({
            _id:new mongoose.Types.ObjectId,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userName: req.body.userName,
            gmail: req.body.gmail,
            phoneNo: req.body.phoneNo,
            password: req.body.password 
        });
        
        register.save().then(
            result =>{
            res.status(200).json({
                status:true,
                msg: result.gmail + " Register Successfully" 
            })
            }
        ).catch(err => {
            res.status(500).json({
                status:false,
                msg:err
            })
        });

        })
        .catch(error => {
          res.status(400).json({ status:false, error: 'Failed to check currency existence', details: error });
        });
        

    } catch (err) {
        res.status(500).json({
            status:false,
            msg:err
        });
    }

    
});

module.exports = router;