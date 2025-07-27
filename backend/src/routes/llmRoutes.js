import express from 'express';
import { generateCode, getComponents, deleteComponent, regenerateComponent } from '../controllers/llmController.js';
import { authUser } from '../middlewares/authMiddleware.js';
import Component from '../models/Component.js'; // adjust the path if needed


const router = express.Router();

router.post('/generate', authUser, generateCode); 

router.get('/components', authUser, getComponents);

router.delete('/components/:id', authUser, deleteComponent);

router.post('/regenerate/:id', authUser, regenerateComponent);





export default router;
