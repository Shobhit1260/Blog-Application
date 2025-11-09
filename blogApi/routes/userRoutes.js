const express=require("express");
const router=express.Router();
const {registerUser,loginUser,forgotpassword,resetPassword,logout}=require('../controllers/usercontroller')

router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/forgotpassword',forgotpassword);
router.put('/password/reset/:token',resetPassword);
router.get('/logout',logout);


module.exports=router;