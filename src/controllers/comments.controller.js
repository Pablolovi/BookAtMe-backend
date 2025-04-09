// src/controllers/comments.controller.js
import Comment from "../models/Comment.js";

export const addComment = async (req, res) => {
    const { postId, content } = req.body;

    const comment = new Comment({
        post: postId,
        user: req.user.id,
        content
    });

    try {
        const createdComment = await comment.save();
        res.status(201).json(createdComment);
    } catch (error) {
        res.status(400).json({ message: error. message });
    }
};

export const getCommentsByPost = async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.id }).populate('user', 'name');
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};