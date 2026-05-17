import express from 'express';
import { getLichHen, getLichHenByBenhNhan, getLichHenByBacSi, datLich, capNhatTrangThai, huyLich } from '../controllers/lichHen.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/', authMiddleware, getLichHen);
router.get('/benh-nhan/:maBenhNhan', authMiddleware, getLichHenByBenhNhan);
router.get('/bac-si/:maBacSi', authMiddleware, getLichHenByBacSi);
router.post('/', authMiddleware, datLich);
router.put('/:id/trang-thai', authMiddleware, capNhatTrangThai);
router.put('/:id/huy', authMiddleware, huyLich);

export default router;