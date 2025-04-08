// src/controllers/user.controller.js
import User from "../models/User.js";

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUserProfile = async (req, res) => {
    const { name, email, bio, avatar, favoriteGenres } = req.body;

    try {
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        user.name = name || user.name
        user.email = email || user.email
        user.bio = bio || user.bio
        user.avatar = avatar || user.avatar
        user.favoriteGenres = favoriteGenres || user.favoriteGenres;

        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};