import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/Common/SearchBar";
import Pagination from "../../components/Common/Pagination";
import Header from "../../components/Common/Header";
import CustomButton from "../../components/Common/CustomButton";

const WorkshopList = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5); // Giả sử có 5 trang

  const handleSearch = (searchTerm) => {
    // Xử lý tìm kiếm ở đây
    console.log("Searching for:", searchTerm);
  };

  // Xử lý chuyển trang
  const handlePageChange = (page) => {
    try {
      if (page < 1 || page > totalPages) {
        throw new Error("Trang không hợp lệ");
      }
      setCurrentPage(page);
      console.log("Changing to page:", page);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Quản lý hội thảo"
        description="Báo cáo và tổng quan về các hội thảo"
      />

      {/* Main Content */}
      <div className="p-6">
        <div className="mb-6 flex justify-end">
          <SearchBar onSearch={handleSearch} />
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <span className="font-bold flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </span>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between bg-white rounded-md border p-4">
              <span className="text-gray-700 font-medium">
                Kiểm tra hội thảo
              </span>
              <CustomButton
                onClick={() => {
                  try {
                    navigate("/manager/workshopcheck");
                  } catch (err) {
                    setError("Không thể chuyển đến trang kiểm tra");
                  }
                }}
                className="bg-[#00B14F] hover:bg-green-600 text-white"
              >
                Xem
              </CustomButton>
            </div>

            <div className="flex items-center justify-between bg-white rounded-md border p-4">
              <span className="text-gray-700 font-medium">
                Quản lý hội thảo
              </span>
              <CustomButton
                onClick={() => {
                  try {
                    navigate("/manager/workshop-manager");
                  } catch (err) {
                    setError("Không thể chuyển đến trang quản lý");
                  }
                }}
                className="bg-[#00B14F] hover:bg-green-600 text-white"
              >
                Xem
              </CustomButton>
            </div>
          </div>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default WorkshopList;
