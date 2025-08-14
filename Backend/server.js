import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import letterRoutes from './routes/letters.js';
import settingRoutes from './routes/settings.js';


dotenv.config();

const app = express();

// Middleware
// Increase JSON body size limit
app.use(cookieParser())
app.use(express.json({ limit: '10mb' })); // Adjust the limit as needed
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // For URL-encoded payloads
app.use(cors(
    {
        origin:"http://localhost:5173",
        credentials: true,  
    }
));

// Database connection
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error(err));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/letters',letterRoutes);
app.use('/api/user',settingRoutes)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
