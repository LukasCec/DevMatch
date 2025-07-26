import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { Like } from '../models/Like';
import { Match } from '../models/Match';

const router = express.Router();

// POST /api/match/:targetUserId
router.post('/:targetUserId', authMiddleware, async (req: any, res) => {
    const fromUserId = req.userId;
    const toUserId = req.params.targetUserId;

    if (fromUserId === toUserId) {
        return res.status(400).json({ message: "Nemôžeš lajkovať seba" });
    }

    try {

        const existingLike = await Like.findOne({ from: toUserId, to: fromUserId });

        if (existingLike) {

            await Match.create({ users: [fromUserId, toUserId] });


            await Like.deleteMany({
                $or: [
                    { from: fromUserId, to: toUserId },
                    { from: toUserId, to: fromUserId },
                ],
            });

            return res.status(200).json({ message: '💥 It’s a match!' });
        }


        await Like.create({ from: fromUserId, to: toUserId });

        res.status(200).json({ message: '👍 Like sent' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/', authMiddleware, async (req: any, res) => {
    try {
        const userId = req.userId;

        // Nájde všetky matchy, kde si medzi users
        const matches = await Match.find({ users: userId }).populate('users', '-password');

        // Odstránime sám seba zo zoznamu
        const matchedUsers = matches.map((match) =>
            match.users.find((user: any) => user._id.toString() !== userId)
        );

        res.json(matchedUsers);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
