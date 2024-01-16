const express = require('express');
const router = express.Router();
const MasterUser = require('../../model/master_user');
const mongoose = require('mongoose');

/**
 * @swagger
 * /api/master/getUsers:
 *   post:
 *     tags:
 *     - Master
 *     summary: get all Master Users
 *     description: https://long-boa-sombrero.cyclic.app/api/master/getUsers
 *     responses:
 *       '200': 
 *         description: get all Master Users successful
 */

router.post('/admin/validate',async  (req,res,next) => {

  
    if (req.body.gmail == undefined){
        return res.status(300).json({   status:false, message: 'gmail must be provided' });
    } 
    else if(req.body.password == undefined){
        return res.status(300).json({   status:false, message: 'password must be provided' }); 
    }
    else if(req.body.pin == undefined){
        return res.status(300).json({   status:false, message: 'pin must be provided' }); 
    }

    else if(typeof req.body.gmail !== 'string'){
        return res.status(300).json({   status:false, message: 'gmail must be string' });
    }
    else if(typeof req.body.password !== 'string'){
        return res.status(300).json({   status:false, message: 'lastName must be string' });
    }
    else if(typeof req.body.pin !== 'string'){
        return res.status(300).json({   status:false, message: 'userName must be string' });
    }
 
    const  expectedKeys = ["gmail","password","pin"];
    // Check for extra fields
    const extraFields = Object.keys(req.body).filter(key => !expectedKeys.includes(key));


    if (extraFields.length > 0) {
        return res.status(300).json({
            status:false,
            msg: 'Invalid fields: ' + extraFields.join(', ') 
        });
    }

    try{

        // Validate email, password, and pin against the database
        MasterUser.findOne({gmail:req.body.gmail,password:req.body.password,pin:req.body.pin,})
        .then(result => {
            if(result){
                if(result.isActivated){
                    res.status(200).json({
                        status:true,
                        message: "Admin Login Successfully",
                        key:result._id
                    });
                }
                else{
                    res.status(400).json({
                        status:false,
                        message: "You are currently In-Actived, Plese contact on support team for activation."
                    });
                }
                
            }
            else{
                res.status(400).json({
                    status:false,
                    message: "Invalid credentials"
                });
            }
            
        }).catch(err=>{
            res.status(500).json({
                status:true,
                message: "Failed to find Admin",
                error:err
            });
        });

        // if (user) {
        //     res.status(200).json({ status: true, message: 'User validation successful' });
        // } else {
        //     res.status(401).json({ status: false, message: 'Invalid credentials' });
        // }


    } catch (err) {
        res.status(500).json({
            status:false,
            message: 'Something went wrong', 
            error:err
        });
    }

    
});

module.exports = router;