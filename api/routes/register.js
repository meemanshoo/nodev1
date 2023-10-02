const express = require('express');
const router = express.Router();
const Register = require('../model/register');
const mongoose = require('mongoose');
const ValidateAdmin = require('../routes/admin/validateadmin');


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

router.post('/register',async  (req,res,next) => {


    if (req.body.firstName == undefined){
        return res.status(300).json({   status:false, message: 'firstName must be provided' });
    } 
    else if(req.body.lastName == undefined){
        return res.status(300).json({   status:false, message: 'lastName must be provided' }); 
    }
    else if(req.body.userName == undefined){
        return res.status(300).json({   status:false, message: 'userName must be provided' }); 
    }
    else if(req.body.gmail == undefined){
        return res.status(300).json({   status:false, message: 'gmail must be provided' }); 
    }
    else if(req.body.phoneNo == undefined){
        return res.status(300).json({   status:false, message: 'phoneNo must be provided' }); 
    }
    else if(req.body.password == undefined){
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
        console.log("existingUser");
    
        // Check if the provided username or email is already in use
        const existingUser = await Register.findOne({ $or: [{ userName: req.body.userName }, { gmail: req.body.gmail }] });
 
        if(existingUser){
            return res.status(400).json({ status:false, message: 'UserName and Gmail must be unique' });
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

router.post('/login',(req,res,next) => {

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

                if(existingUser["isActivated"] == true){
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
                        message: 'Your account is rejected. Contact and Support for further details',
                    });
                }

              
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


/**
 * @swagger
 * /api/admin/getAllUsers:
 *   post:
 *     tags:
 *     - Admin
 *     summary: get all Users
 *     description: https://long-boa-sombrero.cyclic.app/api/admin/getAllUsers
 *     parameters:
 *       - in: header
 *         name: keys
 *         required: true
 *         schema:
 *           type: string
 *           format: string
 *         description: keys is SHA-256 hash of body parameter of clearstoredotps api
 *     responses:
 *       '200':
 *         description: Successful response
 */

router.post('/admin/getAllUsers',(req,res,next) => {

    const respp = ValidateAdmin.validateAdminWithSha256(req,res);
   
    if(respp){
        return res.status(300).json({   status:false, message: respp }); 
    }
    else{
      
        try{
         
            Register.find().then(result => {
                res.status(200).json({
                    status: true,
                    message: 'Get list of users successfully',
                    records: result.length,
                    data:result
                });
            }).catch(err=>{
                res.status(500).json({
                    status:false, 
                    message: 'Failed to check users existence', 
                    error: err
                });
            });
        }
        catch (err) {
            res.status(500).json({
                status:false,
                message: 'Something went wrong', 
                error:err
            });
    }
    }});



/**
 * @swagger
 * /api/changepassword:
 *   patch:
 *     tags:
 *     - Authentication
 *     summary: For changing User password
 *     description: https://long-boa-sombrero.cyclic.app/api/changepassword
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:  
 *               userId:
 *                 type: string
 *                 format: password
 *                 description: The userName of the user.      
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: The password of the user.
 *     responses:
 *       '200':
 *         description: Register successful response
 */


router.patch('/changePassword',(req,res,next) => {

    if(req.body.userId == undefined){
        return res.status(300).json({   status:false, message: 'userId must be provided' }); 
    }
    else if(req.body.newPassword == undefined){
        return res.status(300).json({   status:false, message: 'newPassword must be provided' }); 
    }

    else if(typeof req.body.userId !== 'string'){
        return res.status(300).json({   status:false, message: 'userId must be string' });
    }
    else if(typeof req.body.newPassword !== 'string'){
        return res.status(300).json({   status:false, message: 'newPassword must be string' });
    }

    const  expectedKeys = ["userId","newPassword"];
    // Check for extra fields
    const extraFields = Object.keys(req.body).filter(key => !expectedKeys.includes(key));


    if (extraFields.length > 0) {
        return res.status(300).json({
            status:false,
            message: 'Invalid fields: ' + extraFields.join(', ') 
        });
    }

    try{

        const updateFields = {};
        updateFields.password = req.body.newPassword;

        Register.findOneAndUpdate({ userId: req.body.userId }, { $set: updateFields }, { new: true })
        .then((result) => {

            if (!result) {
                // If the resource is not found, return a 200 status code with a message
                return res.status(400).json({
                    status: false,
                    message: 'Invalid User',
                });
              }

          res.status(200).json({
            status:true,
            message: 'Password Updated Successfully', 
          });
        })
        .catch((err) => {
          res.status(500).json({
            status:false,
            message: 'Failed to check userId existence', 
            error:err
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



/**
 * @swagger
 * /api/changeacticvation:
 *   patch:
 *     tags:
 *     - Admin
 *     summary: Change user activation
 *     description: https://long-boa-sombrero.cyclic.app/api/category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 format: string
 *                 description: The userId of the User.      
 *               activation:
 *                 type: string
 *                 format: string
 *                 description: The activation of the User.           
 *     parameters:
 *       - in: header
 *         name: keys
 *         required: true
 *         schema:
 *           type: string
 *           format: string
 *         description: keys is SHA-256 hash of body parameter of clearstoredotps api
 *     responses:
 *       '200':
 *         description: get all category successful
 */

router.post('/changeActicvation',(req,res,next) => {

    if(req.body.userId == undefined){
        return res.status(300).json({   status:false, message: 'userId must be provided'}); 
    }
    else if(req.body.activation  == undefined){
        return res.status(300).json({   status:false, message: 'activation must be provided' }); 
    }

    else if(typeof req.body.userId !== 'string'){
        return res.status(300).json({   status:false, message: 'userId must be string' });
    }
    else if(typeof req.body.activation !== 'boolean'){
        return res.status(300).json({   status:false, message: 'activation must be Boolean' });
    }

    const  expectedKeys = ["userId","activation"];
    // Check for extra fields
    const extraFields = Object.keys(req.body).filter(key => !expectedKeys.includes(key));


    if (extraFields.length > 0) {
        return res.status(300).json({
            status:false,
            message: 'Invalid fields: ' + extraFields.join(', ') 
        });
    }


    const respp = ValidateAdmin.validateAdminWithSha256(req,res);
   
    if(respp){
        return res.status(300).json({   status:false, message: respp }); 
    }
    else{
      
       
    try{

        const updateFields = {};
        updateFields.isActivated = req.body.activation;

        Register.findOneAndUpdate({ userId: req.body.userId }, { $set: updateFields }, { new: true })
        .then((result) => {

            if (!result) {
                // If the resource is not found, return a 200 status code with a message
                return res.status(400).json({
                    status: false,
                    message: 'User not found', 
                });
              }

              if(req.body.activation){
                res.status(200).json({
                    status:true,
                    message: 'User is Actovated', 
                  });
              }
              else{
                res.status(200).json({
                    status:true,
                    message: 'User is De-Actovated', 
                  });
              }

        
        })
        .catch((err) => {
          res.status(500).json({
            status:false,
            message: 'Failed to check userId existence', 
            error:err
          });
        });
        

    } catch (err) {
        res.status(500).json({
            status:false,
            message: 'Something went wrong', 
            error:err
        });
    }

    }});


module.exports = router;