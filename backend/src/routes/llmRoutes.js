import express from 'express';
import { generateCode, getComponents, deleteComponent, regenerateComponent, refineComponent, 
  autoSaveComponent
 } from '../controllers/llmController.js';
import { authUser } from '../middlewares/authMiddleware.js';
import { exportSessionZip } from '../controllers/exportController.js';

import Component from '../models/Component.js'; // adjust the path if needed


const router = express.Router();

router.post('/generate', authUser, generateCode); 

router.get('/components', authUser, getComponents);

router.delete('/components/:id', authUser, deleteComponent);

router.post('/regenerate/:id', authUser, regenerateComponent);

router.get('/export/:sessionId', authUser, exportSessionZip);

router.post('/refine/:id', authUser, refineComponent);

router.patch('/autosave/:id', authUser, autoSaveComponent);








export default router;
