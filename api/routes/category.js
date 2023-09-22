const express = require('express');
const router = express.Router();
const Category = require('../model/category');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');


/**
 * @swagger
 * /api/category:
 *   get:
 *     summary: get all category
 *     description: get all category.
 *     responses:
 *       '200':
 *         description: get all category successful
 */


router.get('/',(req,res,next) => {
    Category.find().then(result => {
        res.status(200).json({
            status:true,
            message: "Date get successfully",
            records: result.length,
            data:[
                result 
            ]
        });
    }).catch(err=>{
        res.status(500).json({
            status:true,
            message: "Fetching category data failed",
            error:err
        });
    });
    // res.status(200).json({
    //     msg:"this is student get request"
    // });
});


router.post('/',(req,res,next) => {


    if (!req.body.categoryImage){
        return res.status(300).json({   status:false, message: 'categoryImage must be provided' });
    } 
    else if(!req.body.categoryName){
        return res.status(300).json({   status:false, message: 'categoryName must be provided' }); 
    }
 

    else if(typeof req.body.categoryImage !== 'string'){
        return res.status(300).json({   status:false, message: 'categoryImage must be string' });
    }
    else if(typeof req.body.categoryName !== 'string'){
        return res.status(300).json({   status:false, message: 'categoryName must be string' });
    }

    const  expectedKeys = ["categoryImage","categoryName"];
    // Check for extra fields
    const extraFields = Object.keys(req.body).filter(key => !expectedKeys.includes(key));


    if (extraFields.length > 0) {
        return res.status(300).json({
            status:false,
            msg: 'Invalid fields: ' + extraFields.join(', ') 
        });
    }

    try{
        const categoryId = new mongoose.Types.ObjectId;

        const category = new Category({
          _id:new mongoose.Types.ObjectId,
          categoryId: categoryId,
          categoryImage: req.body.categoryImage,
          categoryName: req.body.categoryName,
      });
      
      category.save().then(
          result =>{
          res.status(200).json({
              status:true,
              msg: "Category Added Successfully",
              data:[
                result
              ]
          })
          }
      ).catch(err => {
          res.status(500).json({
              status:false,
              message: 'Failed to add category', 
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


module.exports = router;