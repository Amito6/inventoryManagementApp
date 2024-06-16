const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const registerUser = asyncHandler( async (request,response)=>{
    const {name,email,password} = request.body;
    /* Validation */
    if(!name || !email ||!password){
        response.status(400);
        throw new Error("Please fille in all the required fields")
    }
    if(password.length < 6){
        response.status(400);
        throw new Error("Password must be up to 6 Characters");
    }
    /* check if user email already exists */
    const userExists = await User.findOne({email})

    if(userExists){
        response.status(400);
        throw new Error("EMail has already been registered")
    }
    /* create new User */

    const user = await User.create({
        name,
        email,
        password
    });
    console.log(user);
    
    if(user){
        const {_id,name,email,photo,phone,bio} = user;
        response.status(201).json({
            _id,name,email,photo,bio
        })
    }
    else{
        response.status(400);
        throw new Error("Invalid User Data")
    }
});

module.exports = {
    registerUser
}