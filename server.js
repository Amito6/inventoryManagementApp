const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoute = require("./routes/userRoutes");
const errorHandler = require("./middleware/errorMiddleware");
const cookieParser = require("cookie-parser")
const app = express();



const PORT = process.env.PORT || 5000;

/* Testing in server.js */
app.get("/",(req,res)=>{
    res.send("Home Page")
})

/* MIddleawre to ahndle json and urlencoded data */

app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(bodyParser.json());
app.use(cookieParser())

/* Routes Middleware */


app.use("/api/users",userRoute)


/* Error Middleware */

app.use(errorHandler);

/* Connect to db and start server */

mongoose.connect(process.env.MONGO_URI).then(()=>{
    app.listen(PORT,()=>{
        console.log('Server is running on PORT ${PORT}')
    })
}).catch((error)=>{
    console.log(error)
})
