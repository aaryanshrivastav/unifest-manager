import express from 'express';
import { getEventDetails } from '../controllers/eventController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// GET /events/:event_id → fetch event details for frontend
router.get('/:event_id', verifyToken, getEventDetails);

export default router;
