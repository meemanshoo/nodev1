const express = require('express');
const router = express.Router();
const ValidateIP = require('../../model/validate_ip');
const AppCheck = require('../../model/app_check');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

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


router.post('/master/getAllIPs',(req,res,next) => {
    let query = {};

    if(req.body.isActivated == undefined && req.body.search == undefined){
        // both are not use
    }
    else if(req.body.isActivated != undefined && req.body.search == undefined){
        // isActivated use
        if(typeof req.body.isActivated !== 'boolean'){
            return res.status(300).json({   status:false, message: 'isActivated must be Boolean' });
        }
        else{
            query = {isActivated : req.body.isActivated};
        }
    }
    else if(req.body.isActivated == undefined && req.body.search != undefined){
        // search use
        if(typeof req.body.search !== 'string'){
            return res.status(300).json({   status:false, message: 'search must be string' });
        }
        else{
            query = { ip: { $regex: new RegExp(`^${req.body.search}`, 'i') } };
        }
        
    }
    else if(req.body.isActivated != undefined && req.body.search != undefined){
        //both are use
        if(typeof req.body.isActivated !== 'boolean'){
            return res.status(300).json({   status:false, message: 'isActivated must be Boolean' });
        }
        else if(typeof req.body.search !== 'string'){
            return res.status(300).json({   status:false, message: 'search must be string' });
        }
        else{
            query = { 
                isActivated : req.body.isActivated,
                ip: { $regex: new RegExp(`^${req.body.search}`, 'i') } 
            };
        }
        
    }

    ValidateIP.find(query)
    .select('-__v')
    .sort({uploadDate : -1})
    .then(result => {
        res.status(200).json({
            status:true,
            message: "Date get successfully",
            records: result.length,
            data:result
        });
    }).catch(err=>{
        res.status(500).json({
            status:true,
            message: "Faild to Fetch IPs details",
            error:err
        });
    });
});


router.post('/master/validateIP',async  (req,res,next) => {


    if (req.body.appCheckId == undefined){
        return res.status(300).json({   status:false, message: 'appCheckId must be provided' });
    } 

    else if (req.body.ip == undefined){
        return res.status(300).json({   status:false, message: 'ip must be provided' });
    } 
    else if(!ObjectId.isValid(req.body.appCheckId)){
        return res.status(300).json({   status:false, message: 'appCheckId must be Object ID' });
    }
    else if(typeof req.body.ip !== 'string'){
        return res.status(300).json({   status:false, message: 'ip must be string' });
    }

    const  expectedKeys = ["appCheckId","ip"];
    // Check for extra fields
    const extraFields = Object.keys(req.body).filter(key => !expectedKeys.includes(key));


    if (extraFields.length > 0) {
        return res.status(300).json({
            status:false,
            msg: 'Invalid fields: ' + extraFields.join(', ') 
        });
    }

    try{
        // Check if the provided username or email is already in use
        const existingAppCheck = await AppCheck.findOne({_id: req.body.appCheckId});
    
        if(existingAppCheck){
            // App is available

            if(existingAppCheck.isActivated){
                // app is allowed by master

                

                const existingIP = await ValidateIP.findOneAndUpdate(
                        {ip: req.body.ip},
                        { $push: { lastCall: new Date() } },
                        { new: true }
                    );


                if(existingIP){
                    if(existingIP.isActivated){
    
                        // allow from master
    
                        return res.status(200).json({
                            status:true,
                            message: "Autherization valid",
                            id: existingIP._id
                        });
                    }
                    else{
    
                        // not allow from master
                        return res.status(400).json({
                            status:false,
                            message: existingIP.message
                        });
                    }
                   
                    
                }
                else{
    
                    
                // new ip found

                const cappingLimit = existingAppCheck.isActivatedCap - 1;

                if(cappingLimit <= 0){
                    return res.status(400).json({
                        status:false,
                        message: "New members are restricted to use this app. Please contact to support team for further details."
                    });
                }

                await ValidateIP.find({isActivated : false})
                .sort({uploadDate : 1}).then(
                    async  result  =>{

                        if(result.length > cappingLimit){
                            // delete first ip
        
                            const ipId = result[0]._id;

                            await ValidateIP.findOneAndDelete({_id : ipId}).catch(err => {
                                res.status(500).json({
                                    status:false,
                                    message: 'Failed to delete IP', 
                                    error: err 
                                })
                            });
            
                        }
            
                        const validateIP = new ValidateIP({
                            ip: req.body.ip,
                            appCheckId: req.body.appCheckId
                        });
                        
                       
                        
                        
                        validateIP.save().then(
                            result =>{
                            res.status(400).json({
                                status:false,
                                message: "New members are not directly allows to use this app. Please contact to support team for further details."
                            })
                            }
                        ).catch(err => {
                            res.status(500).json({
                                status:false,
                                message: 'Failed to register master user', 
                                error: err 
                            })
                        });
                    }
                )
                .catch(err => {
                    res.status(500).json({
                        status:false,
                        message: 'Failed to get IP', 
                        error: err 
                    })
                });
    
                }

            
            }
            else{
                // app is not allowed by master
                return res.status(400).json({ status:false, message: existingAppCheck.message }); 
            }
            
        }
        else{
            // App is not available
            return res.status(400).json({ status:false, message: 'Invalid App Id' }); 
        }

    } catch (err) {
        res.status(500).json({
            status:false,
            message: 'Something went wrong', 
            error:err
        });
    }

    
});


