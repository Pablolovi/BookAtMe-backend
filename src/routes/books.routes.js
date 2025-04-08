// src/routes/books.routes.js
import express from 'express';
import { getBooks, addBook, updateBook, deleteBook } from '../controllers/books.controller.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getBooks);
router.post('/', protect, addBook);
router.put('/:id', protect, updateBook);
router.delete('/:id', protect, deleteBook);

export default router;