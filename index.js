const http = require('http');
require('dotenv').config();

const app = require('./app')

const port = process.env.PORT || 4000;
const host = process.env.HOST;

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });