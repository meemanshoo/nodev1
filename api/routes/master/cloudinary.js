const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
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

// Configure Cloudinary
cloudinary.config({
    cloud_name: 'dkmwzhrrq',
    api_key: '394452877378877',
    api_secret: 'rkyTRxGG_M7IPnTqDOvSLc4KPr4'
});


// Function to get the count of images in a folder
const getImageCountInFolder = async (folder) => {
    const result = await cloudinary.api.resources({ type: 'upload', prefix: folder });
    return result.resources.length;
  };

  const getAllImagesInFolder = async (folder) => {
    try {
      const result = await cloudinary.api.resources({
        type: 'upload',
        prefix: folder
      });
  
      return result.resources;
    } catch (error) {
      console.error('Error fetching images:', error);
      throw error;
    }
  };


router.post('/cloudinary/upload_image', upload.single('image') , async(req,res,next) => {
    try {

        // Specify the folder, filename, tags, and metadata in Cloudinary
        const folder = 'test';
        const tags = ['tag1', 'tag2'];
        const metadata = {
        key1: 'value1',
        key2: 'value2'
        };

         // Get the count of images in the folder
        const imageCount = await getImageCountInFolder(folder);

        // Use the count to create a new filename
        const filename = `image_${imageCount + 1}`;

        // Upload the image to Cloudinary using upload_stream
        const result = await cloudinary.uploader.upload_stream({
             
            folder,
            public_id: filename, // Specify a custom filename
            tags,
            context: metadata, // Metadata to associate with the image
            },(err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Failed to upload to Cloudinary' });
          }
    // Log or use the details of the uploaded image
    console.log('Public ID:', result.public_id);
    console.log('URL:', result.secure_url);
    console.log('Width:', result.width);
    console.log('Height:', result.height);
    console.log('Format:', result.format);
          res.status(200).json({
            success: true,
            message: 'Image uploaded successfully',
            imageUrl: result.secure_url
          });
        }).end(req.file.buffer);
        
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
      }
});

router.post('/cloudinary/getAllImages', upload.single('image') , async(req,res,next) => {

// Example usage
const folder = 'test';

getAllImagesInFolder(folder)
  .then(images => {
    images.forEach(image => {
      console.log('Public ID:', image.public_id);
      console.log('URL:', image.secure_url);
      console.log('Width:', image.width);
      console.log('Height:', image.height);
      console.log('Format:', image.format);
      console.log('-------------------');
    });
    res.status(500).json({ success: false, message: 'Internal server error',data:images });
  })
  .catch(error => {
    console.error('Failed to fetch images:', error);
  });
});



module.exports = router;