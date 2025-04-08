// src/models/Book.js
import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  author: { type: String },
  status: {
    type: String,
    enum: ['pendiente', 'leyendo', 'terminado', 'relectura', 'popular'],
    default: 'pendiente'
  },
  totalPages: { type: Number },
  currentPage: { type: Number, default: 0 },
  startedAt: { type: Date },
  finishedAt: { type: Date }
}, {
  timestamps: true
});

export default mongoose.model('Book', bookSchema);
