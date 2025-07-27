import mongoose from 'mongoose';

const componentSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  prompt: { type: String, required: true },
  jsx: { type: String, required: true },
  css: { type: String, required: true },
  message: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Component', componentSchema);
