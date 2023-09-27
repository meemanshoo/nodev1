const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const StoreOtp = require('../../model/storeotp');



/**
 * @swagger
 * /api/clearstoredotps:
 *   delete:
 *     tags:
 *     - Admin
 *     summary: For truncate stored otps
 *     description: https://long-boa-sombrero.cyclic.app/api/clearstoredotps
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

router.delete('/',(req,res,next) => {   
    // delete store otp collection from db.

    if(!req.body.adminUserName){
        return res.status(300).json({   status:false, message: 'adminUserName must be provided' }); 
    }
    else if(!req.body.adminPassword){
        return res.status(300).json({   status:false, message: 'adminPassword must be provided' }); 
    }

    else if(typeof req.body.adminUserName !== 'string'){
        return res.status(300).json({   status:false, message: 'adminUserName must be string' });
    }
    else if(typeof req.body.adminPassword !== 'string'){
        return res.status(300).json({   status:false, message: 'adminPassword must be string' });
    }
   
    
    const  expectedKeys = ["adminUserName","adminPassword"];
    // Check for extra fields
    const extraFields = Object.keys(req.body).filter(key => !expectedKeys.includes(key));


    if (extraFields.length > 0) {
        return res.status(300).json({
            status:false,
            message: 'Invalid fields: ' + extraFields.join(', ') 
        });
    }

    if(req.body.adminUserName !== "meem"){
        return res.status(400).json({
            status:false,
            message: 'Invalid Admin Username'
        });
    }
    else if(req.body.adminPassword !== "123456"){
        return res.status(400).json({
            status:false,
            message: 'Invalid Admin Password'
        });
    }
    else{
        truncateCollection(res);
    }


});


async function truncateCollection(res) {
    try {
      // Connect to your MongoDB database
      await mongoose.connect('mongodb+srv://Meemanshoo:zysPz6ifrWXETmPV@cluster0.x44mmbb.mongodb.net/?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
  
      const count = await StoreOtp.countDocuments();

      if(count === 0){
        
        // no document available

        res.status(400).json({ 
            status: false, 
            message: 'No documents to delete.' 
        });
        return; // Stop here

      }else{

        // document available

        
      // Truncate (remove all documents from) the collection
      const result = await StoreOtp.deleteMany({});

      res.status(200).json({
        status:true,
        message: 'Deleted ' + result.deletedCount + ' documents from the collection successfully.'
    });
  
      // Close the Mongoose connection
      mongoose.connection.close();

      }
  
    } catch (err) {

        res.status(500).json({
        status:false,
        message: 'Error truncating collection:', 
        error:err
    });
    }
  }

  module.exports = router;