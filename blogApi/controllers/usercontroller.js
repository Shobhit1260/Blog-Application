const User=require('../models/userSchema');
const sendEmail = require('../utils/emailSender');
const  sendtoken = require('../utils/sendtoken');
const crypto = require('crypto');

// Register User
exports.registerUser=async (req,res)=>{
    try{

        const {username,email,password,confirmpassword}=req.body;
        const userExists = await User.findOne({email});
        if(userExists){
            console.log("user exists with this email");
           return res.status(400).json({message:'Email already exists'}) 
        }
        if(password !== confirmpassword){
            return res.status(400).json({
                success:false,
            })} 
        const user= await User.create({
            username,
            email,
            password,
        })
      
        if(!user) return res.status(400).json({message:"User is not saved in database"})
        sendtoken(200,user,res);

    }
    catch(error){
       console.error(error,"error while registering the user");
       res.status(500).json({
        success:false,
        message:"Internal server Error"
       })  
    }
}

// login User
exports.loginUser=async (req,res)=>{
    try{
        const {email,password}=req.body;

        if(!email || !password) return res.status(400).json({message:"email or password not valid"})

        const user= await User.findOne({email}).select('+password');

        if(!user)
           return res.status(400).json({message:"invalid email or user"})

        // @ts-ignore
        const isMatched=await user.comparePassword(password);

        if(!isMatched){
            return res.status(400).json({
                success:false,
                message:"Invalid passowrd"})
        }
        sendtoken(200,user,res);

    }
    catch(error){
       console.error(error);
       res.status(500).json({
        success:false,
        message:"Internal server Error"
       })
    }
}

exports.forgotpassword=async(req,res,next)=>{
    try{
        console.log("hi");
        const user=await User.findOne({email:req.body.email});
        if(!user)
            return res.status(404).json({success:false,message:"email not found."})
        const token=user.getResetToken();
        await user.save();
       
        
        // Frontend reset URL (update this to your frontend URL in production)
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const resetUrl = `${frontendUrl}/reset-password/${token}`;
        
        try{
        await sendEmail({
            to: user.email,
            subject: "Reset Password - Blogger",
            text: `Hi ${user.username},\n\nYou requested to reset your password.\n\nClick the link below to reset your password:\n\n${resetUrl}\n\nThis link will expire in 10 minutes.\n\nIf you did not request this, please ignore this email.\n\nBest regards,\nBlogger Team`,
        })
        res.status(200).json({
            success:true,
            message:"Email is successfully send."});
        }
        catch(error){
            user.resetPasswordToken=undefined;
            user.resetPasswordTokenexpire=undefined;
            await user.save();
            res.status(500).json("Email is not sent");
        }    
    }
    catch(error){
       console.error(error);
       res.status(500).json({message:"internal server error"}) 
    }
}

exports.resetPassword=async (req,res)=>{
    try{
    const {password,confirmPassword}=req.body;
    const resetPasswordToken= crypto.
                       createHash('sha256').
                       update(req.params.token).
                       digest('hex'); 
    const user=await User.findOne({
        resetPasswordToken,
        resetPasswordTokenexpire:{$gt:Date.now()}
    });  
   

    if(!user)
        return res.status(404).json({message:'user not found'});
    if(password !== confirmPassword){
        return  res.status(400).json({
            success:false,
            message:"passwords are not matching"
        })}
    user.password=req.body.password; 
    user.resetPasswordToken=undefined;
    user.resetPasswordTokenexpire=undefined; 
    await user.save();  
    sendtoken(201,user,res);
}
catch (error) {
    console.error(error);
    res.status(500).json({
        success: false,
        message: "Internal server error",
    });
}
         
}

exports.logout = async(req,res)=>{
    try{
      res.cookie('Token',null,{
        expires:new Date(Date.now()),
        httpOnly:true
      })
      res.status(200).json({
        success:true,
        message:'Logout successfully'
    });
    }
    catch(error){
        console.error(error);
        res.status(500).json({message:"internal Server error"})
    }
}