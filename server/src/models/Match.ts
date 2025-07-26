import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

export const Match = mongoose.model('Match', matchSchema);
