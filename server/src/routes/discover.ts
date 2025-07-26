import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { User } from '../models/User';

const router = express.Router();

// GET /api/discover
router.get('/', authMiddleware, async (req: any, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.userId } }).select('-password');

        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
