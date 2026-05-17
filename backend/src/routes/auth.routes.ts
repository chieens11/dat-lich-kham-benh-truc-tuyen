import express from 'express';
import { register, login, logout, doiMatKhau, quenMatKhau, datLaiMatKhau } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/doi-mat-khau', authMiddleware, doiMatKhau);  
router.post('/quen-mat-khau', quenMatKhau);
router.post('/dat-lai-mat-khau', datLaiMatKhau);

export default router;