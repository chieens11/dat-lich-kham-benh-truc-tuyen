import express from 'express';
import { getLichLamViecByBacSi, createLichLamViec, deleteLichLamViec } from '../controllers/lichLamViec.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/bac-si/:maBacSi', authMiddleware, getLichLamViecByBacSi);
router.post('/', authMiddleware, createLichLamViec);
router.delete('/:id', authMiddleware, deleteLichLamViec);

export default router;