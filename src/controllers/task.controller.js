import Task from '../models/Task.js';

export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createTask = async (req, res) => {
    const { title, description, dueDate } = req.body;

    const task = new Task({
        user: req.user.id,
        title,
        description,
        dueDate,
    });

    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateTask = async (req, res) => {
    const { title, description, dueDate, completed } = req.body;

    try {
        const task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });
        if (task.user.toString() !== req.user.id) return res.status(401).json({ message: 'No autorizado' });

        task.title = title ?? task.title;
        task.description = description ?? task.description;
        task.dueDate = dueDate ?? task.dueDate;
        task.completed = completed ?? task.completed;

        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });
        if (task.user.toString() !== req.user.id) return res.status(401).json({ message: 'No autorizado' });

        await task.remove();
        res.json({ message: 'Tarea eliminada' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
