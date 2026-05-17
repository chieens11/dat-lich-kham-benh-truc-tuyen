import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

export const dashBoardController = {
    getDashboard: (_req: Request, res: Response) => {
        res.json({
            message: 'Dashboard API working',
        });
    },
};