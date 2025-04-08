// src/routes/posts.routes.js
import express from 'express';
import { createPost, getPosts, getPostById, deletePost } from '../controllers/posts.controller.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getPosts); 
router.get('/:id', getPostById); 
router.post('/', protect, createPost);
router.delete('/:id', protect, deletePost);

export default router;