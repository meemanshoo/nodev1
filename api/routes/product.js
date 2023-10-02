const express = require('express');
const router = express.Router();
const Product = require('../model/product');
const Category = require('../model/category');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const ValidateAdmin = require('../routes/admin/validateadmin');



/**
 * @swagger
 * /api/admin/addProduct:
 *   post:
 *     tags:
 *     - Product
 *     summary: Add product
 *     description: https://long-boa-sombrero.cyclic.app/api/admin/addProduct
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
 *               image:
 *                 type: string
 *                 format: string
 *                 description: The image of the Product.  
 *               name:
 *                  type: string
 *                  format: string
 *                  description: The name of the Product.     
 *               shortDesc:
 *                  type: string
 *                  format: string
 *                  description: The shortDesc of the Product.    
 *               price:
 *                  type: string
 *                  format: string
 *                  description: The price of the Product.     
 *               offPer:
 *                  type: string
 *                  format: string
 *                  description: The offPer of the Product. 
 *               stock:
 *                  type: string
 *                  format: string
 *                  description: The stock of the Product.
 * 
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

router.post('/admin/addProduct',(req,res,next) => {

    const respp = ValidateAdmin.validateAdminWithSha256(req,res);
   

    if (req.body.categoryId == undefined){
        return res.status(300).json({   status:false, message: 'categoryId must be provided' });
    } 
    else if(req.body.image == undefined){
        return res.status(300).json({   status:false, message: 'image must be provided' }); 
    }
    else if(req.body.name == undefined){
        return res.status(300).json({   status:false, message: 'name must be provided' }); 
    }
    else if(req.body.shortDesc == undefined){
        return res.status(300).json({   status:false, message: 'shortDesc must be provided' }); 
    }
    else if(req.body.price == undefined){
        return res.status(300).json({   status:false, message: 'price must be provided' }); 
    }
    else if(req.body.offPer == undefined){
        return res.status(300).json({   status:false, message: 'offPer must be provided' }); 
    }
    else if(req.body.stock == undefined){
        return res.status(300).json({   status:false, message: 'stock must be provided' }); 
    }
 

    else if(typeof req.body.categoryId !== 'string'){
        return res.status(300).json({   status:false, message: 'categoryId must be string' });
    }
    else if(typeof req.body.image !== 'string'){
        return res.status(300).json({   status:false, message: 'image must be string' });
    }
    else if(typeof req.body.name !== 'string'){
        return res.status(300).json({   status:false, message: 'name must be string' });
    }
    else if(typeof req.body.shortDesc !== 'string'){
        return res.status(300).json({   status:false, message: 'shortDesc must be string' });
    }
    else if(typeof req.body.price !== 'number'){
        return res.status(300).json({   status:false, message: 'price must be decimal128' });
    }
    else if(typeof req.body.offPer !== 'number'){
        return res.status(300).json({   status:false, message: 'offPer must be number' });
    }
    else if(typeof req.body.stock !== 'number'){
        return res.status(300).json({   status:false, message: 'stock must be number' });
    }

    const  expectedKeys = ["categoryId","image","name","shortDesc","price","offPer","stock"];
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

        Category.findOne({categoryId:req.body.categoryId}).then(
            categoryResult =>{
                if(!categoryResult){
                    res.status(400).json({
                        status:false,
                        message: 'Wrong Category Id', 
                    })
                }
                else{

                    const productId = new mongoose.Types.ObjectId;

                    const product = new Product({
                      _id:new mongoose.Types.ObjectId,
                      categoryId: req.body.categoryId,
                      productid:productId,
                      image: req.body.image,
                      name: req.body.name,
                      rates: 0,
                      noOfRatings: 0,
                      noOfViews: 0,
                      shortDesc: req.body.shortDesc,
                      price: req.body.price,
                      offPer: req.body.offPer,
                      isAssured: false,
                      stock:req.body.stock,
                      isActivated:true,
                  });
                  
                  product.save().then(
                      result =>{
                      res.status(200).json({
                          status:true,
                          msg: "Product Added Successfully in Category "+categoryResult["categoryName"],
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
                }
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
 * /api/products:
 *   post:
 *     tags:
 *     - Product
 *     summary: get all Product
 *     description: https://long-boa-sombrero.cyclic.app/api/products
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
 *               findByName:
 *                 type: string
 *                 description: The categoryId of the Category.   
 *               findByPriceAsc:
 *                 type: string
 *                 description: The categoryId of the Category.   
 *               findByPriceLessThen:
 *                 type: string
 *                 description: The categoryId of the Category.   
 *               findByPriceGreaterThen:
 *                 type: string
 *                 description: The categoryId of the Category.   
 *               findByAssured:
 *                 type: string
 *                 description: The categoryId of the Category.   
 *               findByRatesAbove:
 *                 type: string
 *                 description: The categoryId of the Category.   
 *               findByOffPerAbove:
 *                 type: string
 *                 description: The categoryId of the Category.  
 * 
 *     responses:
 *       '200':
 *         description: get all category successful
 */


