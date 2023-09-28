const crypto = require('crypto');

function validateotp(req,res){
    if(!req.body.adminUserName){
        return 'adminUserName must be provided'; 
    }
    else if(!req.body.adminPassword){
        return 'adminPassword must be provided'; 
    }

    else if(typeof req.body.adminUserName !== 'string'){
        return 'adminUserName must be string';
    }
    else if(typeof req.body.adminPassword !== 'string'){
        return 'adminPassword must be string';
    }
   
    
    const  expectedKeys = ["adminUserName","adminPassword"];
    // Check for extra fields
    const extraFields = Object.keys(req.body).filter(key => !expectedKeys.includes(key));


    if (extraFields.length > 0) {
        return 'Invalid fields: ' + extraFields.join(', ');
    }

    if(req.body.adminUserName !== "meem"){
        return 'Invalid Admin Username';
    }
    else if(req.body.adminPassword !== "123456"){
        return 'Invalid Admin Password';
    }
    else{
        return '';
    }
   
}

function validateAdminWithSha256(req,res){


    if(!req.headers.keys){
        return 'keys must be provided in Header'; 
    }

        // Get headers from the request object
        const receivedHash  = `{"adminUserName": "meem","adminPassword": "123456"}`;



        // Hash the known value using SHA-256
    const hash = crypto.createHash('sha256').update(receivedHash).digest('hex');

    console.log(hash);
    
    if(hash === req.headers.keys.toLowerCase()){
      // Respond with the received headers
      return '';
    }
    else{
      // Respond with the received headers
      return 'Invalid Header Autherization';
    }
    
}


// Export the functions so they can be used in other modules
module.exports = {
    validateotp,validateAdminWithSha256
  };