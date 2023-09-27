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


// Export the functions so they can be used in other modules
module.exports = {
    validateotp
  };