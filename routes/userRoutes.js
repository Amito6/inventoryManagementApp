const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logoutUser,getUser, loginStatus, updateUser } = require("../controller/userController");
const protect = require("../middleware/authMiddleware")

router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/logout",logoutUser);


/* The below route is protected one means that if token get verified than from that id we will find that user and then request will have that user to request.user so the the route that is going to use authMiddleware that is going to have requjest.user = user means the user that is logged in */
router.get("/getuser", protect, getUser);

/* to check if user is loggedIn */
router.get("/loggedIn",loginStatus);

/* create Route to update user */

router.patch("/updateuser",protect, updateUser)

module.exports = router;