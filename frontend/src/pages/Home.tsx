import React from 'react';
import {
  Search,
  Calendar,
  User,
  Clock,
  Award,
  MapPin
} from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-gray-50 overflow-x-hidden">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 w-full">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl">
              YV
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Y Việt</h1>
              <p className="text-sm text-gray-500 -mt-1">Phòng khám Đại học Y Dược 1</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
            <a href="#" className="hover:text-blue-600 transition-colors">Trang chủ</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Chuyên khoa</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Bác sĩ</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Dịch vụ</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Tin tức</a>
          </nav>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-5 py-2.5 text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50 transition-all">
              <User size={20} />
              Đăng nhập
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all font-semibold">
              <Calendar size={20} />
              Đặt lịch ngay
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section - Full Width */}
      <section className="w-full bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h2 className="text-5xl md:text-6xl font-bold leading-tight">
              Khám bệnh dễ dàng,<br />
              <span className="text-yellow-300">chăm sóc tận tâm</span>
            </h2>
            <p className="text-xl text-blue-100">
              Đặt lịch khám trực tuyến nhanh chóng với đội ngũ bác sĩ giàu kinh nghiệm
              tại Phòng khám Đại học Y Dược 1 - Y Việt
            </p>

            {/* Search */}
            <div className="bg-white rounded-3xl p-3 shadow-2xl max-w-2xl">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-5 top-4 text-gray-400" size={24} />
                  <input
                    type="text"
                    placeholder="Tìm bác sĩ, chuyên khoa..."
                    className="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-blue-500 text-gray-800 text-lg"
                  />
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 px-10 py-4 rounded-2xl font-semibold flex items-center gap-3 transition-all whitespace-nowrap">
                  <Calendar size={24} />
                  Tìm lịch
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2"><Clock className="text-yellow-300" /> Khám trong ngày</div>
              <div className="flex items-center gap-2"><Award className="text-yellow-300" /> Bác sĩ hàng đầu</div>
              <div className="flex items-center gap-2"><MapPin className="text-yellow-300" /> Quận 1, TP.HCM</div>
            </div>
          </div>

          <div className="relative hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800"
              alt="Bác sĩ"
              className="rounded-3xl shadow-2xl w-full"
            />
          </div>
        </div>
      </section>

      {/* Stats - Full Width */}
      <section className="w-full bg-white py-10 border-b">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600">150+</div>
            <div className="text-gray-600 mt-1">Bác sĩ chuyên môn cao</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600">50.000+</div>
            <div className="text-gray-600 mt-1">Lượt khám mỗi tháng</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600">24/7</div>
            <div className="text-gray-600 mt-1">Hỗ trợ đặt lịch</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600">15+</div>
            <div className="text-gray-600 mt-1">Chuyên khoa</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gray-900 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p>© 2026 Y Việt - Phòng khám Đại học Y Dược 1. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;