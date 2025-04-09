// src/controllers/books.controller.js
import Book from '../models/Book.js';
import axios from 'axios';

export const getBooks = async (req, res) => {
    try {
        const books = await Book.find({ user: req.user.id });
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addBook = async (req,res) => {
    const { title, author, status, totalPages, startedAt } = req.body;

    const book = new Book({
        user: req.user.id,
        title,
        author,
        status,
        totalPages,
        startedAt
    });

    try {
        const createBook = await book.save();
        res.status(201).json(createBook);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateBook = async (req, res) => {
    const { title, author, status, totalPages, currentPage, finishedAt } = req.body;

    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: "Libro no encontrado" });
        }

        if (book.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "No autorizado" });
        }

        book.title = title || book.title;
        book.author = author || book.author;
        book.status = status || book.status;
        book.totalPages = totalPages || book.totalPages;
        book.currentPage = currentPage || book.currentPage;
        book.finishedAt = finishedAt || book.finishedAt;

        const updateBook = await book.save();
        res.json(updateBook);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(401).json({ message: "Libro no encontrado" });
        }

        if (book.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "No autorizado" });
        }

        await book.remove();
        res.json({ message: "Libro eliminado" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const searchExternalBooks = async (req, res) => {
    const { query } = req.query; 

    if (!query) {
        return res.status(400).json({ message: 'Debe proporcionar un término de búsqueda' });
    }

    try {
        // Hacer la petición a la API de Open Library
        const response = await axios.get(`https://openlibrary.org/search.json?q=${query}`);
        const books = response.data.docs.map((book) => ({
            title: book.title,
            author_name: book.author_name || ['Autor desconocido'],
            number_of_pages_median: book.number_of_pages_median || 0,
            cover_url: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : null,
        }));

        res.json(books);
    } catch (error) {
        res.status(500).json({ message: 'Error al buscar los libros', error: error.message });
    }
};