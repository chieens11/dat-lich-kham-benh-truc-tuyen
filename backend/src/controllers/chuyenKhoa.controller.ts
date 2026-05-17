import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getChuyenKhoa = async (req: Request, res: Response) => {
    try {
        const chuyenKhoas = await prisma.chuyenKhoa.findMany({
            orderBy: { MaChuyenKhoa: 'asc' }
        });
        res.json({ success: true, data: chuyenKhoas });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createChuyenKhoa = async (req: Request, res: Response) => {
    try {
        const { TenChuyenKhoa, MoTa, HinhAnhURL } = req.body;
        const chuyenKhoa = await prisma.chuyenKhoa.create({
            data: { TenChuyenKhoa, MoTa, HinhAnhURL }
        });
        res.status(201).json({ success: true, message: 'Thêm chuyên khoa thành công!', data: chuyenKhoa });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateChuyenKhoa = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { TenChuyenKhoa, MoTa, HinhAnhURL } = req.body;
        const chuyenKhoa = await prisma.chuyenKhoa.update({
            where: { MaChuyenKhoa: Number(id) },
            data: { TenChuyenKhoa, MoTa, HinhAnhURL }
        });
        res.json({ success: true, message: 'Cập nhật thành công!', data: chuyenKhoa });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteChuyenKhoa = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.chuyenKhoa.delete({ where: { MaChuyenKhoa: Number(id) } });
        res.json({ success: true, message: 'Xóa chuyên khoa thành công!' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};