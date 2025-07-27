import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import discoverRoutes from './routes/discover';
import matchRoutes from './routes/match';
import messageRoutes from './routes/messageRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Test route
app.get('/', (_req, res) => {
    res.send('DevMatch API is running 🚀');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/discover', discoverRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/messages', messageRoutes);

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI!)
    .then(() => {
        console.log('✅ Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`🚀 Server listening on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err);
    });
