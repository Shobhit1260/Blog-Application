const mongoose=require('mongoose');
const blogSchema= new mongoose.Schema({
   title:{
    type:String,
    required:true, 
   },
   content:{
    type:String,
    required:true, 
   },
   coverImage:{
    type:String,
    default:"", 
   },
   author:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true,
   },
   categories:[
    {type:String}
   ],
   tags:
   [{type:String}],
   likes: [
    { type: mongoose.Schema.Types.ObjectId, 
    ref: "User" }],
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      }],
    views:{
     type:Number,
     default:0
 },
   published:{
    type:Boolean,
    default:false, 
   },
},{timestamps:true});
module.exports=mongoose.model('Blog',blogSchema);