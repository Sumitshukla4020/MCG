import Session from '../models/Session.js';

export const createSession = async (req, res) => {
  try {
    const { sessionName } = req.body;
    const userId = req.user._id;

    const newSession = await Session.create({
      userId,
      sessionName,
    });

    res.status(201).json(newSession);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create session', error });
  }
};

export const getSessions = async (req, res) => {
  try {
    const userId = req.user._id;
    const sessions = await Session.find({ userId }).sort({ updatedAt: -1 });
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch sessions', error });
  }
};

export const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session || !session.userId.equals(req.user._id)) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get session', error });
  }
};

export const updateSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session || !session.userId.equals(req.user._id)) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const { chatHistory, componentCode, editorState, sessionName } = req.body;

    if (chatHistory) session.chatHistory = chatHistory;
    if (componentCode) session.componentCode = componentCode;
    if (editorState) session.editorState = editorState;
    if (sessionName) session.sessionName = sessionName;

    await session.save();

    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update session', error });
  }
};

export const deleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session || !session.userId.equals(req.user._id)) {
      return res.status(404).json({ message: 'Session not found' });
    }

    await session.deleteOne();
    res.status(200).json({ message: 'Session deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete session', error });
  }
};
