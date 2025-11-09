
const mongoose=require('mongoose');
const connectDB=async()=>{
    try{
        const mongoUri = process.env.MONGO_URI;
        await mongoose.connect(mongoUri);
        console.log("MongoDb connected");
    }
    catch(err){
        console.error(err.message);
        process.exit(1);
    }
}
module.exports=connectDB;