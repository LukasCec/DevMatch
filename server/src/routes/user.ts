import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { User } from '../models/User';

const router = express.Router();

// GET /api/user/me
router.get('/me', authMiddleware, async (req: any, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});


router.put('/me', authMiddleware, async (req: any, res) => {
    try {
        const { techStack, goal, level, availability, avatar } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { techStack, goal, level, availability, avatar },
            { new: true }
        ).select('-password');

        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
