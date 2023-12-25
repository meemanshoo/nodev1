const express = require('express');
const router = express.Router();



/**
 * @swagger
 * /api/xtwitter:
 *   get:
 *     tags:
 *     - xtwitter
 *     summary: get all category
 *     description: https://long-boa-sombrero.cyclic.app/api/xtwitter
 *     responses:
 *       '200':
 *         description: get all category successful
 */


router.get('/xtwitter',(req,res,next) => {
    res.status(500).json({
        status:true,
        message: "Fetching xtwitter successfully"
    });
});




module.exports = router;