const express = require('express');
const router = express.Router();

const AppCheck = require('../../model/app_check');
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


router.post('/master/getAllApps',(req,res,next) => {
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
            query = { appName: { $regex: new RegExp(`^${req.body.search}`, 'i') } };
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
                appName: { $regex: new RegExp(`^${req.body.search}`, 'i') } 
            };
        }
        
    }

    AppCheck.find(query)
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
            message: "Faild to Fetch Apps details",
            error:err
        });
    });
});


router.post('/master/addApp',async  (req,res,next) => {


    if (req.body.appName == undefined){
        return res.status(300).json({   status:false, message: 'appName must be provided' });
    } 

    else if(typeof req.body.appName !== 'string'){
        return res.status(300).json({   status:false, message: 'appName must be string' });
    }

    const  expectedKeys = ["appName"];
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
        const existingApp = await AppCheck.findOne({appName: req.body.appName});
        console.log("existingUser");
        if(existingApp){
            return res.status(400).json({ status:false, message: 'appName must be unique' });
        }

        const appCheck = new AppCheck({
          appName: req.body.appName,
      });
      
      appCheck.save().then(
          result =>{
          res.status(200).json({
              status:true,
              message: "Your app '" + req.body.appName + "' is registered successfully.", 
              appId:result._id
          })
          }
      ).catch(err => {
          res.status(500).json({
              status:false,
              message: 'Failed to register master user', 
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


router.post('/master/changeAppStatus',(req,res,next) => {

    if(req.body.id == undefined){
        return res.status(300).json({   status:false, message: 'id must be provided'}); 
    }
    else if(req.body.isActivated  == undefined){
        return res.status(300).json({   status:false, message: 'isActivated must be provided' }); 
    }


    else if(typeof req.body.id !== 'string'){
        return res.status(300).json({   status:false, message: 'userId must be string' });
    }
    else if(typeof req.body.isActivated !== 'boolean'){
        return res.status(300).json({   status:false, message: 'isActivated must be Boolean' });
    }
    if(req.body.message != undefined){
        // isActivated use
        if(typeof req.body.message !== 'string'){
            return res.status(300).json({   status:false, message: 'message must be string' });
        }
    }
    if(req.body.isActivatedCap != undefined){
        // isActivatedcap use
        if(typeof req.body.isActivatedCap !== 'number'){
            return res.status(300).json({   status:false, message: 'isActivatedCap must be number' });
        }
    }

    const  expectedKeys = ["id","isActivated","isActivatedCap","message"];
    // Check for extra fields
    const extraFields = Object.keys(req.body).filter(key => !expectedKeys.includes(key));


    if (extraFields.length > 0) {
        return res.status(300).json({
            status:false,
            message: 'Invalid fields: ' + extraFields.join(', ') 
        });
    }
   
  
       
    try{
        let updateObject = {};
        const activationMessage = req.body.isActivated ? 'App is Activated' : 'App is currently blocked. Please contact to support team for further details';

        const messageString = req.body.message == undefined ? activationMessage : req.body.message;
        if(req.body.isActivatedCap != undefined){
            updateObject = {
                $set: {
                  isActivated: req.body.isActivated,
                  message: messageString,
                  isActivatedCap : req.body.isActivatedCap
                }
              };
            
        }
        else{
            updateObject = {
                $set: {
                  isActivated: req.body.isActivated,
                  message: messageString
                }
              };
            
        }
        

        AppCheck.findOneAndUpdate({ _id: req.body.id }, updateObject, {new: true, })
        .then((result) => {

            if (!result) {
                // If the resource is not found, return a 200 status code with a message
                return res.status(400).json({
                    status: false,
                    message: 'App not found', 
                });
              }

              return res.status(200).json({
                    status:true,
                    message: result.appName + " " + activationMessage, 
                });

        
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


router.post('/master/addDummyApp',async  (req,res,next) => {


    if (req.body.noOfDummies == undefined){
        return res.status(300).json({   status:false, message: 'noOfDummies must be provided' });
    } 

    else if(typeof req.body.noOfDummies !== 'number'){
        return res.status(300).json({   status:false, message: 'noOfDummies must be number' });
    }

    const  expectedKeys = ["noOfDummies"];
    // Check for extra fields
    const extraFields = Object.keys(req.body).filter(key => !expectedKeys.includes(key));


    if (extraFields.length > 0) {
        return res.status(300).json({
            status:false,
            msg: 'Invalid fields: ' + extraFields.join(', ') 
        });
    }

    try{
       

        const index = await AppCheck.find().count();
        const appsArray = [];

        for(let i = 0 ; i < req.body.noOfDummies ; i++){
            const isActivated = i % 2 === 0;
            const appCheck = new AppCheck({
                appName: "Dummy AppName "+(index + (i+1)),
                isActivated: isActivated,
            });

            appsArray.push(appCheck);
        }
      
        AppCheck.insertMany(appsArray).then(
            result => {

            // Map the result array to create a new array with only the desired fields
            const modifiedResult = result.map(app => ({
                appName: app.appName,
                message: app.message,
                isActivated: app.isActivated,
                _id: app._id,
            }));

            res.status(200).json({
                status:true,
                msg: result.length + " Dummy Apps added Successfully",
                data: modifiedResult
            })
            }
        ).catch(err => {
            res.status(500).json({
                status:false,
                message: 'Failed to add dummy apps', 
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

router.post('/master/deleteApp',(req,res,next) => {

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

router.post('/master/deleteAllApps',(req,res,next) => {
       
    try{

        AppCheck.deleteMany({})
        .then((result) => {

            if (result.deletedCount > 0) {
                res.status(200).json({
                    status:true,
                    message: "All Apps Deleted Successfully", 
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

module.exports = router;