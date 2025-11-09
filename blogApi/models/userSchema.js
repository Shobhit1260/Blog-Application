const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto=require('crypto');
const userSchema = new mongoose.Schema({
     username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        },
    email:{
            type:String,
            required:true,
            unique:true,
            trim:true,
        } ,
    password:{
            type:String,
            required:true,
        },  
    profilePic:{
        type:String,
        default:"",
    } ,
    role:{
      type:String,
      enum:["user","admin"],
      default:"user",
    },
    resetPasswordToken:String,
    resetPasswordTokenexpire:Date,       
   
},{timestamps:true});
 
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      return next();
    } catch (error) {
      return next(error);
    }
  });
userSchema.methods.comparePassword=async function (password) {
    const isValid = await bcrypt.compare(password, this.password);
    return isValid;
}

userSchema.methods.generateToken=function (){
  return jwt.sign(
  { id: this._id.toString() }, 
  // @ts-ignore
  process.env.SECRET_KEY, 
  { expiresIn: "7d" });
};

userSchema.methods.getResetToken=function (){
    const resetToken= crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken= crypto.
                          createHash('sha256').
                          update(resetToken).
                          digest('hex');
    this.resetPasswordTokenexpire=Date.now()+15*60*1000;
    return resetToken;                     
}

module.exports= mongoose.model('User',userSchema);