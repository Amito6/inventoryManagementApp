const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoute = require("./routes/userRoutes")
const PORT = process.env.PORT || 5000;

const app = express();

/* Testing in server.js */
app.get("/",(req,res)=>{
    res.send("Home Page")
})

/* MIddleawre to ahndle json and urlencoded data */

app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(bodyParser.json())

/* Routes Middleware */


app.use("/api/users",userRoute)

/* Connect to db and start server */

mongoose.connect(process.env.MONGO_URI).then(()=>{
    app.listen(PORT,()=>{
        console.log('Server is running on PORT ${PORT}')
    })
}).catch((error)=>{
    console.log(error)
})
