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
    bio:{
        type:String,
        default:"",
        maxlength:500,
    },
    avatar:{
        type:String,
        default:"",
    },
    bgImage:{
        type:String,
        default:"",
    },
    location:{
        type:String,
        default:"",
    },
    website:{
        type:String,
        default:"",
    },
    postsCount:{
        type:Number,
        default:0,
    },
    followersCount:{
        type:Number,
        default:0,
    },
    followingCount:{
        type:Number,
        default:0,
    },
    // Store actual follower/following references
    followers:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    following:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    role:{
      type:String,
      enum:["user","admin"],
      default:"user",
    },
    resetPasswordToken:String,
    resetPasswordTokenexpire:Date,
    // Settings
    settings:{
        notifications:{
            emailNotifications:{
                type:Boolean,
                default:true,
            },
            commentNotifications:{
                type:Boolean,
                default:true,
            },
            likeNotifications:{
                type:Boolean,
                default:true,
            },
            newFollowerNotifications:{
                type:Boolean,
                default:true,
            },
            weeklyDigest:{
                type:Boolean,
                default:true,
            },
        },
        privacy:{
            profileVisibility:{
                type:String,
                enum:["public","private","followers"],
                default:"public",
            },
            showEmail:{
                type:Boolean,
                default:false,
            },
            allowComments:{
                type:Boolean,
                default:true,
            },
            showReadingStats:{
                type:Boolean,
                default:true,
            },
        },
    },       
   
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