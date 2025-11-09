const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes.js');
const blogRoutes = require('./routes/blogRoutes.js');

// loading environment variables
dotenv.config();
// connecting databse
connectDB();
// initializing express app
const app=express();
// middleware
// allow credentials so cookies can be sent from the frontend
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());

// routes
app.use('/api/users',userRoutes);
app.use('/api/blogs',blogRoutes);

// start Server
const port=process.env.PORT || 5000;
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})