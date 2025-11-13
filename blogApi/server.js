const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes.js');
const blogRoutes = require('./routes/blogRoutes.js');
const aiRoutes = require('./routes/airoutes.js');
const passport = require('passport');
const authRoutes = require('./routes/authRoutes');

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
app.use(express.urlencoded({ extended: true }));

// Initialize passport for OAuth
app.use(passport.initialize());

// routes
app.use('/api/users',userRoutes);
app.use('/api/blogs',blogRoutes);
app.use('/api', aiRoutes);
// OAuth routes
app.use('/api/auth', authRoutes);

// start Server
const port=process.env.PORT || 5000;
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})