const express = require('express');
const router = express.Router();
const Register = require('../model/register');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');

/**
 * @swagger
 * /api/usernameisunique/:
 *   get:
 *     summary: Get data based on username query parameter.
 *     description: Retrieve data using the provided username query parameter for checking username is exist or not.
 *     parameters:
 *       - in: query
 *         name: userName
 *         required: true
 *         schema:
 *           type: string
 *         description: The username to query.
 *     responses:
 *       200:
 *         description: Successful response.
 */



router.get('/',(req,res,next) => {
    console.log("asd");
    // Access query parameters using req.query
  const { userName } = req.query;

  if(!userName){
    return res.status(300).json({
           status:false,
            message: 'userName must be provided' 
        }); 
  }

  Register.findOne({ userName : userName })
  .then(existingUserName => {
    if (existingUserName) {
        return res.status(200).json({
            status:true,
            message: 'User exist.',   
        });
    }
    else{
        return res.status(200).json({
            status:false,
            message: 'User not exist.',   
        });
    }
  }).catch(err=>{
    res.status(500).json({
        status:false,
        message: 'Failed to check userName existence.',   
        error:err
    });
});

//    Register.findById(req.params.userName).then(result => {
    // res.status(200).json({
    //     studentData: userName
    // });
// }).catch(err=>{
//     res.status(500).json({
//         status:false, 
//           message: 'Failed to check userName existence', 
//           error: error 
//     });
// });

});

module.exports = router;