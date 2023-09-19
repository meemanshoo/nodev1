const express = require('express');

const app = express();



const studentRoute = require('./api/routes/student');
const currencyRoute = require('./api/routes/currency');
const registerRoute = require('./api/routes/register');
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

app.use('/student',studentRoute);
app.use('/currency',currencyRoute);
app.use('/register',registerRoute);

// app.use((req,res,next) => {
//     res.status(404).json({
//         error:"bad request"
//     });
// });

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