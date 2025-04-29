import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import bookRoutes from './routes/books.routes.js';
import taskRoutes from './routes/task.routes.js';
import userRoutes from './routes/users.routes.js';

dotenv.config();
const app = express();

// Intentamos conectar a la base de datos
connectDB().then(() => {
    console.log('Base de datos conectada con éxito');
}).catch((error) => {
    console.error('Error al conectar con la base de datos:', error);
    process.exit(1); // Detenemos el servidor si la conexión falla
});

// Middlewares
const allowedOrigins = [
    'http://localhost:5173',
    'https://680e9d6d50e613a880245933--fastidious-gelato-73771b.netlify.app']

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
  }));
  app.use(express.json());  // Asegúrate de que express.json() esté antes de las rutas

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
    console.error('Error en el servidor:', err.stack);
    res.status(500).json({ message: 'Algo salió mal en el servidor', error: err.message });
});

// Configuración del puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
