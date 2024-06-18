const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateToken = (id) =>{
    return jwt.sign({id},process.env.JWT_SECRETS,{expiresIn : "1d"})
}


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

    const token = generateToken(user._id);
    response.cookie("token",token,{
        path : "/",
        httpOnly : true,
        expires : new Date(Date.now() + 1000*86400),  /* 1 d */
        sameSite : "none",
        secure:  true
    })
    
    if(user){
        const {_id,name,email,photo,phone,bio} = user;
        response.status(201).json({
            _id,name,email,photo,bio,token
        })
    }
    else{
        response.status(400);
        throw new Error("Invalid User Data")
    }
});

const loginUser = asyncHandler(async(request,response)=>{
    const {email,password} = request.body;
    /* validate user input */
    if(!email || !password){
        response.status(400);
        throw new Error("Pl;ease add email and passowrd");
    }
    /* check if user exists in database */

    const user = await User.findOne({email});
    if(!user){
        response.status(404);
        throw new Error("USer not found, Please signup first");
    }
    /* user exists, check if password is correct */

    const passwordIsCorrect = await bcrypt.compare(password,user.password);
    const token = generateToken(user._id);

    if(user && passwordIsCorrect){
        response.cookie("token",token,{
            path :"/",
            httpOnly : true,
            expires : new Date(Date.now() + 1000 * 86400),
            sameSite : "none",
            secure : true
        })
        const {_id,name,email,photo,phone,bio} = user;
        response.status(200).json({
            _id,name,email,photo,phone,bio
        });
    }else{
        response.status(500);
        throw new Error("Invalid email or password");
    }
    response.send("Login USer Requested");


});

const logoutUser = asyncHandler(async(request,response)=>{
    /* Logout functionality is to make token emply so it won't be get verified and re route the servere back to signup page */
    response.cookie("token","",{
        path : "/",
        httpOnly : true,
        expires : new Date(0), /* same sec */
        sameSite : "none",
        secure : true
    });
    return response.status(200).json({
        message : "Successfully Logged Out"
    })
    response.send("Logout Call initiated");

});

/* Create user Profile Route */

/* on fronend on profile page we are getting the userData to display it there so now . we need to create a route to get userInfo from there and form there we can edit or modify the data
 */

const getUser = asyncHandler(async (request,response)=>{
    const user = await User.findById(request.user._id);
    if(user){
        const {_id,name,email,photo,phone,bio} = user;
        response.status(200).json({
            _id,name,email,photo,phone,bio
        })
    }else{
        response.status(400);
        throw new Error("User Not Found");
    }
    response.send("Get User data Api Requested");
});

const loginStatus = asyncHandler (async (request,response)=>{
    const token = request.cookies.token;
    if(!token){
        return response.json(false)
    }
    /* verify token */
    const verified = jwt.verify(token,process.env.JWT_SECRETS);
    if(verified){
        return response.json(true)
    }
    
});

const updateUser = asyncHandler(async(request,response)=>{
    const user = await User.findById(request.user._id)
    if(user){
        const user = await User.findById(request.user._id)
        if(user){
            const {_id,name,email,photo,phone,bio} = user;
            user.email = email,
            user.name = request.body.name || name;
            user.phone = request.body.phone || phone;
            user.bio = request.body.bio || bio;
            user.photo = request.body.photo || photo;
        }

        const updateUserRes = await user.save();
        response.status(200).json({
            _id : updateUserRes._id,
            name : updateUserRes.name,
            email : updateUserRes.email,
            photo : updateUserRes.photo,
            phone : updateUserRes.phone,
            bio : updateUserRes.bio
        })
    }
    else{
        response.status(404);
        throw new Error("User Not found")
    }
});


module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUser,
    loginStatus,
    updateUser
}