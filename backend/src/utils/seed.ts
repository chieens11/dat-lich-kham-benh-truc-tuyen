import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const MatKhauHash = await bcrypt.hash('admin123', 10);

    const admin = await prisma.nguoiDung.upsert({
        where: { TenDangNhap: 'admin' },
        update: {},
        create: {
            TenDangNhap: 'admin',
            MatKhauHash,
            Email: 'admin@gmail.com',
            SoDienThoai: '0000000000',
            MaVaiTro: 1,
        },
    });

    console.log('✅ Tạo admin thành công:', admin.TenDangNhap);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());