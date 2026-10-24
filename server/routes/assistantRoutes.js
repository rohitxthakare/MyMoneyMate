import express from 'express';
import { getAISpendingSummary } from '../controllers/assistantController.js';
import {protect} from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, getAISpendingSummary);

export default router;
