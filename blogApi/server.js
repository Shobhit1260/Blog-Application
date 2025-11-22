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

// Use explicit CORS origin in production; in development allow the dev server
// origin to be reflected which simplifies local testing with Vite proxy.
const corsOptions = process.env.NODE_ENV === 'production'
    ? { origin: process.env.FRONTEND_URL || 'https://blog.shobhitsri.me', credentials: true }
    : { origin: true, credentials: true };

app.use(cors(corsOptions));

app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

 


const port=process.env.PORT || 5000;

// Mount routes
app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api', aiRoutes);

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})