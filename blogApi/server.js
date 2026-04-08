const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes.js');
const blogRoutes = require('./routes/blogRoutes.js');
const aiRoutes = require('./routes/airoutes.js');
const mongoose = require('mongoose');


dotenv.config();
connectDB();
const app=express();

// Initialize Passport (Google OAuth) and mount auth routes
try {
    const initPassport = require('./config/passport');
    const authRoutes = require('./routes/authRoutes');
    initPassport(app);
    app.use('/api/auth', authRoutes);
} catch (err) {
    console.warn('Auth routes not mounted:', err && err.message ? err.message : err);
}

// Use explicit CORS origin in production; in development allow the dev server
// origin to be reflected which simplifies local testing with Vite proxy.
const corsOptions = process.env.NODE_ENV === 'production'
    ? { origin: process.env.FRONTEND_URL || 'https://blog.shobhitsri.me', credentials: true }
    : { origin: true, credentials: true };

app.use(cors(corsOptions));

app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
const healthCheck = (req, res) => {
    const dbState = mongoose.connection.readyState;
    const dbStatus = dbState === 1 ? 'connected' : dbState === 2 ? 'connecting' : dbState === 3 ? 'disconnecting' : 'disconnected';
    const ok = dbState === 1;

    res.status(ok ? 200 : 503).json({
        status: ok ? 'ok' : 'degraded',
        message: ok ? 'Backend is healthy' : 'Backend is running but the database is not connected',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        database: dbStatus
    });
};

app.get('/health', healthCheck);
app.get('/api/health', healthCheck);

app.get('/', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Blog API is running',
        docs: {
            health: '/health',
            apiHealth: '/api/health'
        }
    });
});

 


const port=process.env.PORT || 5000;

// Mount routes
app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api', aiRoutes);

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})