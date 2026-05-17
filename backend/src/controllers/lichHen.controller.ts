import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getLichHen = async (req: Request, res: Response) => {
    try {
        const lichHens = await prisma.lichHen.findMany({
            include: {
                BenhNhan: { select: { HoTen: true, SoDienThoai: true } },
                BacSi: { select: { HoTen: true, ChuyenKhoa: true } },
                KhungGioKham: true,
                TrangThai: true
            },
            orderBy: { NgayTao: 'desc' }
        });
        res.json({ success: true, data: lichHens });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getLichHenByBenhNhan = async (req: Request, res: Response) => {
    try {
        const { maBenhNhan } = req.params;
        const lichHens = await prisma.lichHen.findMany({
            where: { MaBenhNhan: Number(maBenhNhan) },
            include: {
                BacSi: { select: { HoTen: true, ChuyenKhoa: true } },
                KhungGioKham: true,
                TrangThai: true
            },
            orderBy: { NgayTao: 'desc' }
        });
        res.json({ success: true, data: lichHens });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getLichHenByBacSi = async (req: Request, res: Response) => {
    try {
        const { maBacSi } = req.params;
        const lichHens = await prisma.lichHen.findMany({
            where: { MaBacSi: Number(maBacSi) },
            include: {
                BenhNhan: { select: { HoTen: true, SoDienThoai: true } },
                KhungGioKham: true,
                TrangThai: true
            },
            orderBy: { NgayTao: 'desc' }
        });
        res.json({ success: true, data: lichHens });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const datLich = async (req: Request, res: Response) => {
    try {
        const { MaBenhNhan, MaBacSi, MaKhungGio, LyDoKham, GhiChu } = req.body;

        // Kiểm tra khung giờ còn trống không
        const khungGio = await prisma.khungGioKham.findUnique({
            where: { MaKhungGio: Number(MaKhungGio) }
        });

        if (!khungGio) return res.status(404).json({ success: false, message: 'Khung giờ không tồn tại!' });
        if (khungGio.DaDat) return res.status(400).json({ success: false, message: 'Khung giờ này đã được đặt!' });

        // Tạo lịch hẹn (MaTrangThai = 1: Chờ xác nhận)
        const lichHen = await prisma.lichHen.create({
            data: {
                MaBenhNhan: Number(MaBenhNhan),
                MaBacSi: Number(MaBacSi),
                MaKhungGio: Number(MaKhungGio),
                LyDoKham,
                GhiChu,
                MaTrangThai: 1
            },
            include: { BacSi: true, KhungGioKham: true, TrangThai: true }
        });

        // Đánh dấu khung giờ đã đặt
        await prisma.khungGioKham.update({
            where: { MaKhungGio: Number(MaKhungGio) },
            data: { DaDat: true }
        });

        res.status(201).json({ success: true, message: 'Đặt lịch thành công!', data: lichHen });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const capNhatTrangThai = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { MaTrangThai } = req.body;

        const lichHen = await prisma.lichHen.update({
            where: { MaLichHen: Number(id) },
            data: { MaTrangThai: Number(MaTrangThai), NgayCapNhat: new Date() }
        });
        res.json({ success: true, message: 'Cập nhật trạng thái thành công!', data: lichHen });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const huyLich = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const lichHen = await prisma.lichHen.findUnique({ where: { MaLichHen: Number(id) } });
        if (!lichHen) return res.status(404).json({ success: false, message: 'Không tìm thấy lịch hẹn!' });

        // Cập nhật trạng thái hủy (MaTrangThai = 5: Đã hủy)
        await prisma.lichHen.update({
            where: { MaLichHen: Number(id) },
            data: { MaTrangThai: 5, NgayCapNhat: new Date() }
        });

        // Mở lại khung giờ
        await prisma.khungGioKham.update({
            where: { MaKhungGio: lichHen.MaKhungGio },
            data: { DaDat: false }
        });

        res.json({ success: true, message: 'Hủy lịch thành công!' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};