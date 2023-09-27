const express = require('express');
const router = express.Router();
const Currency = require('../../model/currency');
const mongoose = require('mongoose');



router.get('/',(req,res,next) => {
    Currency.find().then(result => {
        res.status(200).json({
            status:true,
            count:result.length,
            data:result
           
        });
    }).catch(err=>{
        res.status(500).json({
            status:false,
            error:err
        });
    });
    // res.status(200).json({
    //     msg:"this is student get request"
    // });
});


router.post('/getBySymbol',(req,res,next) => {
try {
      if(!req.body.coinSymbol){
            return res.status(400).json({   status:false, error: 'coinSymbol must be provided' });
        }

        else if(typeof req.body.coinSymbol !== 'string'){
            return res.status(400).json({   status:false, error: 'coinSymbol must be string' });
        }

        const  expectedKeys = ["coinSymbol"];
           // Check for extra fields
        const extraFields = Object.keys(req.body).filter(key => !expectedKeys.includes(key));

         
      if (extraFields.length > 0) {
        return res.status(400).json({   status:false, error: 'Invalid fields: ' + extraFields.join(', ') });
      }

        // Build the query dynamically based on the column and value
  const query = {};
  query["coinSymbol"] = req.body.coinSymbol;

  Currency.find(query)
  .then(data => {
    const length = data.length;
    if(length > 0){
        res.status(200).json({ status:true,  data });
    }
    else{
        res.status(400).json({ status:false,  error: 'Failed to search data', data: error });
    }

  })
  .catch(error => {
    res.status(400).json({ status:false,  error: 'Failed to search data', data: error });
  });
      
} catch (err) {
    res.status(400).json({
        status:false,
        error:err
    });
}

});

router.post('/',(req,res,next) => {

    try {

        if (!req.body.coinName){
            return res.status(400).json({   status:false, error: 'coinName must be provided' });
        } 
        else if(!req.body.coinShortName){
            return res.status(400).json({   status:false, error: 'coinShortName must be provided' }); 
        }
        else if(!req.body.coinImage){
            return res.status(400).json({   status:false, error: 'coinImage must be provided' }); 
        }
       
        else if(!req.body.coinDecimalCurrency){
            return res.status(400).json({   status:false, error: 'coinDecimalCurrency must be provided' });
        }
        else if(isNaN(req.body.coinListed)){
            return res.status(400).json({   status:false, error: 'coinListed must be provided' });
        }
        else if(!req.body.coinDecimalPair){
            return res.status(400).json({   status:false, error: 'coinDecimalPair must be provided' });
        }
        else if(!req.body.geckoVs_currency){
            return res.status(400).json({   status:false, error: 'geckoVs_currency must be provided' });
        }
        else if(!req.body.geckoIds){
            return res.status(400).json({   status:false, error: 'geckoIds must be provided' });
        }


        else if(typeof req.body.coinName !== 'string'){
            return res.status(400).json({   status:false, error: 'coinName must be string' });
        }
        else if(typeof req.body.coinImage !== 'string'){
            return res.status(400).json({   status:false, error: 'coinImage must be string' });
        }
        else if(typeof req.body.coinShortName !== 'string'){
            return res.status(400).json({   status:false, error: 'coinShortName must be string' });
        }
        else if(typeof req.body.coinSymbol !== 'string'){
            return res.status(400).json({   status:false, error: 'coinSymbol must be string' });
        }
        else if(req.body.coinPairWith && typeof req.body.coinPairWith !== 'string'){
            return res.status(400).json({   status:false, error: 'coinPairWith must be string' });
        }
        else if(typeof req.body.coinDecimalCurrency !== 'string'){
            return res.status(400).json({   status:false, error: 'coinDecimalCurrency must be string' });
        }
        else if(typeof req.body.coinListed !== 'boolean'){
            return res.status(400).json({   status:false, error: 'coinListed must be string' });
        }
        else if(typeof req.body.coinDecimalPair !== 'string'){
            return res.status(400).json({   status:false, error: 'coinDecimalPair must be string' });
        }
        else if(typeof req.body.geckoVs_currency !== 'string'){
            return res.status(400).json({   status:false, error: 'geckoVs_currency must be string' });
        }
        else if(typeof req.body.geckoIds !== 'string'){
            return res.status(400).json({   status:false, error: 'geckoIds must be string' });
        }

      const  expectedKeys = ["coinName","coinImage","coinShortName","coinSymbol","coinPairWith","coinDecimalCurrency",
      "coinListed", "coinDecimalPair","geckoVs_currency","geckoIds"];
         // Check for extra fields
      const extraFields = Object.keys(req.body).filter(key => !expectedKeys.includes(key));
    
      if (extraFields.length > 0) {
        return res.status(400).json({   status:false, error: 'Invalid fields: ' + extraFields.join(', ') });
      }
    

      Currency.findOne({ coinSymbol : req.body.coinSymbol })
        .then(existingCurrency => {

        if (existingCurrency) {
            return res.status(400).json({ status:false, error: 'Currency already exists' });
          }

          
        const currency = new Currency({
            _id:new mongoose.Types.ObjectId,
            coinName:req.body.coinName,
            coinImage:req.body.coinImage,
            coinShortName: req.body.coinShortName,
            coinSymbol:req.body.coinSymbol,
            coinPairWith: req.body.coinPairWith || 'USDT',
            coinDecimalCurrency: req.body.coinDecimalCurrency,
            coinListed:req.body.coinListed,
            coinDecimalPair: req.body.coinDecimalPair,
            geckoVs_currency: req.body.geckoVs_currency,
            geckoIds: req.body.geckoIds,
        });

        currency.save().then(
            result =>{
            res.status(200).json({
                status:true,
                newStudent:result
            })
            }
        ).catch(err => {
            res.status(400).json({
                status:false,
                error:err
            });
        });

    })
    .catch(error => {
      res.status(400).json({ status:false, error: 'Failed to check currency existence', details: error });
    });


    } catch (err) {
        res.status(400).json({
            status:false,
            error:err
        });
    }
   
});

router.delete('/',(req,res,next) => {
    Currency.deleteMany().then(result => {
        res.status(200).json({
            status:true,
            studentData:result
        });
    }).catch(err=>{
        res.status(500).json({
            status:false,
            error:err
        });
    });
    // res.status(200).json({
    //     msg:"this is student get request"
    // });
});

module.exports = router;