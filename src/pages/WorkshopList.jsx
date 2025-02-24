import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WorkshopList = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(99); // Giả sử có 99 trang

  // Xử lý chuyển trang
  const handlePageChange = (page) => {
    try {
      if (page < 1 || page > totalPages) {
        throw new Error("Trang không hợp lệ");
      }
      setCurrentPage(page);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6">
      <div className="bg-[#B08D57] text-white p-4 mb-4">
        <h1 className="text-xl">Workshops Management </h1>
        <p className="text-sm">Reports and overview of your workshops</p>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search content..."
          className="w-full px-4 py-2 border rounded-lg"
        />
        <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 19L13 13M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8Z" 
              stroke="#666666" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
          </svg>
        </button>
        </div>

      {error && (
        <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
            </svg>
            {error}
          </span>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between bg-white rounded-md border p-4">
          <span className="text-gray-700">Check workshops</span>
          <button 
            onClick={() => {
              try {
                navigate('/workshop/check');
              } catch (err) {
                setError("Không thể chuyển đến trang kiểm tra");
              }
            }}
            className="inline-flex items-center justify-center bg-[#00B14F] text-white text-sm px-3 py-1 rounded-sm hover:bg-green-600"
          >
            View
          </button>
        </div>

        <div className="flex items-center justify-between bg-white rounded-md border p-4">
          <span className="text-gray-700">Manage workshops</span>
          <button 
            onClick={() => {
              try {
                navigate('/workshop/manage');
              } catch (err) {
                setError("Không thể chuyển đến trang quản lý");
              }
            }}
            className="inline-flex items-center justify-center bg-[#00B14F] text-white text-sm px-3 py-1 rounded-sm hover:bg-green-600"
          >
            View
          </button>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-end mt-8">
        <div className="flex items-center gap-1 bg-gray-100 px-4 py-2 rounded-md">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 border bg-white rounded hover:bg-gray-50 ${
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Previous
          </button>
          
          {[...Array(3)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === index + 1 ? 'bg-green-500 text-white' : 'bg-white hover:bg-gray-50'
              }`}
            >
              {index + 1}
            </button>
          ))}
          
          <span className="px-2">...</span>
          
          <button
            onClick={() => handlePageChange(totalPages)}
            className={`px-3 py-1 border rounded ${
              currentPage === totalPages ? 'bg-green-500 text-white' : 'bg-white hover:bg-gray-50'
            }`}
          >
            {totalPages}
          </button>
          
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 border bg-white rounded hover:bg-gray-50 ${
              currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkshopList;
