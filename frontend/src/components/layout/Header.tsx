import { useAuthStore } from '../../store/authStore';

interface Props {
    title: string;
}

const Header = ({ title }: Props) => {
    const { user } = useAuthStore();

    return (
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 lg:px-8 flex-shrink-0">
            <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>

            <div className="flex items-center gap-3">
                <span className="text-gray-600">
                    Xin chào, <span className="font-semibold text-blue-600">{user?.TenDangNhap}</span>
                </span>
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    {user?.TenDangNhap?.[0] || 'A'}
                </div>
            </div>
        </header>
    );
};

export default Header;