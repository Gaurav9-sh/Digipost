const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const letterRoutes = require('./routes/letters')
const cookieParser = require('cookie-parser');
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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
