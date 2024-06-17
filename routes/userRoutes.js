const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logoutUser } = require("../controller/userController");

router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/logout",logoutUser);


/* The below route is protected one means that if token get verified than from that id we will find that user and then request will have that user to request.user so the the route that is going to use authMiddleware that is going to have requjest.user = user means the user that is logged in */
router.get("/getuser",protect,getUser);

module.exports = router;