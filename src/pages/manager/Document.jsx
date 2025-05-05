import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Common/Pagination";
import CustomDatePicker from "../../components/Common/CustomDatePicker";
import Header from "../../components/Common/Header";
import dayjs from "dayjs";
import { getAllDocuments } from "../../services/document.service";
import { Spin, message, Empty, Button, Select } from "antd";
import { ReloadOutlined, FilterOutlined } from "@ant-design/icons";

const { Option } = Select;

const Document = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
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
      setPagination((prev) => ({
        ...prev,
        currentPage: page,
        totalPages: Math.ceil((data?.length || 0) / prev.pageSize) || 1,
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

  // In ra trạng thái của các hồ sơ để debug
  useEffect(() => {
    if (documents.length > 0) {
      console.log("Document statuses:");
      documents.forEach((doc, index) => {
        console.log(
          `${index + 1}. ID: ${doc.fengShuiDocumentId}, Status: ${doc.status}`
        );
      });
    }
  }, [documents]);

  // Effect để lọc dữ liệu mỗi khi documents hoặc statusFilter thay đổi
  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredDocuments(documents);
      return;
    }

    console.log(`Trying to filter by status: ${statusFilter}`);

    const filtered = documents.filter((item) => {
      // Bỏ qua trường hợp không có status
      if (!item.status) return false;

      // So sánh không phân biệt hoa thường
      return item.status.toLowerCase() === statusFilter.toLowerCase();
    });

    console.log(`Filtered results: ${filtered.length} items`);
    setFilteredDocuments(filtered);

    // Reset trang về 1 khi thay đổi bộ lọc
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
      totalPages: Math.ceil(filtered.length / prev.pageSize) || 1,
    }));
  }, [documents, statusFilter]);

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
    fetchDocuments(page);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    console.log(`Status filter changed to: ${value}`);
  };

  // Hàm định dạng hiển thị trạng thái
  const displayStatus = (status) => {
    if (!status) return "Không xác định";

    switch (status.toLowerCase()) {
      case "pending":
        return "Chờ xử lý";
      case "confirmedbymanager":
        return "Đã xác nhận";
      case "cancelledbymanager":
        return "Đã hủy bởi quản lý";
      case "cancelledbycustomer":
        return "Đã hủy bởi khách hàng";
      case "success":
        return "Thành công";
      default:
        return status;
    }
  };

  // Hàm chuyển đổi trạng thái từ API sang class
  const getStatusClass = (status) => {
    if (!status) return "bg-gray-50 text-gray-600 ring-1 ring-gray-500/20";

    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-50 text-yellow-600 ring-1 ring-yellow-500/20";
      case "confirmedbymanager":
        return "bg-blue-50 text-blue-600 ring-1 ring-blue-500/20";
      case "cancelledbymanager":
      case "cancelledbycustomer":
        return "bg-red-50 text-red-600 ring-1 ring-red-500/20";
      case "success":
        return "bg-green-50 text-green-600 ring-1 ring-green-500/20";
      default:
        return "bg-gray-50 text-gray-600 ring-1 ring-gray-500/20";
    }
  };

  // Sắp xếp documents theo độ ưu tiên của trạng thái
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    const statusPriority = {
      pending: 1, // Chờ xử lý - ưu tiên cao nhất
      confirmedbymanager: 2, // Đã xác nhận
      cancelledbymanager: 4, // Đã hủy bởi quản lý - ưu tiên thấp
      cancelledbycustomer: 5, // Đã hủy bởi khách hàng - ưu tiên thấp nhất
      success: 3, // Thành công
    };

    const statusA = a.status ? a.status.toLowerCase() : "unknown";
    const statusB = b.status ? b.status.toLowerCase() : "unknown";

    const priorityA = statusPriority[statusA] || 999;
    const priorityB = statusPriority[statusB] || 999;

    return priorityA - priorityB;
  });

  // Tính toán dữ liệu hiển thị theo trang
  const paginatedData = sortedDocuments.slice(
    (pagination.currentPage - 1) * pagination.pageSize,
    pagination.currentPage * pagination.pageSize
  );

  // Debug log cho trạng thái lọc và dữ liệu
  console.log("Current status filter:", statusFilter);
  console.log("Total documents:", documents.length);
  console.log("Filtered documents:", filteredDocuments.length);

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
            <Select
              placeholder="Lọc theo trạng thái"
              style={{ width: 220 }}
              value={statusFilter}
              onChange={handleStatusFilterChange}
              suffixIcon={<FilterOutlined />}
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="Pending">Chờ xử lý</Option>
              <Option value="ConfirmedByManager">Đã xác nhận</Option>
              <Option value="CancelledByManager">Đã hủy bởi quản lý</Option>
              <Option value="CancelledByCustomer">Đã hủy bởi khách hàng</Option>
              <Option value="Success">Thành công</Option>
            </Select>

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
                {filteredDocuments.length > 0 ? (
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                          Mã hồ sơ
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
                      {paginatedData.map((item) => (
                        <tr
                          key={item.fengShuiDocumentId}
                          className="hover:bg-gray-50 transition-all duration-200"
                        >
                          <td className="py-4 px-6 font-semibold text-[#B4925A]">
                            #{item.fengShuiDocumentId}
                          </td>
                          <td className="py-4 px-6 font-medium">
                            {item.docNo}
                          </td>
                          <td className="py-4 px-6 text-gray-600">
                            {item.documentName}
                          </td>
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
                              onClick={() =>
                                navigate(
                                  `/manager/document/${item.fengShuiDocumentId}`
                                )
                              }
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

        {filteredDocuments.length > 0 && (
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