// GET route to retrieve all products within a specific category
router.post('/products', async (req, res) => {
    try {
      
    if (req.body.categoryId == undefined){
        return res.status(300).json({   status:false, message: 'categoryId must be provided' });
    } 
    if(typeof req.body.categoryId !== 'string'){
        return res.status(300).json({   status:false, message: 'categoryId must be string' });
    }
    if (req.body.findByName != undefined){
        if(typeof req.body.findByName !== 'string'){
            return res.status(300).json({   status:false, message: 'findByName must be string' });
        }
    }
    if (req.body.findByPriceAsc != undefined){
        if(typeof req.body.findByPriceAsc !== 'boolean'){
            return res.status(300).json({   status:false, message: 'findByPriceAsc must be boolean' });
        }
    }
    if (req.body.findByPriceLessThen != undefined){
        if(typeof req.body.findByPriceLessThen !== 'number'){
            return res.status(300).json({   status:false, message: 'findByPriceLessThen must be integer' });
        }
    }
    if (req.body.findByPriceGreaterThen != undefined){
        if(typeof req.body.findByPriceGreaterThen !== 'number'){
            return res.status(300).json({   status:false, message: 'findByPriceGreaterThen must be integer' });
        }
    }
    if (req.body.findByAssured != undefined){
        if(typeof req.body.findByAssured !== 'boolean'){
            return res.status(300).json({   status:false, message: 'findByAssured must be boolean' });
        }
    }
    if (req.body.findByRatesAbove != undefined){
       
        if(typeof req.body.findByRatesAbove !== 'number'){
            return res.status(300).json({   status:false, message: 'findByRatesAbove must be number' });
        }
    }
    if (req.body.findByOffPerAbove != undefined){
       
        if(typeof req.body.findByOffPerAbove !== 'number'){
            return res.status(300).json({   status:false, message: 'findByOffPerAbove must be number' });
        }
    }

    if(req.body.findByRatesAbove < 0){
        return res.status(300).json({   status:false, message: 'findByRatesAbove must be grater then or equal to 0' });
    }
    if (req.body.findByRatesAbove > 5){
        return res.status(300).json({   status:false, message: 'findByRatesAbove must be less then or equal to 5' });
    }
    if (req.body.findByOffPerAbove < 0){
        return res.status(300).json({   status:false, message: 'offPer must be grater then or equal to 0' });
    }
    if (req.body.findByOffPerAbove > 100){
        return res.status(300).json({   status:false, message: 'offPer must be less then or equal to 100' });
    }
    
   
      // Find the category by its ID
      const category = await Category.findOne({ categoryId: req.body.categoryId });
   
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
  
      // Find all products that belong to the specified category
      const productsInCategory = await Product.find({
        $and : [
            { isActivated: true },
            {categoryId: req.body.categoryId},
            getLTPrice(req.body.findByPriceLessThen),
            getGTPrice(req.body.findByPriceGreaterThen),
            getAssured(req.body.findByAssured),
            getRateAbove(req.body.findByRatesAbove),
            getOfferAbove(req.body.findByOffPerAbove)
        ]})
      .sort(getPriceAscQuery(req.body.findByPriceAsc));

      if(productsInCategory.length == 0){
        return res.status(400).json({
            status:false,
            message: 'No Products in this category '+category["categoryName"],
        });
      }

       var data = searchProductsByLetter(productsInCategory,req.body.findByName);


      return res.status(200).json({
        status:true,
        message: 'Products in the category retrieved successfully',
        records: data.length,
        data: data,
    });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  });


  function getRateAbove(rates){
    var data = {};
    if(rates == undefined){
        data = {};
    }
    else{
        data = {rates:{$gte:rates}};
    }
    return data;
  }

  function getOfferAbove(offer){
    var data = {};
    if(offer == undefined){
        data = {};
    }
    else{
        data = {offPer:{$gte:offer}};
    }
    return data;
  }

  function getLTPrice(price){
    var data = {};
    if(price == undefined){
        data = {};
    }
    else{
        data = {price:{$lt:price}};
    }
    return data;
  }

  function getGTPrice(price){

    var data = {};
    if(price == undefined){
        data = {};
    }
    else{
        data = {price:{$gt:price}};
    }
    return data;
  }

  function getAssured(isAssured){
    var data = {};
    if(isAssured == undefined){
        data = {};
    }
    else{
        data =  {isAssured:{$in:[isAssured]}};
    }
    return data;
  }

  function searchProductsByLetter(list, letter) {
  

    if(letter == undefined || letter == null){
        letter = "";
    }
  
    // Convert the letter to lowercase for a case-insensitive search
    letter = letter.toLowerCase();
    // Use the filter method to find products whose names start with the specified letter
    const filteredProducts = list.filter(product => {
      const productName = product.name.toLowerCase();
      return productName.startsWith(letter);
    });

    console.log(filteredProducts);
    return filteredProducts;
  }

  function getPriceAscQuery(isAsc) {
    var jsonQuery = {};
    if(isAsc == undefined){
        jsonQuery = {};
    }
    else if(isAsc){
        jsonQuery = {price:1};
    }
    else{
        jsonQuery = {price:-1};
    }
    return jsonQuery;
  }















  // Create an endpoint to insert many objects
router.post('/insertManyDummyData', async (req, res) => {

    // https://app.json-generator.com/4EAkl6QJv9Rb

  try {
    // console.log("Api called successfully");
    // const products = req.body; // Assuming you are sending an array of objects in the request body
    // const result = await Product.insertMany(products);
  
    // console.log("insertMany successfully");


    const dummyProducts = await Product.find({});
      
    console.log("get all dummyProducts successfully");
    // Update the prices to random values
    for (const getProduct of dummyProducts) {
        // getProduct.offPer = getRandomNumber(0,50),
        // getProduct.stock = getRandomNumber(0,100),
        // getProduct.rates = getRandomNumber(0,5),
        // getProduct.noOfRatings = getRandomNumber(0,1000),
        // getProduct.noOfViews = getRandomNumber(0,1000),
        getProduct.image = getRandomMobileVarientNames(),
        // getProduct.isAssured = getRandomBoolean(),
        // getProduct.isActivated = true,
      await getProduct.save();
    }
    console.log("update all dummyProducts successfully");
    return res.status(200).json({ message: 'Prices updated successfully' });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

function getRandomNumber(min, max) {
    if (min > max) {
      throw new Error('Minimum value should be less than or equal to the maximum value');
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getRandomBoolean() {
    var value = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
    if(value == 0){
        return false;
    }
    else{
        return true;
    }

  }

  function getRandomName(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let name = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      name += characters.charAt(randomIndex);
    }
  
    return name;
  }

  function getRandomMobileVarientNames(){

    const mobileVariants = [
        'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/w/d/o/-original-imaghgbyhy6banxv.jpeg?q=70',
        'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/0/8/4/-original-imagfhu75eupxyft.jpeg?q=70',
        'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/a/i/v/-original-imagfhu6bdzhnmkz.jpeg?q=70',
        'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/f/c/v/-original-imagehzbaw2wugme.jpeg?q=70',
        'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/0/h/k/-original-imagcg22czc3ggvw.jpeg?q=70',
        'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/6/2/5/galaxy-m14-5g-sm-m146b-samsung-original-imagzwrqnpzujxks.jpeg?q=70',
        'https://rukminim2.flixcart.com/image/312/312/l3xcr680/mobile/a/x/k/-original-imagexezkeefuadb.jpeg?q=70',
        'Huawei P40 Pro',
        'LG V60 ThinQ',
        'Asus ROG Phone 5',
        'Nokia 9 PureView',
        'Motorola Edge+',
        'Realme GT',
        'Vivo X60 Pro+',
        'Lenovo Legion Phone Duel',
        'BlackBerry Key2',
        'ZTE Axon 30 Ultra',
        'HTC U12+',
        'Sony Xperia XZ3',
        'LG G8 ThinQ',
        'Xiaomi Mi Mix 4',
      ];
      var randomNo = getRandomNumber(0,mobileVariants.length-1);
      return mobileVariants[randomNo];
  }

module.exports = router;
