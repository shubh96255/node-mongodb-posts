const User = require("../models/User");
/* function is used to get/check single user */
async function checkExist(query){
    return  User.findOne(query);
}

/* function is used to add a new user */
async function addUser(data){
    return User.create(data);
}

/* function is used to update a particular user */
async function updateUser(query,data){
    return User.updateOne(query,data);
}


module.exports = {
    checkExist,
    addUser,
    updateUser
}