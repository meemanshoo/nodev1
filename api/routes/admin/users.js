const express = require('express');
const router = express.Router();
const Register = require('../../model/register');
const ValidateAdmin = require('../admin/validateadmin');


/**
 * @swagger
 * /api/users:
 *   post:
 *     tags:
 *     - Admin
 *     summary: get all Users
 *     description: https://long-boa-sombrero.cyclic.app/api/users
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


router.post('/',(req,res,next) => {

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


module.exports = router;