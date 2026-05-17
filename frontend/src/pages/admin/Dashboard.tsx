import { useEffect, useState } from 'react';
import { Users, Calendar, DollarSign, AlertCircle, TrendingUp, Clock } from 'lucide-react';
import axiosInstance from '../../api/axios';

interface ThongKe {
    tongBacSi: number;
    tongBenhNhan: number;
    lichHenHomNay: number;
    choXacNhan: number;
    doanhThuThang: number;
    lichHenGanDay: any[];
}

const Dashboard = () => {
    const [thongKe, setThongKe] = useState<ThongKe>({
        tongBacSi: 0,
        tongBenhNhan: 0,
        lichHenHomNay: 0,
        choXacNhan: 0,
        doanhThuThang: 0,
        lichHenGanDay: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchThongKe = async () => {
            try {
                const [bacSiRes, benhNhanRes, lichHenRes] = await Promise.all([
                    axiosInstance.get('/bac-si'),
                    axiosInstance.get('/benh-nhan'),
                    axiosInstance.get('/lich-hen'),
                ]);

                const today = new Date().toDateString();
                const allLichHen = lichHenRes.data.data || [];

                const lichHenHomNay = allLichHen.filter((lh: any) =>
                    new Date(lh.NgayTao).toDateString() === today
                ).length;

                const choXacNhan = allLichHen.filter((lh: any) =>
                    lh.MaTrangThai === 1
                ).length;

                const doanhThuThang = allLichHen
                    .filter((lh: any) => lh.HoaDon)
                    .reduce((sum: number, lh: any) => sum + (lh.HoaDon?.TongTien || 0), 0);

                setThongKe({
                    tongBacSi: bacSiRes.data.data?.length || 0,
                    tongBenhNhan: benhNhanRes.data.data?.length || 0,
                    lichHenHomNay,
                    choXacNhan,
                    doanhThuThang,
                    lichHenGanDay: allLichHen.slice(0, 5)
                });
            } catch (error) {
                console.error('Lỗi fetch thống kê:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchThongKe();
    }, []);

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('vi-VN').format(amount) + '₫';

    const getTrangThaiColor = (maTrangThai: number) => {
        switch (maTrangThai) {
            case 1: return 'bg-yellow-100 text-yellow-700';
            case 2: return 'bg-blue-100 text-blue-700';
            case 3: return 'bg-green-100 text-green-700';
            case 4: return 'bg-red-100 text-red-700';
            case 5: return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getTrangThaiText = (maTrangThai: number) => {
        switch (maTrangThai) {
            case 1: return 'Chờ xác nhận';
            case 2: return 'Đã xác nhận';
            case 3: return 'Đã khám';
            case 4: return 'Không đến';
            case 5: return 'Đã hủy';
            default: return 'Không rõ';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard Admin</h1>
                    <p className="text-gray-500 mt-1">
                        Tổng quan hệ thống quản lý đặt lịch khám bệnh • Hôm nay: {new Date().toLocaleDateString('vi-VN')}
                    </p>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl transition font-medium shadow-md">
                    <TrendingUp size={20} />
                    Xuất Báo Cáo
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm">Tổng bác sĩ</p>
                            <p className="text-4xl font-bold text-gray-800 mt-4">{thongKe.tongBacSi}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                            <Users size={28} className="text-blue-600" />
                        </div>
                    </div>
                    <div className="mt-4 text-blue-600 text-sm font-medium">Đang hoạt động</div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm">Lịch hẹn hôm nay</p>
                            <p className="text-4xl font-bold text-gray-800 mt-4">{thongKe.lichHenHomNay}</p>
                        </div>
                        <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                            <Calendar size={28} className="text-emerald-600" />
                        </div>
                    </div>
                    <div className="mt-4 text-emerald-600 text-sm font-medium">Tổng: {thongKe.tongBenhNhan} bệnh nhân</div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm">Doanh thu tháng</p>
                            <p className="text-2xl font-bold text-gray-800 mt-4">{formatCurrency(thongKe.doanhThuThang)}</p>
                        </div>
                        <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
                            <DollarSign size={28} className="text-amber-600" />
                        </div>
                    </div>
                    <div className="mt-4 text-amber-600 text-sm font-medium">Từ các lịch hẹn đã khám</div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm">Chờ xác nhận</p>
                            <p className="text-4xl font-bold text-orange-600 mt-4">{thongKe.choXacNhan}</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                            <AlertCircle size={28} className="text-orange-600" />
                        </div>
                    </div>
                    <div className="mt-4 text-orange-600 text-sm font-medium">Lịch hẹn cần xử lý</div>
                </div>
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                {/* Chart placeholder */}
                <div className="xl:col-span-8 bg-white rounded-3xl p-8 min-h-[420px] flex items-center justify-center border border-dashed border-gray-200">
                    <div className="text-center">
                        <p className="text-6xl mb-4">📊</p>
                        <p className="text-gray-400 text-lg">Biểu đồ tăng trưởng sẽ được tích hợp sau</p>
                    </div>
                </div>

                {/* Lịch hẹn gần đây */}
                <div className="xl:col-span-4 bg-white rounded-3xl p-6">
                    <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <Clock size={20} /> Lịch hẹn gần đây
                    </h3>

                    {thongKe.lichHenGanDay.length === 0 ? (
                        <div className="text-center text-gray-400 py-8">Chưa có lịch hẹn nào</div>
                    ) : (
                        <div className="space-y-4">
                            {thongKe.lichHenGanDay.map((lh: any) => (
                                <div key={lh.MaLichHen} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                                    <div>
                                        <p className="font-medium">{lh.BenhNhan?.HoTen || 'N/A'}</p>
                                        <p className="text-sm text-gray-500">BS. {lh.BacSi?.HoTen || 'N/A'}</p>
                                        <p className="text-xs text-gray-400">
                                            {lh.KhungGioKham?.ThoiGianBatDau} - {new Date(lh.KhungGioKham?.NgayKham).toLocaleDateString('vi-VN')}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getTrangThaiColor(lh.MaTrangThai)}`}>
                                        {getTrangThaiText(lh.MaTrangThai)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;