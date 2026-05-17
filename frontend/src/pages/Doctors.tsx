import { useState } from 'react';
import { Search, Filter, Star } from 'lucide-react';

const doctors = [
    {
        id: 1,
        name: "BS. Nguyễn Văn An",
        specialty: "Nội khoa",
        hospital: "Bệnh viện Trung ương Nha Trang",
        experience: "12 năm",
        rating: 4.9,
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        available: true
    },
    {
        id: 2,
        name: "BS. Trần Thị Lan",
        specialty: "Sản phụ khoa",
        hospital: "Bệnh viện Đa khoa Khánh Hòa",
        experience: "8 năm",
        rating: 4.8,
        image: "https://randomuser.me/api/portraits/women/44.jpg",
        available: true
    },
    {
        id: 3,
        name: "BS. Lê Minh Hoàng",
        specialty: "Nhi khoa",
        hospital: "Bệnh viện Nhi đồng",
        experience: "15 năm",
        rating: 4.7,
        image: "https://randomuser.me/api/portraits/men/45.jpg",
        available: false
    },
];

export default function Doctors() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSpecialty, setSelectedSpecialty] = useState("Tất cả");

    const specialties = ["Tất cả", "Nội khoa", "Sản phụ khoa", "Nhi khoa", "Ngoại khoa", "Tai mũi họng"];

    const filteredDoctors = doctors.filter(doctor => {
        const matchSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
        const matchSpecialty = selectedSpecialty === "Tất cả" || doctor.specialty === selectedSpecialty;
        return matchSearch && matchSpecialty;
    });

    return (
        <div className="container mx-auto px-6 py-10">
            <div className="mb-10">
                <h1 className="text-4xl font-bold text-gray-800 mb-3">Tìm bác sĩ</h1>
                <p className="text-gray-600">Hàng trăm bác sĩ giỏi đang chờ bạn đặt lịch</p>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-3.5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm theo tên bác sĩ hoặc chuyên khoa..."
                        className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-3">
                    <Filter className="text-gray-500" />
                    <select
                        className="px-6 py-4 border border-gray-300 rounded-2xl focus:outline-none"
                        value={selectedSpecialty}
                        onChange={(e) => setSelectedSpecialty(e.target.value)}
                    >
                        {specialties.map(spec => (
                            <option key={spec} value={spec}>{spec}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Doctors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDoctors.map(doctor => (
                    <div key={doctor.id} className="bg-white border border-gray-200 rounded-3xl overflow-hidden hover:shadow-xl transition">
                        <img
                            src={doctor.image}
                            alt={doctor.name}
                            className="w-full h-64 object-cover"
                        />

                        <div className="p-6">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="text-xl font-semibold">{doctor.name}</h3>
                                    <p className="text-blue-600 font-medium">{doctor.specialty}</p>
                                </div>
                                <div className="flex items-center gap-1 text-yellow-500">
                                    <Star className="w-5 h-5 fill-current" />
                                    <span className="font-medium">{doctor.rating}</span>
                                </div>
                            </div>

                            <p className="text-gray-600 text-sm mb-4">{doctor.hospital}</p>
                            <p className="text-sm text-gray-500 mb-6">Kinh nghiệm: {doctor.experience}</p>

                            <button
                                className={`w-full py-4 rounded-2xl font-medium transition
                  ${doctor.available
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                                disabled={!doctor.available}
                            >
                                {doctor.available ? 'Đặt lịch ngay' : 'Hết lịch hôm nay'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}