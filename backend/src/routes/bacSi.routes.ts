import express from 'express';
import { getBacSi, getBacSiById, createBacSi, updateBacSi, deleteBacSi } from '../controllers/bacSi.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/', authMiddleware, getBacSi);
router.get('/:id', authMiddleware, getBacSiById);
router.post('/', authMiddleware, createBacSi);
router.put('/:id', authMiddleware, updateBacSi);
router.delete('/:id', authMiddleware, deleteBacSi);

export default router;