const express = require('express');
const router = express.Router();
const Register = require('../../model/register');
const ValidateAdmin = require('../admin/validateadmin');




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

router.post('/',(req,res,next) => {

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