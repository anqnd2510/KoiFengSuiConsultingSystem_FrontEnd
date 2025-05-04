import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Common/Pagination";
import CustomDatePicker from "../../components/Common/CustomDatePicker";
import Header from "../../components/Common/Header";
import dayjs from "dayjs";
import { getAllContracts } from "../../services/contract.service";
import { Spin, message, Empty, Button, Select } from "antd";
import { ReloadOutlined, FilterOutlined } from "@ant-design/icons";

const { Option } = Select;

const Contract = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [contracts, setContracts] = useState([]);
  const [filteredContracts, setFilteredContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
  });

  const fetchContracts = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page,
        pageSize: pagination.pageSize,
        date: selectedDate ? selectedDate.format("YYYY-MM-DD") : null,
      };

      console.log("Calling API with params:", params);
      const data = await getAllContracts(params);
      console.log("Processed contract data:", data);

      setContracts(data || []);

      // Cập nhật phân trang dựa trên số lượng kết quả
      setPagination((prev) => ({
        ...prev,
        currentPage: page,
        totalPages: Math.ceil((data?.length || 0) / prev.pageSize) || 1,
      }));
    } catch (error) {
      console.error("Error in fetchContracts:", error);
      setError(error.message || "Không thể tải danh sách hợp đồng");
      message.error("Không thể tải danh sách hợp đồng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts(pagination.currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]); // Chạy lại khi ngày được chọn thay đổi

  // Effect để lọc dữ liệu theo trạng thái
  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredContracts(contracts);
    } else {
      const filtered = contracts.filter((item) => {
        if (!item.status) return false;
        return item.status.toLowerCase() === statusFilter.toLowerCase();
      });

      setFilteredContracts(filtered);
      console.log(
        `Filtering by status: ${statusFilter}. Found ${filtered.length} items.`
      );
    }

    // Cập nhật phân trang khi lọc
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
      totalPages:
        Math.ceil(
          (statusFilter === "all"
            ? contracts.length
            : // Use the filtered array length directly instead of filteredContracts which might not be updated yet
              contracts.filter((item) =>
                !item.status
                  ? false
                  : item.status.toLowerCase() === statusFilter.toLowerCase()
              ).length) / prev.pageSize
        ) || 1,
    }));
  }, [contracts, statusFilter]);

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
    fetchContracts(page);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    console.log(`Status filter changed to: ${value}`);
  };

  // Hàm chuyển đổi trạng thái từ API sang hiển thị UI
  const getStatusClass = (status) => {
    if (!status) return "bg-gray-50 text-gray-600 ring-1 ring-gray-500/20";

    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-50 text-yellow-600 ring-1 ring-yellow-500/20";
      case "contractrejectedbymanager":
      case "contractrejectedbycustomer":
        return "bg-red-50 text-red-600 ring-1 ring-red-500/20";
      case "contractapprovedbymanager":
        return "bg-blue-50 text-blue-600 ring-1 ring-blue-500/20";
      case "verifyingotp":
        return "bg-purple-50 text-purple-600 ring-1 ring-purple-500/20";
      case "firstpaymentpending":
        return "bg-orange-50 text-orange-600 ring-1 ring-orange-500/20";
      case "firstpaymentsuccess":
        return "bg-green-50 text-green-600 ring-1 ring-green-500/20";
      default:
        return "bg-gray-50 text-gray-600 ring-1 ring-gray-500/20";
    }
  };

  // Hàm định dạng hiển thị trạng thái
  const displayStatus = (status) => {
    if (!status) return "Không xác định";

    switch (status.toLowerCase()) {
      case "pending":
        return "Chờ xử lý";
      case "contractrejectedbymanager":
        return "Bị từ chối bởi quản lý";
      case "contractrejectedbycustomer":
        return "Bị từ chối bởi khách hàng";
      case "contractapprovedbymanager":
        return "Được duyệt bởi quản lý";
      case "verifyingotp":
        return "Đang xác thực OTP";
      case "firstpaymentpending":
        return "Chờ thanh toán lần đầu";
      case "firstpaymentsuccess":
        return "Đã thanh toán lần đầu";
      default:
        return status;
    }
  };

  // Sắp xếp contracts theo độ ưu tiên của trạng thái
  const sortedContracts = [...filteredContracts].sort((a, b) => {
    const statusPriority = {
      pending: 1, // Chờ xử lý - ưu tiên cao nhất
      contractapprovedbymanager: 2, // Được duyệt bởi quản lý
      verifyingotp: 3, // Đang xác thực OTP
      firstpaymentpending: 4, // Chờ thanh toán lần đầu
      firstpaymentsuccess: 5, // Đã thanh toán lần đầu
      contractrejectedbymanager: 6, // Bị từ chối bởi quản lý
      contractrejectedbycustomer: 7, // Bị từ chối bởi khách hàng
    };

    const statusA = a.status ? a.status.toLowerCase() : "unknown";
    const statusB = b.status ? b.status.toLowerCase() : "unknown";

    const priorityA = statusPriority[statusA] || 999;
    const priorityB = statusPriority[statusB] || 999;

    return priorityA - priorityB;
  });

  // Hàm định dạng ngày tháng
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return dayjs(dateString).format("DD/MM/YYYY");
  };

  return (
    <>
      <Header
        title="Quản lý hợp đồng"
        description="Báo cáo và tất cả hợp đồng"
      />

      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="border-b border-gray-200">
            <div className="flex gap-1">
              <div
                className={`px-8 py-4 font-medium text-base relative transition-all duration-200 text-[#B4925A] border-[#B4925A] cursor-pointer`}
              >
                <span>Danh sách hợp đồng</span>
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
              <Option value="ContractRejectedByManager">
                Bị từ chối bởi quản lý
              </Option>
              <Option value="ContractRejectedByCustomer">
                Bị từ chối bởi khách hàng
              </Option>
              <Option value="ContractApprovedByManager">
                Được duyệt bởi quản lý
              </Option>
              <Option value="VerifyingOTP">Đang xác thực OTP</Option>
              <Option value="FirstPaymentPending">
                Chờ thanh toán lần đầu
              </Option>
              <Option value="FirstPaymentSuccess">Đã thanh toán lần đầu</Option>
            </Select>
            <CustomDatePicker
              value={selectedDate}
              onChange={(date) => setSelectedDate(date)}
            />
            <Button
              icon={<ReloadOutlined />}
              onClick={() => fetchContracts(pagination.currentPage)}
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
                  onClick={() => fetchContracts(pagination.currentPage)}
                >
                  Thử lại
                </Button>
              </div>
            ) : (
              <>
                {filteredContracts.length > 0 ? (
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                          Mã hợp đồng
                        </th>
                        <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                          Mã tài liệu
                        </th>
                        <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                          Tên hợp đồng
                        </th>
                        <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                          Ngày tạo
                        </th>
                        <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                          Ngày cập nhật
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
                      {sortedContracts.map((item) => (
                        <tr
                          key={item.contractId}
                          className="hover:bg-gray-50 transition-all duration-200"
                        >
                          <td className="py-4 px-6 font-semibold text-[#B4925A]">
                            #{item.contractId}
                          </td>
                          <td className="py-4 px-6 font-medium">
                            {item.docNo}
                          </td>
                          <td className="py-4 px-6 text-gray-600">
                            {item.contractName}
                          </td>
                          <td className="py-4 px-6 text-gray-600">
                            {formatDate(item.createdDate)}
                          </td>
                          <td className="py-4 px-6 text-gray-600">
                            {formatDate(item.updatedDate)}
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
                                navigate(`/manager/contract/${item.contractId}`)
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
                      description="Không có dữ liệu hợp đồng"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  </div>
                )}
              </>
            )}
          </Spin>
        </div>

        {filteredContracts.length > 0 && (
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

export default Contract;
