import express from 'express';
import {
  createSession,
  getSessions,
  getSessionById,
  updateSession,
  deleteSession,
} from '../controllers/sessionController.js';
import { authUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authUser); // All routes require authentication

router.post('/', createSession);        // Create session
router.get('/', getSessions);           // Get all sessions
router.get('/:id', getSessionById);     // Get specific session
router.put('/:id', updateSession);      // Update session
router.delete('/:id', deleteSession);   // Optional: Delete session

export default router;
