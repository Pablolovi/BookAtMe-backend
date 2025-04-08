// src/models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: ''},
    bio: { type: String, default: ''},
    favoriteGenres: [String]
}, {
    timestamps: true,
});

export default mongoose.model('User', userSchema);