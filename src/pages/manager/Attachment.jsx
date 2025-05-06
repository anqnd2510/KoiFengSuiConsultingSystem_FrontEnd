import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Common/Pagination";
import CustomDatePicker from "../../components/Common/CustomDatePicker";
import Header from "../../components/Common/Header";
import dayjs from "dayjs";
import { getAllAttachments } from "../../services/attachment.service";
import { Spin, message, Empty, Button, Select } from "antd";
import { ReloadOutlined, FilterOutlined } from "@ant-design/icons";

const { Option } = Select;

const Attachment = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [attachments, setAttachments] = useState([]);
  const [filteredAttachments, setFilteredAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
  });
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchAttachments = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page,
        pageSize: pagination.pageSize,
        date: selectedDate ? selectedDate.format("YYYY-MM-DD") : null,
      };

      console.log("Calling API with params:", params);
      const data = await getAllAttachments(params);
      console.log("Processed attachment data:", data);

      setAttachments(data || []);

      setPagination((prev) => ({
        ...prev,
        currentPage: page,
        totalPages: Math.ceil((data?.length || 0) / prev.pageSize) || 1,
      }));
    } catch (error) {
      console.error("Error in fetchAttachments:", error);
      setError(error.message || "Không thể tải danh sách biên bản nghiệm thu");
      message.error("Không thể tải danh sách biên bản nghiệm thu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttachments(pagination.currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredAttachments(attachments);
      return;
    }

    const filtered = attachments.filter((item) => {
      return (
        item.status && item.status.toLowerCase() === statusFilter.toLowerCase()
      );
    });

    setFilteredAttachments(filtered);

    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
      totalPages: Math.ceil(filtered.length / prev.pageSize) || 1,
    }));

    console.log(
      `Filtering by status: ${statusFilter}. Found ${filtered.length} items.`
    );
  }, [attachments, statusFilter]);

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const getStatusClass = (status) => {
    if (!status) return "bg-gray-50 text-gray-600 ring-1 ring-gray-500/20";

    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-50 text-yellow-600 ring-1 ring-yellow-500/20";
      case "confirmed":
        return "bg-blue-50 text-blue-600 ring-1 ring-blue-500/20";
      case "verifyingotp":
        return "bg-purple-50 text-purple-600 ring-1 ring-purple-500/20";
      case "success":
        return "bg-green-50 text-green-600 ring-1 ring-green-500/20";
      case "cancelled":
        return "bg-red-50 text-red-600 ring-1 ring-red-500/20";
      default:
        return "bg-gray-50 text-gray-600 ring-1 ring-gray-500/20";
    }
  };

  const getStatusTagColor = (status) => {
    if (!status) return "default";

    switch (status.toLowerCase()) {
      case "pending":
        return "warning";
      case "confirmed":
        return "processing";
      case "verifyingotp":
        return "purple";
      case "success":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const displayStatus = (status) => {
    if (!status) return "Không xác định";

    switch (status.toLowerCase()) {
      case "pending":
        return "Chờ xử lý";
      case "confirmed":
        return "Đã xác nhận";
      case "verifyingotp":
        return "Đang xác thực OTP";
      case "success":
        return "Thành công";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const sortedAttachments = [...filteredAttachments].sort((a, b) => {
    const statusPriority = {
      pending: 1, // Chờ xử lý - ưu tiên cao nhất
      verifyingotp: 2, // Đang xác thực OTP
      confirmed: 3, // Đã xác nhận
      success: 4, // Thành công
      cancelled: 5, // Đã hủy - ưu tiên thấp nhất
    };

    const statusA = a.status ? a.status.toLowerCase() : "unknown";
    const statusB = b.status ? b.status.toLowerCase() : "unknown";

    const priorityA = statusPriority[statusA] || 999;
    const priorityB = statusPriority[statusB] || 999;

    return priorityA - priorityB;
  });

  const paginatedData = sortedAttachments.slice(
    (pagination.currentPage - 1) * pagination.pageSize,
    pagination.currentPage * pagination.pageSize
  );

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    console.log(`Status filter changed to: ${value}`);
  };

  console.log("Current status filter:", statusFilter);
  console.log("Total attachments:", attachments.length);
  console.log("Filtered attachments:", filteredAttachments.length);
  console.log("Paginated data:", paginatedData.length);

  // Hàm chuyển đổi HEX sang RGBA
  const hexToRgba = (hex, alpha = 1) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const getStatusColor = (status) => {
    if (!status) return "#bfbfbf";

    switch (status.toLowerCase()) {
      case "pending":
        return "#faad14";
      case "confirmed":
        return "#1890ff";
      case "verifyingotp":
        return "#722ed1";
      case "success":
        return "#52c41a";
      case "cancelled":
        return "#f5222d";
      default:
        return "#bfbfbf";
    }
  };

  const renderStatusTag = (status) => {
    const displayText = displayStatus(status);
    const isSuccess =
      status?.toLowerCase() === "success" || displayText.includes("thành công");
    const isCancelled =
      status?.toLowerCase() === "cancelled" || displayText.includes("hủy");

    // Xác định style dựa trên loại trạng thái
    const getStatusStyle = () => {
      if (isCancelled) {
        return {
          color: "#ff4d4f",
          backgroundColor: "#fff2f0",
          border: "1px solid #ffccc7",
          borderRadius: "20px",
          padding: "4px 12px",
          fontWeight: "500",
          fontSize: "13px",
          boxShadow: "0 2px 0 rgba(255,77,79,0.06)",
          display: "inline-block",
          textAlign: "center",
        };
      } else if (isSuccess) {
        return {
          color: "#52c41a",
          backgroundColor: "#f6ffed",
          border: "1px solid #b7eb8f",
          borderRadius: "20px",
          padding: "4px 12px",
          fontWeight: "500",
          fontSize: "13px",
          boxShadow: "0 2px 0 rgba(82,196,26,0.06)",
          display: "inline-block",
          textAlign: "center",
        };
      } else {
        // Sử dụng màu từ getStatusColor
        const color = getStatusColor(status);
        return {
          color: color,
          backgroundColor: `${hexToRgba(color, 0.1)}`,
          border: `1px solid ${hexToRgba(color, 0.3)}`,
          borderRadius: "20px",
          padding: "4px 12px",
          fontWeight: "500",
          fontSize: "13px",
          boxShadow: `0 2px 0 ${hexToRgba(color, 0.06)}`,
          display: "inline-block",
          textAlign: "center",
        };
      }
    };

    return <span style={getStatusStyle()}>{displayText}</span>;
  };

  return (
    <>
      <Header
        title="Biên bản nghiệm thu"
        description="Báo cáo và tất cả biên bản nghiệm thu"
      />

      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="border-b border-gray-200">
            <div className="flex gap-1">
              <div
                className={`px-8 py-4 font-medium text-base relative transition-all duration-200 text-[#B4925A] border-[#B4925A] cursor-pointer`}
              >
                <span>Danh sách biên bản</span>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#B4925A]" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Select
              placeholder="Lọc theo trạng thái"
              style={{ width: 180 }}
              value={statusFilter}
              onChange={handleStatusFilterChange}
              suffixIcon={<FilterOutlined />}
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="Pending">Chờ xử lý</Option>
              <Option value="Confirmed">Đã xác nhận</Option>
              <Option value="VerifyingOTP">Đang xác thực OTP</Option>
              <Option value="Success">Thành công</Option>
              <Option value="Cancelled">Đã hủy</Option>
            </Select>
            <CustomDatePicker
              value={selectedDate}
              onChange={(date) => setSelectedDate(date)}
            />
            <Button
              icon={<ReloadOutlined />}
              onClick={() => fetchAttachments(pagination.currentPage)}
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
                  onClick={() => fetchAttachments(pagination.currentPage)}
                >
                  Thử lại
                </Button>
              </div>
            ) : (
              <>
                {paginatedData.length > 0 ? (
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                          Mã biên bản nghiệm thu
                        </th>
                        <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                          Mã tài liệu
                        </th>
                        <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                          Tên biên bản nghiệm thu
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
                          key={item.attachmentId}
                          className="hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                          onClick={() =>
                            navigate(`/manager/attachment/${item.attachmentId}`)
                          }
                        >
                          <td className="py-4 px-6 font-semibold text-[#B4925A]">
                            #{item.attachmentId}
                          </td>
                          <td className="py-4 px-6 font-medium">
                            {item.docNo}
                          </td>
                          <td className="py-4 px-6 text-gray-600">
                            {item.attachmentName}
                          </td>
                          <td className="py-4 px-6">
                            {renderStatusTag(item.status)}
                          </td>
                          <td className="py-4 px-6">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                  `/manager/attachment/${item.attachmentId}`
                                );
                              }}
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
                      description="Không có dữ liệu biên bản nghiệm thu"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  </div>
                )}
              </>
            )}
          </Spin>
        </div>

        {sortedAttachments.length > 0 && (
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

export default Attachment;
