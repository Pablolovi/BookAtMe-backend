// src/models/  ReadingActivity .js
import mongoose from 'mongoose';

const readingActivitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  pagesRead: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('ReadingActivity', readingActivitySchema);
