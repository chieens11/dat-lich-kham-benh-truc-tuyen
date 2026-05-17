import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getLichLamViecByBacSi = async (req: Request, res: Response) => {
    try {
        const { maBacSi } = req.params;
        const lichLamViecs = await prisma.lichLamViec.findMany({
            where: { MaBacSi: Number(maBacSi) },
            include: { KhungGioKham: true },
            orderBy: { ThuTrongTuan: 'asc' }
        });
        res.json({ success: true, data: lichLamViecs });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createLichLamViec = async (req: Request, res: Response) => {
    try {
        const { MaBacSi, ThuTrongTuan, ThoiGianBatDau, ThoiGianKetThuc, SoBenhNhanToiDa } = req.body;

        const lich = await prisma.lichLamViec.create({
            data: {
                MaBacSi: Number(MaBacSi),
                ThuTrongTuan: Number(ThuTrongTuan),
                ThoiGianBatDau,
                ThoiGianKetThuc,
                SoBenhNhanToiDa: Number(SoBenhNhanToiDa) || 10
            }
        });
        res.status(201).json({ success: true, message: 'Tạo lịch làm việc thành công!', data: lich });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteLichLamViec = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.lichLamViec.delete({ where: { MaLich: Number(id) } });
        res.json({ success: true, message: 'Xóa lịch làm việc thành công!' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};