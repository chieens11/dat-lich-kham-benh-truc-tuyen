// src/services/dashboard.service.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DashboardService {

    static async getDashboardData() {
        try {
            const [
                totalActiveUsers,
                totalAppointmentsThisMonth,
                revenueThisMonth,
                pendingDoctors,
                todaysAppointments,
                pendingVerifications
            ] = await Promise.all([
                // 1. Tổng người dùng hoạt động
                prisma.nguoiDung.count({
                    where: { TrangThai: true }
                }),

                // 2. Tổng lịch hẹn tháng này
                prisma.lichHen.count({
                    where: {
                        NgayTao: {
                            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                        }
                    }
                }),

                // 3. Doanh thu tháng này
                prisma.hoaDon.aggregate({
                    where: {
                        TrangThaiThanhToan: 'Đã thanh toán',
                        NgayTao: {
                            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                        }
                    },
                    _sum: { TongTien: true }
                }),

                // 4. Bác sĩ chờ xác thực 
                prisma.bacSi.count({
                    where: {
                        DaXoa: false

                    }
                }),

                // 5. Lịch hẹn hôm nay
                prisma.lichHen.findMany({
                    take: 5,
                    where: {
                        KhungGioKham: {
                            NgayKham: new Date().toISOString().split('T')[0]
                        }
                    },
                    include: {
                        BenhNhan: { select: { HoTen: true } },
                        BacSi: { select: { HoTen: true } },
                        KhungGioKham: {
                            select: { ThoiGianBatDau: true, ThoiGianKetThuc: true }
                        },
                        TrangThaiLichHen: true
                    },
                    orderBy: {
                        KhungGioKham: { ThoiGianBatDau: 'asc' }
                    }
                }),

                // 6. Danh sách chờ xác thực bác sĩ
                prisma.bacSi.findMany({
                    take: 5,
                    where: { DaXoa: false },
                    include: {
                        ChuyenKhoa: { select: { TenChuyenKhoa: true } }
                    }
                })
            ]);

            return {
                success: true,
                data: {
                    stats: {
                        totalActiveUsers,
                        totalAppointmentsThisMonth,
                        revenueThisMonth: revenueThisMonth._sum.TongTien || 0,
                        pendingDoctors
                    },
                    todaysAppointments,
                    pendingVerifications
                }
            };
        } catch (error: any) {
            console.error('Dashboard Service Error:', error);
            throw error;
        }
    }
}