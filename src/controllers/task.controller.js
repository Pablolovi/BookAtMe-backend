import Task from '../models/Task.js';

export const getTasks = async (req, res) => {
    try {
        console.log("💬 Obteniendo tareas del usuario:", req.user.id);
        const tasks = await Task.find({ user: req.user.id });
        console.log("✅ Tareas obtenidas:", tasks);
        res.json(tasks);
    } catch (error) {
        console.error("❌ Error al obtener tareas:", error.message);
        res.status(500).json({ message: error.message });
    }
};

export const createTask = async (req, res) => {
    const { title, description, dueDate } = req.body;
    console.log("💬 Creando tarea con datos:", req.body);

    const task = new Task({
        user: req.user.id,
        title,
        description,
        dueDate,
    });

    try {
        const newTask = await task.save();
        console.log("✅ Tarea creada:", newTask);
        res.status(201).json(newTask);
    } catch (error) {
        console.error("❌ Error al crear tarea:", error.message);
        res.status(400).json({ message: error.message });
    }
};

export const updateTask = async (req, res) => {
    const { title, description, dueDate, completed } = req.body;

    try {
        console.log("💬 Actualizando tarea con ID:", req.params.id);
        const task = await Task.findById(req.params.id);


        if (!task) {
            console.log("❌ Tarea no encontrada");
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }
        if (task.user.toString() !== req.user.id) {
            console.log("❌ Usuario no autorizado para actualizar esta tarea");
            return res.status(401).json({ message: 'No autorizado' });
        }
        
        task.title = title ?? task.title;
        task.description = description ?? task.description;
        task.dueDate = dueDate ?? task.dueDate;
        task.completed = completed ?? task.completed;

        const updatedTask = await task.save();
        console.log("✅ Tarea actualizada:", updatedTask);
        res.json(updatedTask);
    } catch (error) {
        console.error("❌ Error al actualizar tarea:", error.message);
        res.status(400).json({ message: error.message });
    }
};

export const deleteTask = async (req, res) => {
    try {
        console.log("💬 Eliminando tarea con ID:", req.params.id);
        const task = await Task.findById(req.params.id);

        if (!task) {
            console.log("❌ Tarea no encontrada");
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }
        if (task.user.toString() !== req.user.id) {
            console.log("❌ Usuario no autorizado para eliminar esta tarea");
            return res.status(401).json({ message: 'No autorizado' });
        }
        
        await task.remove();
        console.log("✅ Tarea eliminada:", task);
        res.json({ message: 'Tarea eliminada' });
    } catch (error) {
        console.error("❌ Error al eliminar tarea:", error.message);
        res.status(400).json({ message: error.message });
    }
};
