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


router.post('/master/getUsers',(req,res,next) => {
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
            query = { gmail: { $regex: new RegExp(`^${req.body.search}`, 'i') } };
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
                gmail: { $regex: new RegExp(`^${req.body.search}`, 'i') } 
            };
        }
        
    }

    MasterUser.find(query)
    // .select('-uploadDate -updateDate -__v -isActivated') 
    .select('-__v')
    .sort({ uploadDate: -1 })
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
            message: "Fetching category data failed",
            error:err
        });
    });
});


router.post('/master/addUser',async  (req,res,next) => {

  
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

        const masterUser = new MasterUser({
          gmail: req.body.gmail,
          password: req.body.password,
          pin: req.body.pin,
          isActivated: false,
          uploadDate: Date.now(),
          updateDate: Date.now(),
      });
      
      masterUser.save().then(
          result =>{
          res.status(200).json({
              status:true,
              msg: result.gmail + " Register Successfully",
              data:[
                  {
                      id: result._id
                  }
              ]
          })
          }
      ).catch(err => {
          res.status(500).json({
              status:false,
              message: 'Failed to register master user due to ' + Object.keys(err.keyPattern)[0] + ' is already exist', 
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


router.post('/master/changeStatus',(req,res,next) => {

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

    const  expectedKeys = ["id","isActivated"];
    // Check for extra fields
    const extraFields = Object.keys(req.body).filter(key => !expectedKeys.includes(key));


    if (extraFields.length > 0) {
        return res.status(300).json({
            status:false,
            message: 'Invalid fields: ' + extraFields.join(', ') 
        });
    }
   
  
       
    try{

        const isActivated = { isActivated: req.body.isActivated };


        MasterUser.findOneAndUpdate({ _id: req.body.id }, { $set: isActivated }, { new: true })
        .then((result) => {

            if (!result) {
                // If the resource is not found, return a 200 status code with a message
                return res.status(400).json({
                    status: false,
                    message: 'User not found', 
                });
              }

              const activationMessage = req.body.isActivated ? 'User is Activated' : 'User is De-Activated';

                res.status(200).json({
                    status:true,
                    message: activationMessage, 
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


router.post('/master/addDummyData',async  (req,res,next) => {


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
       

        const index = await MasterUser.find().count();
        const masterUsersArray = [];

        for(let i = 0 ; i < req.body.noOfDummies ; i++){
            const isActivated = i % 2 === 0;
            const masterUser = new MasterUser({
                gmail: "DummyGmail"+(index + (i+1))+"@gmail.com",
                password: "00000"+(index + (i+1)),
                pin: "11111"+(index + (i+1)),
                isActivated: isActivated,
                uploadDate: Date.now(),
                updateDate: Date.now(),
            });

            masterUsersArray.push(masterUser);
        }
      
        MasterUser.insertMany(masterUsersArray).then(
            result => {

            // Map the result array to create a new array with only the desired fields
            const modifiedResult = result.map(user => ({
                gmail: user.gmail,
                password: user.password,
                pin: user.pin,
                isActivated: user.isActivated,
                _id: user._id,
            }));

            res.status(200).json({
                status:true,
                msg: result.length + " Dummy Users Register Successfully",
                data: modifiedResult
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

router.post('/master/deleteUser',(req,res,next) => {

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

        MasterUser.deleteOne({ _id: req.body.id })
        .then((result) => {

            if (result.deletedCount === 1) {
                res.status(200).json({
                    status:true,
                    message: "User Deleted Successfully", 
                    records: result.deletedCount
                });
              }
              else{
                res.status(400).json({
                    status: false,
                    message: 'User not found', 
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
    
});

router.post('/master/deleteAllUser',(req,res,next) => {
       
    try{

        MasterUser.deleteMany({})
        .then((result) => {

            if (result.deletedCount > 0) {
                res.status(200).json({
                    status:true,
                    message: "User Deleted Successfully", 
                    deletedCount: result.deletedCount
                });
              }
              else{
                res.status(400).json({
                    status: false,
                    message: 'User not found', 
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
    
});

module.exports = router;