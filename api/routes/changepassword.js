const express = require('express');
const router = express.Router();
const Register = require('../model/register');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');



/**
 * @swagger
 * /api/changepassword:
 *   patch:
 *     summary: For changing User password
 *     description: For changing User password.
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


router.patch('/',(req,res,next) => {

    if(!req.body.userId){
        return res.status(300).json({   status:false, message: 'userId must be provided' }); 
    }
    else if(!req.body.newPassword){
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

module.exports = router;