import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { Message } from '../models/message';
import { AuthRequest } from '../types/AuthRequest';

const router = express.Router();

router.get('/:userId', authMiddleware, async (req: AuthRequest, res) => {
    const myId = req.userId!;
    const otherId = req.params.userId;

    const messages = await Message.find({
        $or: [
            { sender: myId, receiver: otherId },
            { sender: otherId, receiver: myId },
        ],
    }).sort({ createdAt: 1 });

    res.json(messages);
});

router.post('/:userId', authMiddleware, async (req: AuthRequest, res) => {
    const sender = req.userId!;
    const receiver = req.params.userId;
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ message: 'Content is required' });
    }

    const message = await Message.create({ sender, receiver, content });
    res.status(201).json(message);
});


router.get('/', authMiddleware, async (req: AuthRequest, res) => {
    try {
        const myId = req.userId!;

        // 1. Nájdeš všetky správy, kde je aktuálny používateľ zapojený
        const messages = await Message.find({
            $or: [{ sender: myId }, { receiver: myId }],
        }).populate(['sender', 'receiver']);

        // 2. Vytvoríš mapu na unikátnych používateľov
        const chatUsers = new Map<string, any>();

        // 3. Z každého message vytiahneš "toho druhého" používateľa
        messages.forEach((msg: any) => {
            const other =
                msg.sender._id.toString() === myId ? msg.receiver : msg.sender;

            chatUsers.set(other._id.toString(), {
                _id: other._id,
                name: other.name,
                email: other.email,
            });
        });

        res.json(Array.from(chatUsers.values()));
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});


router.put('/:userId/read', authMiddleware, async (req: any, res) => {
    try {
        const currentUserId = req.userId;
        const otherUserId = req.params.userId;

        await Message.updateMany(
            { sender: otherUserId, receiver: currentUserId, isRead: false },
            { isRead: true }
        );

        res.status(200).json({ message: 'Messages marked as read' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});


export default router;
