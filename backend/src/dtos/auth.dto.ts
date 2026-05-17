export interface RegisterDTO {
  tenDangNhap: string;
  matKhau: string;
  email?: string;
  soDienThoai?: string;
  hoTen?: string;
  maVaiTro: number; // 1=Admin, 2=BacSi, 3=BenhNhan
}

export interface LoginDTO {
  tenDangNhap: string;
  matKhau: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: any;
}