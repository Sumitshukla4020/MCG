import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const componentCodeSchema = new mongoose.Schema({
  jsx: { type: String, default: '' },
  css: { type: String, default: '' },
});

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sessionName: { type: String, required: true },
  chatHistory: [chatSchema],
  componentCode: componentCodeSchema,
  editorState: { type: Object, default: {} },
}, { timestamps: true });

export default mongoose.model('Session', sessionSchema);
