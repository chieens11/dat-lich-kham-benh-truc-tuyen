import express from 'express';
import { getChuyenKhoa, createChuyenKhoa, updateChuyenKhoa, deleteChuyenKhoa } from '../controllers/chuyenKhoa.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/', getChuyenKhoa); 
router.post('/', authMiddleware, createChuyenKhoa);
router.put('/:id', authMiddleware, updateChuyenKhoa);
router.delete('/:id', authMiddleware, deleteChuyenKhoa);

export default router;