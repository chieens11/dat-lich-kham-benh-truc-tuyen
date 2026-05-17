import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth.api';

const steps = ['1. Thông tin tài khoản', '2. Tạo hồ sơ'];

const Field = ({ label, value, onChange, placeholder, type = 'text' }: {
    label: string; value: string; onChange: (v: string) => void;
    placeholder?: string; type?: string;
}) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full border border-gray-200 bg-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition placeholder-gray-300"
        />
    </div>
);

const RegisterPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [form, setForm] = useState({
        TenDangNhap: '', Email: '', SoDienThoai: '',
        MatKhau: '', XacNhanMatKhau: '',
        HoVaTen: '', NgaySinh: '', GioiTinh: '', SoCMND: '',
        MaBHYT: '', TinhThanhPho: '', QuanHuyen: '', PhuongXa: '',
        DiaChiCuThe: '', DanToc: '', NgheNghiep: '', MaGioiThieu: '',
    });

    const set = (key: string, value: string) =>
        setForm((f) => ({ ...f, [key]: value }));

    const nextStep = () => {
        if (step === 0) {
            if (!form.TenDangNhap || !form.Email || !form.SoDienThoai)
                return setError('Vui lòng nhập đầy đủ thông tin!');
            if (!form.MatKhau || !form.XacNhanMatKhau)
                return setError('Vui lòng nhập đầy đủ mật khẩu!');
            if (form.MatKhau !== form.XacNhanMatKhau)
                return setError('Mật khẩu xác nhận không khớp!');
            if (form.MatKhau.length < 6)
                return setError('Mật khẩu phải có ít nhất 6 ký tự!');
        }
        setError('');
        setStep((s) => s + 1);
    };

    const handleSubmit = async () => {
        if (!form.HoVaTen) return setError('Vui lòng nhập họ và tên!');
        setLoading(true);
        setError('');
        try {
            await authApi.register({
                TenDangNhap: form.TenDangNhap,
                MatKhau: form.MatKhau,
                Email: form.Email,
                SoDienThoai: form.SoDienThoai,
                MaVaiTro: 2,
            });
            navigate('/login');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Đăng ký thất bại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Cột trái — Banner */}
            <div className="hidden lg:flex flex-col justify-center items-center w-5/12 bg-gradient-to-br from-blue-600 to-blue-400 text-white px-12">
                <p className="text-blue-100 text-center text-sm leading-relaxed">
                    Đăng ký tài khoản để đặt lịch khám<br />và quản lý hồ sơ sức khỏe của bạn.
                </p>
                {/* Progress indicator */}
                <div className="mt-12 w-full space-y-3">
                    {steps.map((s, i) => (
                        <div key={s} className={`flex items-center gap-3 p-3 rounded-xl transition ${i === step ? 'bg-white/20' : i < step ? 'opacity-60' : 'opacity-30'}`}>
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${i < step ? 'bg-green-400 text-white' : i === step ? 'bg-white text-blue-600' : 'bg-white/30 text-white'}`}>
                                {i < step ? '✓' : i + 1}
                            </div>
                            <span className="text-sm font-medium">{s}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cột phải — Form */}
            <div className="flex flex-col justify-center items-center w-full lg:w-7/12 bg-gray-50 px-6 py-10">
                <div className="w-full max-w-2xl">
                    {/* Step tabs mobile */}
                    <div className="lg:hidden flex border-b mb-6">
                        {steps.map((s, i) => (
                            <div key={s} className={`flex-1 py-2.5 text-xs font-medium text-center border-b-2 transition ${i === step ? 'border-blue-600 text-blue-600' : i < step ? 'border-gray-300 text-gray-400' : 'border-transparent text-gray-300'}`}>
                                {s}
                            </div>
                        ))}
                    </div>

                    <h1 className="text-2xl font-bold text-gray-800 mb-1">
                        {step === 0 ? 'Tạo tài khoản mới' : 'Hoàn thiện hồ sơ'}
                    </h1>
                    <p className="text-sm text-gray-500 mb-6">
                        {step === 0
                            ? 'Điền thông tin để tạo tài khoản của bạn'
                            : 'Hồ sơ đầy đủ giúp bác sĩ phục vụ bạn tốt hơn'}
                    </p>

                    {error && (
                        <div className="flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 p-3 rounded-xl mb-5 text-sm">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    {/* Bước 1 */}
                    {step === 0 && (
                        <div className="space-y-4">
                            <Field label="Tên đăng nhập *" value={form.TenDangNhap}
                                onChange={(v) => set('TenDangNhap', v)} placeholder="Tên đăng nhập" />
                            <Field label="Email *" type="email" value={form.Email}
                                onChange={(v) => set('Email', v)} placeholder="Địa chỉ email" />
                            <Field label="Số điện thoại *" type="tel" value={form.SoDienThoai}
                                onChange={(v) => set('SoDienThoai', v)} placeholder="Số điện thoại" />

                            {/* Mật khẩu với toggle */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu *</label>
                                <div className="relative">
                                    <input
                                        type={showPass ? 'text' : 'password'}
                                        value={form.MatKhau}
                                        onChange={(e) => set('MatKhau', e.target.value)}
                                        placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                                        className="w-full border border-gray-200 bg-white rounded-xl px-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition placeholder-gray-300"
                                    />
                                    <button type="button" onClick={() => setShowPass(!showPass)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm">
                                        {showPass ? '🙈' : '👁️'}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Xác nhận mật khẩu *</label>
                                <div className="relative">
                                    <input
                                        type={showConfirm ? 'text' : 'password'}
                                        value={form.XacNhanMatKhau}
                                        onChange={(e) => set('XacNhanMatKhau', e.target.value)}
                                        placeholder="Nhập lại mật khẩu"
                                        className="w-full border border-gray-200 bg-white rounded-xl px-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition placeholder-gray-300"
                                    />
                                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm">
                                        {showConfirm ? '🙈' : '👁️'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Bước 2 */}
                    {step === 1 && (
                        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                            {/* Cột trái */}
                            <div className="space-y-4">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Thông tin cá nhân</p>
                                <Field label="Họ và tên *" value={form.HoVaTen}
                                    onChange={(v) => set('HoVaTen', v)} placeholder="Họ và tên" />
                                <Field label="Ngày sinh" type="date" value={form.NgaySinh}
                                    onChange={(v) => set('NgaySinh', v)} />
                                <Field label="Số CMND/CCCD" value={form.SoCMND}
                                    onChange={(v) => set('SoCMND', v)} placeholder="Số CMND/CCCD" />

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Giới tính</label>
                                    <div className="flex gap-3">
                                        {['Nam', 'Nữ'].map((g) => (
                                            <label key={g} className={`flex-1 flex items-center justify-center gap-2 border rounded-xl py-2 cursor-pointer text-sm transition ${form.GioiTinh === g ? 'border-blue-500 bg-blue-50 text-blue-600 font-medium' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                                                <input type="radio" name="gioitinh" value={g}
                                                    checked={form.GioiTinh === g}
                                                    onChange={() => set('GioiTinh', g)}
                                                    className="hidden" />
                                                {g}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Dân tộc</label>
                                    <select
                                        className="w-full border border-gray-200 bg-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                        value={form.DanToc}
                                        onChange={(e) => set('DanToc', e.target.value)}
                                    >
                                        {['Kinh', 'Tày', 'Thái', 'Mường', 'Khmer', 'Khác'].map((dt) => (
                                            <option key={dt} value={dt}>{dt}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Cột phải */}
                            <div className="space-y-4">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Thông tin bổ sung</p>
                                <Field label="Mã thẻ BHYT" value={form.MaBHYT}
                                    onChange={(v) => set('MaBHYT', v)} placeholder="Mã số thẻ Bảo hiểm y tế" />

                                <Field label="Tỉnh / Thành phố" value={form.TinhThanhPho}
                                    onChange={(v) => set('TinhThanhPho', v)} placeholder="Nhập tỉnh / thành phố" />

                                <Field label="Quận / Huyện" value={form.QuanHuyen}
                                    onChange={(v) => set('QuanHuyen', v)} placeholder="Nhập quận / huyện" />

                                <Field label="Phường / Xã" value={form.PhuongXa}
                                    onChange={(v) => set('PhuongXa', v)} placeholder="Nhập phường / xã" />

                                <Field label="Địa chỉ cụ thể" value={form.DiaChiCuThe}
                                    onChange={(v) => set('DiaChiCuThe', v)} placeholder="Số nhà, tên đường" />

                                <Field label="Mã giới thiệu" value={form.MaGioiThieu}
                                    onChange={(v) => set('MaGioiThieu', v)} placeholder="Mã của người giới thiệu (tuỳ chọn)" />
                            </div>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex justify-between mt-8">
                        {step > 0 ? (
                            <button onClick={() => setStep((s) => s - 1)}
                                className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-100 transition">
                                ← Quay lại
                            </button>
                        ) : <div />}

                        {step < 1 ? (
                            <button onClick={nextStep}
                                className="px-8 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition shadow-sm shadow-blue-200">
                                Tiếp theo →
                            </button>
                        ) : (
                            <button onClick={handleSubmit} disabled={loading}
                                className="px-8 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50 shadow-sm shadow-blue-200">
                                {loading ? 'Đang xử lý...' : 'Hoàn tất đăng ký'}
                            </button>
                        )}
                    </div>

                    <p className="text-center text-sm text-gray-400 mt-5">
                        Đã có tài khoản?{' '}
                        <a href="/login" className="text-blue-600 font-medium hover:underline">Đăng nhập</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;