// src/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
    let token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        console.log("❌ Token no encontrado en headers");
        return res.status(401).json({ message: "No autorizado, token faltante" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        console.log("✅ Usuario autenticado:", req.user.email);
        next();
    } catch (error) {
        console.log("❌ Error al verificar token:", error.message);
        res.status(401).json({ message: "Token inválido" });
    }
};


export default protect;
