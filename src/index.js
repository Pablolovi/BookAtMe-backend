// src/index.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import bookRoutes from './routes/books.routes.js';
import taskRoutes from './routes/task.routes.js';
import postRoutes from './routes/posts.routes.js';
import userRoutes from './routes/users.routes.js';


dotenv.config();
const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Algo salió mal en el servidor' });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});