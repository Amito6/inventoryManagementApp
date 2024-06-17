const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
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
        required : [true, "Please add a photo"],
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

/* Encrypt Password before saving it to database */

userSchema.pre("save",async function(next){

    /* to work with edit profile field as there we are not going to give any option for password cahnge, so if not modified then we can say it can direct save the changes  if needed */
    if(!this.isModified("password")){
        next();
    }
    const hashedPassword = await bcrypt.hash(this.password,10);
    this.password = hashedPassword;
})

const User = mongoose.model("user",userSchema);

module.exports = User;