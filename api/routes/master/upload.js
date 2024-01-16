const express = require('express');
const router = express.Router();
const multer = require('multer');
const MasterUpload = require('../../model/master_upload');
const sharp = require('sharp');

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

const storage = multer.memoryStorage(); // You can also use multer.diskStorage() for file storage

const upload = multer({ storage: storage });

router.post('/master/upload_image', upload.single('image') , (req,res,next) => {

    const image = req.file;

    if (!image) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    // Define a schema for the image
    const newImage = new MasterUpload({
        buffer: req.file.buffer,
        url: "asd",
        filename: image.originalname,
        mimetype: image.mimetype,
        size: image.size,
        uploadDate: Date.now()
    });

    newImage.save().then(
        result =>{
        res.status(200).json({
            status:true,
            msg:" Register Successfully",
            data:result
        })
        }
    ).catch(err => {
        res.status(500).json({
            status:false,
            message: 'Failed to register master user due to  is already exist', 
            error: err 
        })
    });
   

    // res.status(200).json({
    //     success: true,
    //     message: 'Image uploaded successfully',
    //     filename: image.originalname,
    //     mimetype: image.mimetype,
    //     size: image.size
    //   });
});


router.get('/master/getImage', upload.single('image') , (req,res,next) => {
   
    MasterUpload.findOne({_id: "65a51fa14fbb5ccf78f5b110"})
    .then(async result => {
        const bufferData = result.buffer;

        const pngBuffer = await sharp(bufferData).toFormat('png').toBuffer();
        res.setHeader('Content-Type', 'image/png');
        res.status(200).send(pngBuffer);
    }).catch(err=>{
        res.status(500).json({
            status:true,
            message: "Fetching category data failed",
            error:err
        });
    });
});



module.exports = router;