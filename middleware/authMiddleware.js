const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const protect = asyncHandler(async(request,response)=>{
    try {
        const token = request.cookies.token;
        if(!token){
            response.status(401);
            throw new Error("Not Authorised,please login at first");
        }
        /* verify token */

        const verified = jwt.verify(token,process.env.JWT_SECRETS);
        /* when verified get user ID from token as token consist of user ID */
        const user = await User.findById(verified.id)
        console.log(user);
        if(!user){
            response.status(400);
            throw new Error("User Not found")
        }
        request.user = user;
        next();
    } catch (error) {
        response.status(401);
        throw new Error("Not Authorised,Please login")
    }
});

module.exports = protect;