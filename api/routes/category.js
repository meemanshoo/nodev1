const express = require('express');
const router = express.Router();
const Category = require('../model/category');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const ValidateAdmin = require('../routes/admin/validateadmin');

/**
 * @swagger
 * /api/category:
 *   get:
 *     tags:
 *     - Category
 *     summary: get all category
 *     description: https://long-boa-sombrero.cyclic.app/api/category
 *     responses:
 *       '200':
 *         description: get all category successful
 */


router.get('/category',(req,res,next) => {
    Category.find({ categoryStatus: true }).then(result => {
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
    // res.status(200).json({
    //     msg:"this is student get request"
    // });
});

/**
 * @swagger
 * /api/admin/allCategory:
 *   get:
 *     tags:
 *     - Category
 *     summary: get all category
 *     parameters:
 *       - in: header
 *         name: keys
 *         required: true
 *         schema:
 *           type: string
 *           format: string
 *         description: keys is SHA-256 hash of body parameter of clearstoredotps api
 *     description: https://long-boa-sombrero.cyclic.app/api//admin/allCategory
 *     responses:
 *       '200':
 *         description: get all category successful
 */

router.get('/admin/allCategory',(req,res,next) => {

    const respp = ValidateAdmin.validateAdminWithSha256(req,res);

    
    if(respp){
        return res.status(300).json({   status:false, message: respp }); 
    }
    else{
        try {
            Category.find().then(result => {
                res.status(200).json({
                    status:true,
                    message: "Date get successfully",
                    records: result.length,
                    data:result
                });
            }).catch(err=>{
                res.status(400).json({
                    status:true,
                    message: "Fetching category data failed",
                    error:err
                });
            });
        } catch (error) {
            res.status(500).json({
                status:true,
                message: "Something went wrong",
                error:error
            });
        }
    }

  
    // res.status(200).json({
    //     msg:"this is student get request"
    // });
});


/**
 * @swagger
 * /api/admin/addCategory:
 *   post:
 *     tags:
 *     - Category
 *     summary: Add category
 *     description: https://long-boa-sombrero.cyclic.app/api/admin/addCategory
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryImage:
 *                 type: string
 *                 description: The categoryImage of the Category.      
 *               categoryName:
 *                 type: string
 *                 format: string
 *                 description: The categoryName of the Category.           
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

router.post('/admin/addCategory',(req,res,next) => {

    const respp = ValidateAdmin.validateAdminWithSha256(req,res);
   

    if (req.body.categoryImage == undefined){
        return res.status(300).json({   status:false, message: 'categoryImage must be provided' });
    } 
    else if(req.body.categoryName == undefined){
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

    if(respp){
        return res.status(300).json({   status:false, message: respp }); 
    }
    else{
 
    try{
        const categoryId = new mongoose.Types.ObjectId;

        const category = new Category({
          _id:new mongoose.Types.ObjectId,
          categoryId: categoryId,
          categoryImage: req.body.categoryImage,
          categoryName: req.body.categoryName,
          categoryStatus: true
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

    }

    
});



/**
 * @swagger
 * /api/admin/changeStatusCategory:
 *   patch:
 *     tags:
 *     - Category
 *     summary: Delete category from id
 *     description: https://long-boa-sombrero.cyclic.app/api/admin/changeStatusCategory
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryId:
 *                 type: string
 *                 description: The categoryId of the Category.               
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
router.patch('/admin/changeStatusCategory',(req,res,next) => {

    const respp = ValidateAdmin.validateAdminWithSha256(req,res);


    if (req.body.categoryId == undefined){
        return res.status(300).json({   status:false, message: 'categoryId must be provided' });
    } 
    else if (req.body.categoryStatus == undefined){
        return res.status(300).json({   status:false, message: 'categoryStatus must be provided' });
    } 

    else if(typeof req.body.categoryId !== 'string'){
        return res.status(300).json({   status:false, message: 'categoryId must be string' });
    }
    else if(typeof req.body.categoryStatus !== 'string'){
        return res.status(300).json({   status:false, message: 'categoryStatus must be string' });
    }

    const  expectedKeys = ["categoryId","categoryStatus"];
    // Check for extra fields
    const extraFields = Object.keys(req.body).filter(key => !expectedKeys.includes(key));


    if (extraFields.length > 0) {
        return res.status(300).json({
            status:false,
            msg: 'Invalid fields: ' + extraFields.join(', ') 
        });
    }

    if(respp){
        return res.status(300).json({   status:false, message: respp }); 
    }
    else{
 
    try{    
        
        const updateFields = {};
        updateFields.categoryStatus = req.body.categoryStatus;

        Category.findOneAndUpdate({ categoryId: req.body.categoryId }, { $set: updateFields }, { new: req.body.categoryStatus }).then(
            result =>{
            
                if(result != null){
                    return res.status(200).json({
                        status:true,
                        message: "Change Status to " + req.body.categoryStatus + " of category : " + result["categoryName"], 
                    });
                }
                else{
                  
                    return res.status(400).json({
                        status:false,
                        message: 'Category not found'
                    });
                }
          
            }
        ).catch(err => {
            return res.status(500).json({
                status:false,
                message: 'Failed to check categoryId existence', 
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

    }

    
});


module.exports = router;