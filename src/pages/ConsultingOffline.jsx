import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Common/Pagination";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaCalendar,
  FaComments,
  FaUsers,
  FaBell,
  FaBook,
  FaClock,
  FaBlog,
  FaTools,
  FaGraduationCap,
  FaHeadset,
} from "react-icons/fa";
import Sidebar from "../components/Layout/Sidebar";
import CustomDatePicker from "../components/Common/CustomDatePicker";
import Header from "../components/Common/Header";
import Error from "../components/Common/Error";
import CustomButton from "../components/Common/CustomButton";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { Modal, Select, Tag } from "antd";
import CustomTable from "../components/Common/CustomTable";
import { getOfflineConsultingBookings } from "../services/booking.service";
import { message } from "antd";

const ConsultingOffline = () => {
  const [activeTab, setActiveTab] = useState("request");
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchOfflineConsultingBookings();
  }, [currentPage, selectedDate]);

  const fetchOfflineConsultingBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getOfflineConsultingBookings();

      const formattedData = response.data.map((booking, index) => ({
        id: booking.bookingOfflineId || index,
        customer: booking.customerName || "Không có tên",
        service: booking.type || "Tư vấn trực tiếp",
        date:
          booking.bookingDate || dayjs(booking.createdAt).format("DD-MM-YYYY"),
        status: mapStatusFromApi(booking.status),
        description: booking.description || "",
        location: booking.location || "",
        masterName: booking.masterName || "",
        masterNote: booking.masterNote || "",
        rawData: booking,
        key: booking.bookingOfflineId || `booking-${index}`,
      }));

      setBookings(formattedData);

      if (response.pagination) {
        setTotalPages(response.pagination.totalPages || 1);
      }
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu tư vấn trực tiếp:", err);
      setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      message.error("Không thể tải dữ liệu tư vấn trực tiếp");
    } finally {
      setLoading(false);
    }
  };

  const mapStatusFromApi = (apiStatus) => {
    switch (apiStatus) {
      case "Scheduled":
        return "Đã lên lịch";
      case "Completed":
        return "Hoàn thành";
      case "Cancelled":
        return "Đã hủy";
      case "Pending":
        return "Chờ xử lý";
      case "In Progress":
        return "Đang xử lý";
      default:
        return apiStatus || "Không xác định";
    }
  };

  const mapStatusToApi = (uiStatus) => {
    switch (uiStatus) {
      case "Đã lên lịch":
        return "Scheduled";
      case "Hoàn thành":
        return "Completed";
      case "Đã hủy":
        return "Cancelled";
      case "Chờ xử lý":
        return "Pending";
      case "Đang xử lý":
        return "In Progress";
      default:
        return "Scheduled";
    }
  };

  const handleStatusChange = async (value, item) => {
    try {
      const updatedBookings = bookings.map((booking) => {
        if (booking.id === item.id) {
          return { ...booking, status: value };
        }
        return booking;
      });

      setBookings(updatedBookings);

      if (selectedItem && selectedItem.id === item.id) {
        setSelectedItem({ ...selectedItem, status: value });
      }

      message.success("Cập nhật trạng thái thành công");
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái:", err);
      message.error("Không thể cập nhật trạng thái. Vui lòng thử lại.");
    }
  };

  const handleSaveChanges = async () => {
    try {
      message.success("Lưu thông tin thành công");
      handleCloseModal();
      fetchOfflineConsultingBookings();
    } catch (err) {
      console.error("Lỗi khi lưu thông tin:", err);
      message.error("Không thể lưu thông tin. Vui lòng thử lại.");
    }
  };

  const formatDate = (date) => {
    return date.locale("vi").format("dddd, DD [tháng] MM, YYYY");
  };

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Đã lên lịch":
        return "blue";
      case "Đang xử lý":
        return "warning";
      case "Hoàn thành":
        return "success";
      case "Đã hủy":
        return "error";
      case "Chờ xử lý":
        return "default";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "Mã",
      key: "id",
      render: (_, record) => (
        <span className="font-semibold text-[#B4925A]">
          #{record.id ? record.id.toString().padStart(4, "0") : "0000"}
        </span>
      ),
      width: "10%",
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
      key: "customer",
      width: "20%",
    },
    {
      title: "Dịch vụ",
      dataIndex: "service",
      key: "service",
      width: "30%",
    },
    {
      title: "Ngày tạo",
      dataIndex: "date",
      key: "date",
      width: "15%",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "15%",
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: "Thao tác",
      key: "action",
      width: "10%",
      render: (_, record) => (
        <button
          onClick={() => handleOpenModal(record)}
          className="px-4 py-2 bg-[#B4925A] text-white text-sm rounded-lg hover:bg-[#8B6B3D] transition-all duration-200 shadow-sm cursor-pointer"
        >
          Chi tiết
        </button>
      ),
    },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Header
          title="Tư vấn trực tiếp"
          description="Quản lý và theo dõi các buổi tư vấn trực tiếp"
        />

        <div className="p-8">
          <div className="flex justify-between mb-8">
            <div className="border-b border-gray-200">
              <div className="flex gap-1">
                <div
                  className={`px-8 py-4 font-medium text-base relative transition-all duration-200 text-[#B4925A] border-[#B4925A] cursor-pointer`}
                >
                  <span>Yêu cầu tư vấn</span>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#B4925A]" />
                </div>
                <button
                  onClick={() => navigate("/contract")}
                  className="px-8 py-4 font-medium text-base text-gray-500 hover:text-gray-800 cursor-pointer"
                >
                  Hợp đồng
                </button>
              </div>
            </div>

            <CustomDatePicker
              value={selectedDate}
              onChange={(date) => setSelectedDate(date)}
            />
          </div>

          {error && <Error message={error} />}

          <CustomTable
            columns={columns}
            dataSource={bookings}
            loading={loading}
          />

          <div className="flex justify-end mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
              }}
            />
          </div>
        </div>

        <Modal
          title={
            <div className="text-xl font-semibold">Chi tiết yêu cầu tư vấn</div>
          }
          open={isModalOpen}
          onCancel={handleCloseModal}
          footer={null}
          width={600}
          className="consulting-detail-modal"
        >
          {selectedItem && (
            <div className="p-4 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Tên khách hàng
                  </label>
                  <input
                    type="text"
                    value={selectedItem.customer}
                    readOnly
                    className="w-full px-4 py-2 rounded-full border border-gray-200 bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Dịch vụ
                  </label>
                  <input
                    type="text"
                    value={selectedItem.service}
                    readOnly
                    className="w-full px-4 py-2 rounded-full border border-gray-200 bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Trạng thái
                  </label>
                  <Select
                    value={selectedItem.status}
                    onChange={(value) => {
                      setSelectedItem({ ...selectedItem, status: value });
                    }}
                    className="w-full"
                    options={[
                      { value: "Đã lên lịch", label: "Đã lên lịch" },
                      { value: "Đang xử lý", label: "Đang xử lý" },
                      { value: "Hoàn thành", label: "Hoàn thành" },
                      { value: "Đã hủy", label: "Đã hủy" },
                      { value: "Chờ xử lý", label: "Chờ xử lý" },
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Ghi chú
                  </label>
                  <textarea
                    value={selectedItem.notes || ""}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        notes: e.target.value,
                      })
                    }
                    placeholder="Nhập ghi chú..."
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 min-h-[100px]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <CustomButton
                  onClick={handleCloseModal}
                  className="px-6 py-2 rounded-full bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  Hủy
                </CustomButton>
                <CustomButton
                  onClick={handleSaveChanges}
                  className="px-6 py-2 rounded-full bg-black text-white font-medium hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Lưu
                </CustomButton>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

const styles = `
  .consulting-detail-modal .ant-modal-content {
    border-radius: 16px;
    overflow: hidden;
  }
  .consulting-detail-modal .ant-modal-header {
    border-bottom: 1px solid #f0f0f0;
    padding: 16px 24px;
  }
  .consulting-detail-modal .ant-modal-body {
    padding: 0;
  }
`;

if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default ConsultingOffline;
