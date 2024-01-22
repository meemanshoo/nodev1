const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

// const basicAuth = require('express-basic-auth');
const app = express();



// Create a WebSocket server by passing the HTTP server as a parameter
// const wss = new WebSocket.Server({ server });


//Master
const MasterUserRoute = require('./api/routes/master/master_user');
const MasterUploadRoute = require('./api/routes/master/upload');
const AppCheckRoute = require('./api/routes/master/app_check');
const ValidateIPRoute = require('./api/routes/master/validate_ip');

//Admin
const AdminValidateRoute = require('./api/routes/admin/validate');



const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const pwd = process.env.DB_PWD;
const url = `mongodb+srv://Meemanshoo:${pwd}@cluster0.x44mmbb.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(url);

mongoose.connection.on('error',err => {
    console.log('connection failed');
});

mongoose.connection.on('connected',connected => {
    console.log('connection successfull');
});


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/api',AppCheckRoute);
app.use('/api',ValidateIPRoute);

// Define your users with their username and password
// const users = {
//   'admin': 'supersecret',
//   'meemanshoo': 'meem@123',
// };

// Middleware for basic authentication
// app.use(basicAuth({
//   users: users,
//   challenge: true, // It will prompt users to enter credentials if not provided
//   unauthorizedResponse: 'Unauthorized',
// }));

app.use('/api',MasterUserRoute);
app.use('/api',AdminValidateRoute);
app.use('/api',MasterUploadRoute);




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


module.exports = app;