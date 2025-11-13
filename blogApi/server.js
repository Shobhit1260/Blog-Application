const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes.js');
const blogRoutes = require('./routes/blogRoutes.js');
const aiRoutes = require('./routes/airoutes.js');


dotenv.config();
connectDB();
const app=express();

app.use(cors({ origin: true, credentials: true }));

app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/api/users',userRoutes);

app.use('/api/blogs',blogRoutes);
app.use('/api', aiRoutes);


const port=process.env.PORT || 5000;

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})