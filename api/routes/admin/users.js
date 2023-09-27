const express = require('express');
const router = express.Router();
const Register = require('../../model/register');
const ValidateAdmin = require('../admin/validateadmin');
const crypto = require('crypto');

/**
 * @swagger
 * /api/category:
 *   post:
 *     tags:
 *     - Admin
 *     summary: get all Users
 *     description: https://long-boa-sombrero.cyclic.app/api/users
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


router.post('/',(req,res,next) => {

    const respp = ValidateAdmin.validateotp(req,res);
   
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

// Define a route that accepts headers
router.get('/', (req, res) => {
    // Get headers from the request object
    const receivedHash  = `{"adminUserName": "meem","adminPassword": "123456"}`;



    // Hash the known value using SHA-256
const hash = crypto.createHash('sha256').update(receivedHash).digest('hex');

if(hash === req.headers.keys.toLowerCase()){
  // Respond with the received headers
  res.json({ "true":hash});
}
else{
  // Respond with the received headers
  res.json({ "false":hash});
}

  
  
  });

module.exports = router;