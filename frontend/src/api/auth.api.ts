import axiosInstance from './axios';

export const authApi = {
    login: (data: { TenDangNhap: string; MatKhau: string }) =>
        axiosInstance.post('/auth/login', data),

    register: (data: {
        TenDangNhap: string;
        MatKhau: string;
        Email: string;
        SoDienThoai: string;
        MaVaiTro: number;
    }) => axiosInstance.post('/auth/register', data),

    logout: () => axiosInstance.post('/auth/logout'),

    doiMatKhau: (data: { MatKhauCu: string; MatKhauMoi: string }) =>
        axiosInstance.post('/auth/doi-mat-khau', data),

    quenMatKhau: (data: { Email: string }) =>
        axiosInstance.post('/auth/quen-mat-khau', data),

    datLaiMatKhau: (data: { Email: string; Otp: string; MatKhauMoi: string }) =>
        axiosInstance.post('/auth/dat-lai-mat-khau', data),
};