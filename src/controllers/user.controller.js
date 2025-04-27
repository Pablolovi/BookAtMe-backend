import User from "../models/User.js";

export const getUserProfile = async (req, res) => {
    try {
        console.log("💬 Obteniendo el perfil del usuario:", req.user.id);
        
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            console.log("❌ Usuario no encontrado");
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        
        console.log("✅ Perfil de usuario encontrado:", user);
        res.json(user);
    } catch (error) {
        console.error("❌ Error al obtener el perfil del usuario:", error.message);
        res.status(500).json({ message: error.message });
    }
};

export const updateUserProfile = async (req, res) => {
    const { name, email, bio, avatar, favoriteGenres } = req.body;
    
    try {
        console.log("💬 Actualizando el perfil del usuario con datos:", req.body);
        
        const user = await User.findById(req.user.id);

        if (!user) {
            console.log("❌ Usuario no encontrado");
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.bio = bio || user.bio;
        user.avatar = avatar || user.avatar;
        user.favoriteGenres = favoriteGenres || user.favoriteGenres;

        const updatedUser = await user.save();
        console.log("✅ Perfil de usuario actualizado:", updatedUser);
        res.json(updatedUser);
    } catch (error) {
        console.error("❌ Error al actualizar el perfil del usuario:", error.message);
        res.status(400).json({ message: error.message });
    }
};
