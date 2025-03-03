import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/Common/SearchBar";
import Pagination from "../components/Common/Pagination";

const WorkshopStaff = () => {
  const navigate = useNavigate();
  const [workshops, setWorkshops] = useState([
    {
      id: 1,
      name: "Đại Đạo Chi Giản - Phong Thủy Cơ Học",
      master: "John Smith",
      location: "FPT University",
      date: "1/1/2021",
      status: "Checked in"
    },
    {
      id: 2,
      name: "Đại Đạo Chi Giản - Phong Thủy Cơ Học I",
      master: "John Smith",
      location: "FPT University",
      date: "1/1/2021",
      status: "Checking"
    },
    {
      id: 3,
      name: "Đại Đạo Chi Giản - Phong Thủy Cơ Học II",
      master: "John Smith",
      location: "FPT University",
      date: "1/1/2021",
      status: "Reject"
    },
    {
      id: 4,
      name: "Đại Đạo Chi Giản - Phong Thủy Cơ Học III",
      master: "John Smith",
      location: "FPT University",
      date: "1/1/2021",
      status: "Cancel"
    }
  ]);

  const [error, setError] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = (searchTerm) => {
    console.log('Searching for:', searchTerm);
  };

  const handleRowClick = (workshop) => {
    if (workshop.status === "Checked in") {
      navigate(`/audience?workshopId=${workshop.id}`);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    console.log("Changing to page:", page);
  };

  const getStatusClassName = (status) => {
    switch (status) {
      case "Checked in":
        return "bg-green-500 text-white px-2 py-1 rounded";
      case "Checking":
        return "bg-yellow-500 text-white px-2 py-1 rounded";
      case "Reject":
        return "bg-gray-500 text-white px-2 py-1 rounded";
      case "Cancel":
        return "bg-red-500 text-white px-2 py-1 rounded";
      default:
        return "";
    }
  };

  const getRowClassName = (status) => {
    return status === "Checked in" ? "cursor-pointer hover:bg-gray-100" : "";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#B89D71] p-4">
        <h1 className="text-white text-xl font-semibold">Quản lý hội thảo</h1>
        <p className="text-white/80 text-sm">Báo cáo và tổng quan về các hội thảo</p>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="mb-6 flex justify-end">
          <SearchBar onSearch={handleSearch} />
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <span className="font-bold">Đã xảy ra lỗi</span>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã hội thảo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên hội thảo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên chuyên gia
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Địa điểm
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {workshops.map((workshop) => (
                <tr 
                  key={workshop.id} 
                  className={getRowClassName(workshop.status)} 
                  onClick={() => handleRowClick(workshop)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{workshop.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{workshop.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{workshop.master}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{workshop.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{workshop.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusClassName(workshop.status)}>
                      {workshop.status}
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

export default WorkshopStaff; 