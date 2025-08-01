import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: '/avatars/avatar1.png' },

    techStack: [String],
    goal: String,
    level: String,
    availability: String,
});

export const User = mongoose.model('User', userSchema);
