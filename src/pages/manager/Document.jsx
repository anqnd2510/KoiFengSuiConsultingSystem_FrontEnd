import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Common/Pagination";
import CustomDatePicker from "../../components/Common/CustomDatePicker";
import Header from "../../components/Common/Header";
import dayjs from "dayjs";
import { getAllDocuments } from "../../services/document.service";
import { Spin, message, Empty, Button } from "antd";
import { ReloadOutlined } from '@ant-design/icons';

const Document = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
  });

  const fetchDocuments = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page,
        pageSize: pagination.pageSize,
        date: selectedDate ? selectedDate.format("YYYY-MM-DD") : null,
      };
      
      console.log("Calling API with params:", params);
      const data = await getAllDocuments(params);
      console.log("Processed document data:", data);
      
      setDocuments(data || []);
      
      // Cập nhật phân trang dựa trên số lượng kết quả
      setPagination(prev => ({
        ...prev,
        currentPage: page,
        totalPages: Math.ceil((data?.length || 0) / prev.pageSize) || 1
      }));
      
    } catch (error) {
      console.error("Error in fetchDocuments:", error);
      setError(error.message || "Không thể tải danh sách hồ sơ");
      message.error("Không thể tải danh sách hồ sơ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments(pagination.currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]); // Chạy lại khi ngày được chọn thay đổi

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
    fetchDocuments(page);
  };

  // Hàm chuyển đổi trạng thái từ API sang hiển thị UI
  const getStatusClass = (status) => {
    if (!status) return "bg-gray-50 text-gray-600 ring-1 ring-gray-500/20";
    
    switch (status.toLowerCase()) {
      case "draft":
        return "bg-gray-50 text-gray-600 ring-1 ring-gray-500/20";
      case "published":
        return "bg-green-50 text-green-600 ring-1 ring-green-500/20";
      case "under review":
        return "bg-yellow-50 text-yellow-600 ring-1 ring-yellow-500/20";
      case "rejected":
        return "bg-red-50 text-red-600 ring-1 ring-red-500/20";
      case "archived":
        return "bg-blue-50 text-blue-600 ring-1 ring-blue-500/20";
      default:
        return "bg-gray-50 text-gray-600 ring-1 ring-gray-500/20";
    }
  };

  // Hàm định dạng hiển thị trạng thái
  const displayStatus = (status) => {
    if (!status) return "Không xác định";
    
    switch (status.toLowerCase()) {
      case "draft":
        return "Nháp";
      case "published":
        return "Đã xuất bản";
      case "under review":
        return "Đang xem xét";
      case "rejected":
        return "Bị từ chối";
      case "archived":
        return "Đã lưu trữ";
      default:
        return status;
    }
  };

  return (
    <>
      <Header title="Quản lý hồ sơ" description="Báo cáo và tất cả hồ sơ" />

      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="border-b border-gray-200">
            <div className="flex gap-1">
              <div
                className={`px-8 py-4 font-medium text-base relative transition-all duration-200 text-[#B4925A] border-[#B4925A] cursor-pointer`}
              >
                <span>Danh sách hồ sơ</span>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#B4925A]" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <CustomDatePicker
              value={selectedDate}
              onChange={(date) => setSelectedDate(date)}
            />
            <Button 
              icon={<ReloadOutlined />} 
              onClick={() => fetchDocuments(pagination.currentPage)}
              loading={loading}
            >
              Làm mới
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <Spin spinning={loading}>
            {error ? (
              <div className="p-8 text-center">
                <div className="text-red-500 mb-4">{error}</div>
                <Button 
                  type="primary" 
                  onClick={() => fetchDocuments(pagination.currentPage)}
                >
                  Thử lại
                </Button>
              </div>
            ) : (
              <>
                {documents.length > 0 ? (
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                          Mã hồ sơ
                        </th>
                        <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                          Phiên bản
                        </th>
                        <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                          Mã tài liệu
                        </th>
                        <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                          Tên hồ sơ
                        </th>
                        <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                          Trạng thái
                        </th>
                        <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                          Hành động
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {documents.map((item) => (
                        <tr
                          key={item.fengShuiDocumentId}
                          className="hover:bg-gray-50 transition-all duration-200"
                        >
                          <td className="py-4 px-6 font-semibold text-[#B4925A]">
                            #{item.fengShuiDocumentId}
                          </td>
                          <td className="py-4 px-6 font-medium">{item.version || "-"}</td>
                          <td className="py-4 px-6 font-medium">{item.docNo}</td>
                          <td className="py-4 px-6 text-gray-600">{item.documentName}</td>
                          <td className="py-4 px-6">
                            <span
                              className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${getStatusClass(
                                item.status
                              )}`}
                            >
                              {displayStatus(item.status)}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <button
                              onClick={() => navigate(`/manager/document/${item.fengShuiDocumentId}`)}
                              className="px-4 py-2 bg-[#B4925A] text-white text-sm rounded-lg hover:bg-[#8B6B3D] transition-all duration-200 shadow-sm cursor-pointer"
                            >
                              Chi tiết
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="py-16">
                    <Empty 
                      description="Không có dữ liệu hồ sơ" 
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  </div>
                )}
              </>
            )}
          </Spin>
        </div>

        {documents.length > 0 && (
          <div className="flex justify-end mt-6">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Document;
