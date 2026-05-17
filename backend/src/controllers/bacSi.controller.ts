import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const getBacSi = async (req: Request, res: Response) => {
    try {
        const bacSis = await prisma.bacSi.findMany({
            where: { DaXoa: false },
            include: {
                NguoiDung: { select: { TenDangNhap: true, Email: true, SoDienThoai: true, AnhDaiDien: true } },
                ChuyenKhoa: true,
            },
            orderBy: { MaBacSi: 'asc' }
        });
        res.json({ success: true, data: bacSis });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getBacSiById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const bacSi = await prisma.bacSi.findUnique({
            where: { MaBacSi: Number(id) },
            include: {
                NguoiDung: { select: { TenDangNhap: true, Email: true, SoDienThoai: true, AnhDaiDien: true } },
                ChuyenKhoa: true,
                LichLamViec: true,
                DanhGia: {
                    include: { BenhNhan: { select: { HoTen: true } } },
                    orderBy: { NgayTao: 'desc' },
                    take: 5
                }
            }
        });
        if (!bacSi) return res.status(404).json({ success: false, message: 'Không tìm thấy bác sĩ!' });
        res.json({ success: true, data: bacSi });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createBacSi = async (req: Request, res: Response) => {
    try {
        const { TenDangNhap, MatKhau, Email, SoDienThoai, HoTen, GioiTinh, NgaySinh, MaChuyenKhoa, PhiKham, TrinhDo, KinhNghiem, TieuSu } = req.body;

        const salt = await bcrypt.genSalt(10);
        const MatKhauHash = await bcrypt.hash(MatKhau, salt);

        const nguoiDung = await prisma.nguoiDung.create({
            data: { TenDangNhap, MatKhauHash, Email, SoDienThoai, MaVaiTro: 2 }
        });

        const bacSi = await prisma.bacSi.create({
            data: {
                MaBacSi: nguoiDung.MaNguoiDung,
                HoTen,
                GioiTinh,
                NgaySinh: NgaySinh ? new Date(NgaySinh) : null,
                MaChuyenKhoa: MaChuyenKhoa ? Number(MaChuyenKhoa) : null,
                PhiKham: PhiKham ? Number(PhiKham) : 0,
                TrinhDo,
                KinhNghiem: KinhNghiem ? Number(KinhNghiem) : null,
                TieuSu
            },
            include: { NguoiDung: true, ChuyenKhoa: true }
        });

        res.status(201).json({ success: true, message: 'Thêm bác sĩ thành công!', data: bacSi });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateBacSi = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { HoTen, GioiTinh, NgaySinh, MaChuyenKhoa, PhiKham, TrinhDo, KinhNghiem, TieuSu } = req.body;

        const bacSi = await prisma.bacSi.update({
            where: { MaBacSi: Number(id) },
            data: {
                HoTen,
                GioiTinh,
                NgaySinh: NgaySinh ? new Date(NgaySinh) : null,
                MaChuyenKhoa: MaChuyenKhoa ? Number(MaChuyenKhoa) : null,
                PhiKham: PhiKham ? Number(PhiKham) : 0,
                TrinhDo,
                KinhNghiem: KinhNghiem ? Number(KinhNghiem) : null,
                TieuSu
            }
        });
        res.json({ success: true, message: 'Cập nhật thành công!', data: bacSi });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteBacSi = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.bacSi.update({
            where: { MaBacSi: Number(id) },
            data: { DaXoa: true }
        });
        res.json({ success: true, message: 'Xóa bác sĩ thành công!' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};