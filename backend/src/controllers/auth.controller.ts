import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

export const register = async (req: Request, res: Response) => {
  try {
    const { TenDangNhap, MatKhau, Email, SoDienThoai, MaVaiTro } = req.body;

    const existingUser = await prisma.nguoiDung.findUnique({
      where: { TenDangNhap }
    });

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Tên đăng nhập đã tồn tại!' });
    }

    const salt = await bcrypt.genSalt(10);
    const MatKhauHash = await bcrypt.hash(MatKhau, salt);

    const user = await prisma.nguoiDung.create({
      data: { TenDangNhap, MatKhauHash, Email, SoDienThoai, MaVaiTro },
      include: { VaiTro: true }
    });

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công!',
      user: {
        MaNguoiDung: user.MaNguoiDung,
        TenDangNhap: user.TenDangNhap,
        Email: user.Email,
        VaiTro: user.VaiTro?.TenVaiTro
      }
    });

  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { TenDangNhap, MatKhau } = req.body;

    const user = await prisma.nguoiDung.findUnique({
      where: { TenDangNhap },
      include: { VaiTro: true }
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
    }

    const isMatch = await bcrypt.compare(MatKhau, user.MatKhauHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
    }

    const token = jwt.sign(
      { MaNguoiDung: user.MaNguoiDung, TenDangNhap: user.TenDangNhap, MaVaiTro: user.MaVaiTro },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Đăng nhập thành công!',
      token,
      user: {
        MaNguoiDung: user.MaNguoiDung,
        TenDangNhap: user.TenDangNhap,
        Email: user.Email,
        VaiTro: user.VaiTro?.TenVaiTro,
        MaVaiTro: user.MaVaiTro   
      }
    });

  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== LOGOUT ====================
// Lưu blacklisted tokens vào memory (production nên dùng Redis)
const tokenBlacklist = new Set<string>();

export const logout = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Không có token!' });
    }

    const token = authHeader.split(' ')[1];
    tokenBlacklist.add(token);

    res.json({ success: true, message: 'Đăng xuất thành công!' });

  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const isTokenBlacklisted = (token: string) => tokenBlacklist.has(token);

// ==================== ĐỔI MẬT KHẨU ====================
export const doiMatKhau = async (req: Request, res: Response) => {
  try {
    const { MaNguoiDung } = (req as any).user; // từ middleware auth
    const { MatKhauCu, MatKhauMoi } = req.body;

    if (!MatKhauCu || !MatKhauMoi) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ mật khẩu cũ và mới!' });
    }

    if (MatKhauMoi.length < 6) {
      return res.status(400).json({ success: false, message: 'Mật khẩu mới phải có ít nhất 6 ký tự!' });
    }

    const user = await prisma.nguoiDung.findUnique({
      where: { MaNguoiDung }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Người dùng không tồn tại!' });
    }

    const isMatch = await bcrypt.compare(MatKhauCu, user.MatKhauHash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Mật khẩu cũ không đúng!' });
    }

    const salt = await bcrypt.genSalt(10);
    const MatKhauHash = await bcrypt.hash(MatKhauMoi, salt);

    await prisma.nguoiDung.update({
      where: { MaNguoiDung },
      data: { MatKhauHash }
    });

    res.json({ success: true, message: 'Đổi mật khẩu thành công!' });

  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== QUÊN MẬT KHẨU ====================
// Lưu OTP tạm thời (production nên dùng Redis)
const otpStore = new Map<string, { otp: string; expires: number }>();

export const quenMatKhau = async (req: Request, res: Response) => {
  try {
    const { Email } = req.body;

    if (!Email) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập email!' });
    }

    const user = await prisma.nguoiDung.findFirst({
      where: { Email }
    });

    // Luôn trả về success để tránh lộ thông tin email tồn tại hay không
    if (!user) {
      return res.json({ success: true, message: 'Nếu email tồn tại, mã OTP đã được gửi!' });
    }

    // Tạo OTP 6 số
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000; // hết hạn sau 10 phút

    otpStore.set(Email, { otp, expires });

    // TODO: Gửi OTP qua email thật (nodemailer, SendGrid...)
    // Hiện tại log ra console để test
    console.log(`OTP cho ${Email}: ${otp}`);

    res.json({ success: true, message: 'Nếu email tồn tại, mã OTP đã được gửi!' });

  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const datLaiMatKhau = async (req: Request, res: Response) => {
  try {
    const { Email, Otp, MatKhauMoi } = req.body;

    if (!Email || !Otp || !MatKhauMoi) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ thông tin!' });
    }

    if (MatKhauMoi.length < 6) {
      return res.status(400).json({ success: false, message: 'Mật khẩu mới phải có ít nhất 6 ký tự!' });
    }

    const record = otpStore.get(Email);
    if (!record) {
      return res.status(400).json({ success: false, message: 'OTP không hợp lệ hoặc đã hết hạn!' });
    }

    if (Date.now() > record.expires) {
      otpStore.delete(Email);
      return res.status(400).json({ success: false, message: 'OTP đã hết hạn!' });
    }

    if (record.otp !== Otp) {
      return res.status(400).json({ success: false, message: 'OTP không đúng!' });
    }

    const user = await prisma.nguoiDung.findFirst({ where: { Email } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Người dùng không tồn tại!' });
    }

    const salt = await bcrypt.genSalt(10);
    const MatKhauHash = await bcrypt.hash(MatKhauMoi, salt);

    await prisma.nguoiDung.update({
      where: { MaNguoiDung: user.MaNguoiDung },
      data: { MatKhauHash }
    });

    otpStore.delete(Email); 

    res.json({ success: true, message: 'Đặt lại mật khẩu thành công!' });

  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};