router.post('/master/changeIPStatus',(req,res,next) => {

    if(req.body.ipId == undefined){
        return res.status(300).json({   status:false, message: 'ipId must be provided'}); 
    }
    else if(req.body.appId == undefined){
        return res.status(300).json({   status:false, message: 'appId must be provided'}); 
    }
    else if(req.body.isActivated  == undefined){
        return res.status(300).json({   status:false, message: 'isActivated must be provided' }); 
    }


    else if(!ObjectId.isValid(req.body.ipId)){
        return res.status(300).json({   status:false, message: 'ipId must be Object' });
    }
    else if(!ObjectId.isValid(req.body.appId)){
        return res.status(300).json({   status:false, message: 'appId must be Object' });
    }
    else if(typeof req.body.isActivated !== 'boolean'){
        return res.status(300).json({   status:false, message: 'isActivated must be Boolean' });
    }
    else if(req.body.message != undefined){
        // isActivated use
        if(typeof req.body.message !== 'string'){
            return res.status(300).json({   status:false, message: 'message must be string' });
        }
    }


    const  expectedKeys = ["ipId","isActivated","appId","message"];
    // Check for extra fields
    const extraFields = Object.keys(req.body).filter(key => !expectedKeys.includes(key));


    if (extraFields.length > 0) {
        return res.status(300).json({
            status:false,
            message: 'Invalid fields: ' + extraFields.join(', ') 
        });
    }
   
  
       
    try{
 
        const message = req.body.message == undefined ? req.body.isActivated ? "Validate Ip Successfully" : "You are Blocked. Please contact to support team for further details" : req.body.message;

        const updateObject = {
            $set: {
              isActivated: req.body.isActivated,
              message: message,
              updateDate: Date.now()
            }
          };
        

        ValidateIP.findOneAndUpdate({ _id: req.body.ipId,appCheckId: req.body.appId }, updateObject , {new: true, })
        .then((result) => {

            if (!result) {
                // If the resource is not found, return a 200 status code with a message
                return res.status(400).json({
                    status: false,
                    message: 'Invalid ipId', 
                });
              }

              const activationMessage = req.body.isActivated ? 'IP is Activated' : 'IP is De-Activated';

                return res.status(200).json({
                    status:true,
                    message: activationMessage
                });

        
        })
        .catch((err) => {
          res.status(500).json({
            status:false,
            message: 'Failed to check IP existence', 
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

router.post('/master/deleteApp1',(req,res,next) => {

    if(req.body.id == undefined){
        return res.status(300).json({   status:false, message: 'id must be provided'}); 
    }

    else if(!mongoose.Types.ObjectId.isValid(req.body.id)){   
        return res.status(300).json({   status:false, message: 'id must be mongoose object id' });
    }

    const  expectedKeys = ["id"];
    // Check for extra fields
    const extraFields = Object.keys(req.body).filter(key => !expectedKeys.includes(key));


    if (extraFields.length > 0) {
        return res.status(300).json({
            status:false,
            message: 'Invalid fields: ' + extraFields.join(', ') 
        });
    }
   
  
       
    try{

        AppCheck.deleteOne({ _id: req.body.id })
        .then((result) => {

            if (result.deletedCount === 1) {
                res.status(200).json({
                    status:true,
                    message: "App Deleted Successfully", 
                    records: result.deletedCount
                });
              }
              else{
                res.status(400).json({
                    status: false,
                    message: 'App not found', 
                });
              }

            
        })
        .catch((err) => {
          res.status(500).json({
            status:false,
            message: 'Failed to check App existence', 
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

router.post('/master/deleteAllIps',(req,res,next) => {
       
    try{

        ValidateIP.deleteMany({})
        .then((result) => {

            if (result.deletedCount > 0) {
                res.status(200).json({
                    status:true,
                    message: "All Ips Deleted Successfully", 
                    records: result.deletedCount
                });
              }
              else{
                res.status(400).json({
                    status: false,
                    message: 'Ip not found',
                });
              }
        
        })
        .catch((err) => {
          res.status(500).json({
            status:false,
            message: 'Failed to check App existence', 
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