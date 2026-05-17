import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { isTokenBlacklisted } from '../controllers/auth.controller';

const JWT_SECRET = process.env.JWT_SECRET!;

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Không có token!' });
        }

        const token = authHeader.split(' ')[1];

        // Kiểm tra token đã logout chưa
        if (isTokenBlacklisted(token)) {
            return res.status(401).json({ success: false, message: 'Token đã hết hiệu lực!' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        (req as any).user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Token không hợp lệ!' });
    }
};