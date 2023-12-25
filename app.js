const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const app = express();


///unused
const studentRoute = require('./api/routes/unused/student');
const currencyRoute = require('./api/routes/unused/currency');

//user route
const registerRoute = require('./api/routes/register');
const sendemailotpRoute = require('./api/routes/sendemailotp');
const categoryRoute = require('./api/routes/category');
const productRoute = require('./api/routes/product');
const xtwitterRoute = require('./api/routes/xtwitter');


//admin


const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb+srv://Meemanshoo:zysPz6ifrWXETmPV@cluster0.x44mmbb.mongodb.net/?retryWrites=true&w=majority');

mongoose.connection.on('error',err => {
    console.log('connection failed');
});

mongoose.connection.on('connected',connected => {
    console.log('connection successfull');
});

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use('/api/student',studentRoute);
app.use('/api/currency',currencyRoute);
app.use('/api',registerRoute);
app.use('/api',sendemailotpRoute);
app.use('/api',categoryRoute);
app.use('/api',productRoute);
app.use('/api',xtwitterRoute);


// Define Swagger options
const swaggerOptions = {
  definition: {
    openapi: '3.0.0', // Specify the version of OpenAPI (Swagger) you are using
    info: {
      title: 'Your API Documentation', // Title of your API
      version: '1.0.0', // Version of your API
      description: 'Documentation for your API',
    },
  },
  // Paths to API docs and your API endpoints
  apis: ['./api/routes/*.js','./api/routes/admin/*.js'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

  // Serve Swagger documentation using Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use((req,res,next) => {
    res.status(404).json({
        error:"bad request"
    });
});

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      return res.status(400).json({  status:false, error: 'Invalid JSON payload' });
    }
    next(err);
  });

// app.use((req, res, next) => {
//     res.status(200).json({
//         message:'Its works!'
//     });
// });

module.exports = app;