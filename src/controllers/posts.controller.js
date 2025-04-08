// src/controllers/comments.controller.js
import Post from "../models/Post.js";

export const createPost = async (req, res) => {
    const { title, content } = req.body;

    const post = new Post({
        user: req.user.id,
        title,
        content
    });

    try {
        const createdPost = await post.save();
        res.status(201).json(createdPost);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('user', 'name');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('user', 'name');
        if (!post) return res.status(404).json({ message: "Post no encontrado" });
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Post no encontrado" });
        }

        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "No autorizado" });
        }

        await post.remove();
        res.json({ message: "Post eliminado" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
