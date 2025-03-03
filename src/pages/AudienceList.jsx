import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SearchBar from "../components/Common/SearchBar";
import Pagination from "../components/Common/Pagination";

const AudienceList = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const workshopId = queryParams.get("workshopId");
  const [currentPage, setCurrentPage] = useState(1);

  const [audiences, setAudiences] = useState([
    {
      id: "T01",
      name: "Nguyễn Văn A",
      phone: "1234567890",
      email: "nguyenvana@gmail.com",
      date: "1/1/2021",
      status: "Đã điểm danh"
    },
    {
      id: "T02",
      name: "Trần Thị B",
      phone: "1234567890",
      email: "tranthib@gmail.com",
      date: "1/1/2021",
      status: "Chờ xác nhận"
    },
    {
      id: "T03",
      name: "Lê Văn C",
      phone: "1234567890",
      email: "levanc@gmail.com",
      date: "1/1/2021",
      status: "Vắng mặt"
    },
    {
      id: "T04",
      name: "Phạm Thị D",
      phone: "1234567890",
      email: "phamthid@gmail.com",
      date: "1/1/2021",
      status: "Chờ xác nhận"
    }
  ]);

  const [error, setError] = useState(true);

  const handleSearch = (searchTerm) => {
    console.log('Searching for:', searchTerm);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getStatusClassName = (status) => {
    switch (status) {
      case "Đã điểm danh":
        return "bg-green-500 text-white px-3 py-1 rounded-sm";
      case "Chờ xác nhận":
        return "bg-yellow-400 text-black px-3 py-1 rounded-sm";
      case "Vắng mặt":
        return "bg-red-500 text-white px-3 py-1 rounded-sm";
      default:
        return "bg-gray-500 text-white px-3 py-1 rounded-sm";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#B89D71] p-4">
        <h1 className="text-white text-xl font-semibold">Người tham dự</h1>
        <p className="text-white/80 text-sm">Báo cáo và tất cả khán giả đã tham gia trong hội thảo</p>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="mb-6 flex justify-end">
          <SearchBar onSearch={handleSearch} />
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <span className="font-bold">Đã xảy ra lỗi!</span>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã vé</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ và tên</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số điện thoại</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {audiences.map((audience) => (
                <tr key={audience.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{audience.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{audience.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{audience.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{audience.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{audience.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusClassName(audience.status)}>
                      {audience.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={5}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default AudienceList;
