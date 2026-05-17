import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const menuAdmin = [
    { path: '/admin', label: '📊 Dashboard' },
    { path: '/admin/bac-si', label: '👨‍⚕️ Quản lý bác sĩ' },
    { path: '/admin/benh-nhan', label: '🧑 Quản lý bệnh nhân' },
    { path: '/admin/chuyen-khoa', label: '🏥 Quản lý chuyên khoa' },
    { path: '/admin/lich-hen', label: '📅 Quản lý lịch hẹn' },
];

const Sidebar = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="w-64 h-full bg-blue-700 text-white flex flex-col flex-shrink-0">
            {/* Header */}
            <div className="p-6 border-b border-blue-600">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    🏥 Phòng Khám
                </h2>
                <p className="text-blue-200 text-sm mt-1">{user?.TenDangNhap || 'Admin'}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-blue-600 rounded-full text-xs">
                    {user?.VaiTro || 'Admin'}
                </span>
            </div>

            {/* Menu */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {menuAdmin.map(({ path, label }) => (
                    <NavLink
                        key={path}
                        to={path}
                        end
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${isActive
                                ? 'bg-white text-blue-700 font-semibold'
                                : 'hover:bg-blue-600'
                            }`
                        }
                    >
                        {label}
                    </NavLink>
                ))}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-blue-600">
                <button
                    onClick={handleLogout}
                    className="w-full bg-red-500 hover:bg-red-600 py-3 rounded-xl font-medium transition"
                >
                    🚪 Đăng xuất
                </button>
            </div>
        </div>
    );
};

export default Sidebar;