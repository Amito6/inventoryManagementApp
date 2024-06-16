const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    name : {
        type : String,
        required : [true,"Please add a name"]
    },
    email :{
        type : String,
        required : [true,"Please add a email"],
        unique : true,
        trim : true,
        match : [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a Vlaid Eemail"
        ]
    },
    password :{
        type : String,
        required : [true,"Please add a password"],
        minlength : [6, "password must be up to 6 characters"]
    },
    photo :{
        type: String,
        required : [True, "Please add a photo"],
        default : "https://i.ibb.co/4pDNDk1/avatar.png"
    },
    phone :{
        type : String,
        default : "+1"
    },
    bio: {
        type : String,
        default : "bio",
        maxlength : [
            250,"Password must not be more than 250 characters"
        ]
    }
    },{
        timestamps : true
});

const User = mongoose.model("user",userSchema);