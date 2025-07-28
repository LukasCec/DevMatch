import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import messageRoutes from './routes/messageRoutes';
import matchRoutes from './routes/match';

import { Server } from 'socket.io';
import http from 'http';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

const onlineUsers = new Map<string, string>();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => res.send('DevMatch API is running 🚀'));
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/match', matchRoutes);

// Socket.IO
io.on('connection', (socket) => {
    console.log('🟢 User connected:', socket.id);

    socket.on('join', (userId: string) => {
        onlineUsers.set(userId, socket.id);
        io.emit('onlineUsers', Array.from(onlineUsers.keys()));
    });

    socket.on('sendMessage', (data) => {
        const receiverSocketId = onlineUsers.get(data.receiver);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', data);
        }
    });

    socket.on('typing', ({ from, to }) => {
        const toSocketId = onlineUsers.get(to);
        if (toSocketId) {
            io.to(toSocketId).emit('typing', from);
        }
    });

    socket.on('stopTyping', ({ from, to }) => {
        const toSocketId = onlineUsers.get(to);
        if (toSocketId) {
            io.to(toSocketId).emit('stopTyping', from);
        }
    });

    socket.on('disconnect', () => {
        for (const [userId, sockId] of onlineUsers.entries()) {
            if (sockId === socket.id) {
                onlineUsers.delete(userId);
                break;
            }
        }
        io.emit('onlineUsers', Array.from(onlineUsers.keys()));
        console.log('🔴 User disconnected:', socket.id);
    });
});

mongoose
    .connect(process.env.MONGO_URI!)
    .then(() => {
        console.log('✅ Connected to MongoDB');
        server.listen(process.env.PORT || 5000, () =>
            console.log(`🚀 Server listening on port ${process.env.PORT || 5000}`)
        );
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err);
    });
