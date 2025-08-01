import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import messageRoutes from './routes/messageRoutes';
import matchRoutes from './routes/match';
import userRoutes from './routes/user';
import discoverRoutes from './routes/discover';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import http from 'http';
import { Message } from './models/message';

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
app.use('/api/user', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/discover', discoverRoutes);


io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
        return next(new Error('Authentication token missing'));
    }




    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        (socket as any).userId = (decoded as any).id;
        next();
    } catch (err) {
        console.error('JWT verification failed:', err);
        next(new Error('Authentication failed'));
    }
});

io.on('connection', (socket) => {
    const userId = (socket as any).userId;
    console.log('🟢 User connected:', userId);

    onlineUsers.set(userId, socket.id);
    io.emit('onlineUsers', Array.from(onlineUsers.keys()));

    socket.on('markRead', async ({ from, to }) => {

        await Message.updateMany(
            { sender: from, receiver: to, isRead: false },
            { isRead: true }
        );

        const toSocketId = onlineUsers.get(from);
        if (toSocketId) {
            io.to(toSocketId).emit('readMessages', { readerId: to });
        }
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
        for (const [id, sockId] of onlineUsers.entries()) {
            if (sockId === socket.id) {
                onlineUsers.delete(id);
                break;
            }
        }
        io.emit('onlineUsers', Array.from(onlineUsers.keys()));
        console.log('🔴 User disconnected:', userId);
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
