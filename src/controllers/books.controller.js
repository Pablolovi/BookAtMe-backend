import Book from '../models/Book.js';
import axios from 'axios';

// Obtener los libros del usuario
export const getBooks = async (req, res) => {
    try {
        console.log("💬 Obteniendo libros del usuario:", req.user.id);
        const books = await Book.find({ user: req.user.id });
        console.log("✅ Libros obtenidos:", books);
        res.json(books);
    } catch (error) {
        console.error("❌ Error al obtener libros:", error.message);
        res.status(500).json({ message: error.message });
    }
};

// Agregar un nuevo libro
export const addBook = async (req,res) => {
    const { title, author_name, status, totalPages, startedAt } = req.body;
    console.log("💬 Agregando libro con datos:", req.body);

    const book = new Book({
        user: req.user.id,
        title,
        author_name,
        status,
        totalPages,
        startedAt
    });

    try {
        const createBook = await book.save();
        console.log("✅ Libro creado:", createBook);
        res.status(201).json(createBook);
    } catch (error) {
        console.error("❌ Error al crear libro:", error.message);
        res.status(400).json({ message: error.message });
    }
};

// Actualizar un libro existente
export const updateBook = async (req, res) => {
    const { title, author_name, status, totalPages, currentPage, finishedAt } = req.body;
    console.log("💬 Actualizando libro con ID:", req.params.id);

    try {
        console.log("💬 Datos de actualización:", req.body);
        const book = await Book.findById(req.params.id);

        if (!book) {
            console.log("❌ Libro no encontrado");
            return res.status(404).json({ message: "Libro no encontrado" });
        }

        if (book.user.toString() !== req.user.id) {
            console.log("❌ Usuario no autorizado para actualizar este libro");
            return res.status(401).json({ message: "No autorizado" });
        }

        book.title = title || book.title;
        book.author_name = author_name || book.author_name;
        book.status = status || book.status;
        book.totalPages = totalPages || book.totalPages;
        book.currentPage = currentPage || book.currentPage;
        book.finishedAt = finishedAt || book.finishedAt;

        const updateBook = await book.save();
        console.log("✅ Libro actualizado:", updateBook);
        res.json(updateBook);
    } catch (error) {
        console.error("❌ Error al actualizar libro:", error.message);
        res.status(400).json({ message: error.message });
    }
};

// Eliminar un libro
export const deleteBook = async (req, res) => {
    try {
        console.log("💬 Eliminando libro con ID:", req.params.id);
        const book = await Book.findById(req.params.id);

        if (!book) {
            console.log("❌ Libro no encontrado");
            return res.status(404).json({ message: "Libro no encontrado" });
        }

        if (book.user.toString() !== req.user.id) {
            console.log("❌ Usuario no autorizado para eliminar este libro");
            return res.status(401).json({ message: "No autorizado" });
        }

        await book.remove();
        console.log("✅ Libro eliminado:", book);
        res.json({ message: `El libro ${book.title} ha sido eliminado con éxito` });
    } catch (error) {
        console.error("❌ Error al eliminar libro:", error.message);
        res.status(400).json({ message: error.message });
    }
};

// Buscar libros externos (OpenLibrary)
export const searchExternalBooks = async (req, res) => {
    const { query } = req.query; 

    if (!query) {
        console.log("❌ Término de búsqueda no proporcionado");
        return res.status(400).json({ message: 'Debe proporcionar un término de búsqueda' });
    }

    try {
        // Hacer la petición a la API de Open Library
        const response = await axios.get(`https://openlibrary.org/search.json?q=${query}`);
        console.log("💬 Respuesta de Open Library:", response.data);
        const books = response.data.docs.map((book) => ({
            title: book.title,
            author_name: book.author_name || ['Autor desconocido'],
            number_of_pages_median: book.number_of_pages_median || 0,
            cover_url: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : null,
        }));
        console.log("✅ Libros externos encontrados:", books);

        res.json(books);
    } catch (error) {
        console.error("❌ Error al buscar libros externos:", error.message);
        res.status(500).json({ message: 'Error al buscar los libros', error: error.message });
    }
};
