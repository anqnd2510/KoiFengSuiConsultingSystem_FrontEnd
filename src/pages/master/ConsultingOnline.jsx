import React, { useState, useEffect } from "react";
import { Select, Tag, Modal, Input, message } from "antd";
import Pagination from "../../components/Common/Pagination";
import CustomDatePicker from "../../components/Common/CustomDatePicker";
import dayjs from "dayjs";
import CustomTable from "../../components/Common/CustomTable";
import Header from "../../components/Common/Header";
import Error from "../../components/Common/Error";
import {
  getOnlineConsultingBookings,
  getBookingOnlineDetail,
  completeConsulting,
  updateConsultingNote,
} from "../../services/booking.service";

const { Option } = Select;
const { TextArea } = Input;

const ConsultingOnline = () => {
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [consultingData, setConsultingData] = useState([]);
  const [loading, setLoading] = useState(false);
  //mai mốt cần thêm thì thêm ở dây
  const tabs = ["Tất cả", "Chờ xử lý", "Đã xác nhận", "Hoàn thành"];
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [masterNote, setMasterNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [completingConsulting, setCompletingConsulting] = useState(false);
  const [confirmingConsulting, setConfirmingConsulting] = useState(false);

  const fetchConsultingData = async (date) => {
    setLoading(true);
    try {
      // Truyền ngày được chọn vào API call nếu cần
      const response = await getOnlineConsultingBookings(
        date?.format("YYYY-MM-DD")
      );
      setConsultingData(response.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching consulting data:", err);
      // Nếu là lỗi 404 hoặc không có dữ liệu, không hiển thị lỗi
      if (
        err.response &&
        (err.response.status === 404 || err.response.status === "404")
      ) {
        setConsultingData([]);
        setError(null);
      } else {
        // Chỉ hiển thị lỗi khi có vấn đề kết nối hoặc server
        setError(
          "Không thể tải dữ liệu tư vấn trực tuyến. Vui lòng thử lại sau."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchConsultingData(selectedDate);
    };
    fetchData();
  }, [selectedDate]);

  // Ánh xạ trạng thái từ tiếng Anh sang tiếng Việt
  const mapStatus = (status) => {
    const statusMap = {
      Confirmed: "Đã xác nhận",
      Pending: "Chờ xử lý",
      Completed: "Hoàn thành",
    };
    return statusMap[status] || status;
  };

  // Filter data based on active tab
  const filteredData = consultingData.filter((item) => {
    const vietnameseStatus = mapStatus(item.status);
    if (activeTab === "Tất cả") return true;
    return vietnameseStatus === activeTab;
  });

  const getStatusColor = (status) => {
    const vietnameseStatus = mapStatus(status);
    switch (vietnameseStatus) {
      case "Hoàn thành":
        return "success";
      case "Chờ xử lý":
        return "warning";
      case "Đã xác nhận":
        return "blue";
      default:
        return "default";
    }
  };

  // Hàm để lấy chi tiết booking khi người dùng bấm vào một hàng
  const handleRowClick = async (record) => {
    setDetailLoading(true);
    try {
      const response = await getBookingOnlineDetail(record.bookingOnlineId);
      setSelectedBooking(response.data || record);
      setMasterNote(response.data?.masterNote || "");
      setDetailModalVisible(true);
    } catch (err) {
      console.error("Error fetching booking detail:", err);
      // Nếu không lấy được chi tiết, hiển thị thông tin cơ bản từ record
      setSelectedBooking(record);
      setMasterNote(record.masterNote || "");
      setDetailModalVisible(true);
    } finally {
      setDetailLoading(false);
    }
  };

  // Hàm đóng modal
  const handleCloseModal = () => {
    setDetailModalVisible(false);
    setSelectedBooking(null);
  };

  // Hàm xác nhận buổi tư vấn (sử dụng cùng API với hoàn thành)
  const handleConfirmConsulting = async () => {
    if (!selectedBooking?.bookingOnlineId) return;

    setConfirmingConsulting(true);
    try {
      await completeConsulting(selectedBooking.bookingOnlineId);
      message.success("Đã xác nhận buổi tư vấn thành công!");

      // Đóng modal sau khi xác nhận thành công
      setDetailModalVisible(false);

      // Refresh danh sách
      fetchConsultingData(selectedDate);
    } catch (err) {
      console.error("Error confirming consulting:", err);
      message.error("Không thể xác nhận buổi tư vấn. Vui lòng thử lại!");
    } finally {
      setConfirmingConsulting(false);
    }
  };

  // Hàm xử lý khi hoàn thành buổi tư vấn
  const handleCompleteConsulting = async () => {
    if (!selectedBooking?.bookingOnlineId) return;

    setCompletingConsulting(true);
    try {
      await completeConsulting(selectedBooking.bookingOnlineId);
      message.success("Đã hoàn thành buổi tư vấn thành công!");

      // Đóng modal sau khi hoàn thành thành công
      setDetailModalVisible(false);

      // Refresh danh sách
      fetchConsultingData(selectedDate);
    } catch (err) {
      console.error("Error completing consulting:", err);
      message.error("Không thể hoàn thành buổi tư vấn. Vui lòng thử lại!");
    } finally {
      setCompletingConsulting(false);
    }
  };

  // Hàm lưu ghi chú sau tư vấn
  const handleSaveNote = async () => {
    if (!selectedBooking?.bookingOnlineId) return;

    setSavingNote(true);
    try {
      await updateConsultingNote(selectedBooking.bookingOnlineId, masterNote);
      message.success("Đã lưu ghi chú thành công!");

      // Cập nhật trạng thái trong state
      setSelectedBooking({
        ...selectedBooking,
        masterNote: masterNote,
      });
    } catch (err) {
      console.error("Error saving note:", err);
      message.error("Không thể lưu ghi chú. Vui lòng thử lại!");
    } finally {
      setSavingNote(false);
    }
  };

  const columns = [
    {
      title: "Mã",
      dataIndex: "bookingOnlineId",
      key: "bookingOnlineId",
      width: "10%",
      render: (id) => <span>#{id.toString().padStart(4, "0")}</span>,
    },
    {
      title: "Ngày",
      dataIndex: "bookingDate",
      key: "bookingDate",
      width: "10%",
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      width: "15%",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: "20%",
    },
    {
      title: "Thời gian",
      key: "time",
      width: "15%",
      render: (_, record) => (
        <span>
          {record.startTime} - {record.endTime}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "15%",
      render: (status) => (
        <Tag color={getStatusColor(status)}>{mapStatus(status)}</Tag>
      ),
    },
  ];

  // Hàm xử lý khi thay đổi tab
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex-1 flex">
      {/* Sidebar here */}
      <div className="flex-1">
        <Header
          title="Tư vấn trực tuyến"
          description="Quản lý và theo dõi các buổi tư vấn trực tuyến"
        />

        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="inline-flex p-1 bg-white rounded-xl mb-6 shadow-sm">
              {tabs.map((tab, index) => (
                <button
                  key={`tab-${index}`}
                  onClick={() => handleTabChange(tab)}
                  className={`
                    px-5 py-2.5 
                    rounded-lg 
                    font-medium 
                    transition-all 
                    duration-200
                    ${
                      activeTab === tab
                        ? "bg-[#B4925A] text-white shadow-sm"
                        : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                    }
                  `}
                >
                  {tab}
                </button>
              ))}
            </div>
            <CustomDatePicker
              value={selectedDate}
              onChange={(date) => setSelectedDate(date)}
            />
          </div>

          {error && <Error message={error} />}

          <CustomTable
            columns={columns}
            dataSource={filteredData.map((item) => ({
              ...item,
              key: item.bookingOnlineId,
            }))}
            loading={loading}
            onRowClick={handleRowClick}
          />

          <div className="flex justify-end mt-6">
            <Pagination
              currentPage={1}
              totalPages={Math.ceil(filteredData.length / 10)}
              onPageChange={(page) => {
                console.log("Chuyển đến trang:", page);
              }}
            />
          </div>
        </div>

        {/* Modal hiển thị chi tiết */}
        <Modal
          title={
            <div className="flex items-center gap-3">
              <span className="text-xl font-semibold text-gray-800">
                Chi tiết buổi tư vấn
              </span>
              {selectedBooking && (
                <Tag
                  color={getStatusColor(selectedBooking.status)}
                  className="text-sm py-1"
                >
                  {mapStatus(selectedBooking.status)}
                </Tag>
              )}
            </div>
          }
          open={detailModalVisible}
          onCancel={handleCloseModal}
          footer={
            <div className="flex justify-end gap-3 pt-2">
              {selectedBooking?.status === "Pending" && (
                <button
                  className={`px-5 py-2 rounded-lg transition-all ${
                    confirmingConsulting
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-[#B4925A] text-white hover:bg-[#a38049]"
                  }`}
                  onClick={handleConfirmConsulting}
                  disabled={confirmingConsulting}
                >
                  {confirmingConsulting ? "Đang xử lý..." : "Xác nhận"}
                </button>
              )}
              {selectedBooking?.status === "Confirmed" && (
                <button
                  className={`px-5 py-2 rounded-lg transition-all ${
                    completingConsulting
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                  onClick={handleCompleteConsulting}
                  disabled={completingConsulting}
                >
                  {completingConsulting
                    ? "Đang xử lý..."
                    : "Xác nhận hoàn thành"}
                </button>
              )}
              <button
                onClick={handleCloseModal}
                className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all cursor-pointer"
              >
                Đóng
              </button>
            </div>
          }
          width={700}
          className="consulting-detail-modal"
        >
          {detailLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#B4925A]"></div>
            </div>
          ) : selectedBooking ? (
            <div className="space-y-6">
              {/* Thông tin cơ bản */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm">Mã đặt lịch</p>
                    <p className="font-medium text-gray-800">
                      #{selectedBooking.bookingOnlineId?.substring(0, 8)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Ngày đặt</p>
                    <p className="font-medium text-gray-800">
                      {selectedBooking.bookingDate}
                    </p>
                  </div>
                </div>
              </div>

              {/* Thông tin khách hàng */}
              <div>
                <h3 className="text-md font-medium text-gray-700 mb-3 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-[#B4925A]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Thông tin khách hàng
                </h3>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500 text-sm">Họ tên</p>
                      <p className="font-medium text-gray-800">
                        {selectedBooking.customerName}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Email</p>
                      <p className="font-medium text-gray-800">
                        {selectedBooking.customerEmail}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thông tin buổi tư vấn */}
              <div>
                <h3 className="text-md font-medium text-gray-700 mb-3 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-[#B4925A]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Chi tiết buổi tư vấn
                </h3>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-500 text-sm">Thời gian</p>
                      <p className="font-medium text-gray-800">
                        {selectedBooking.startTime} - {selectedBooking.endTime}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Giá</p>
                      <p className="font-medium text-gray-800">
                        {selectedBooking.price?.toLocaleString("vi-VN")} VNĐ
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-500 text-sm">Mô tả</p>
                    <p className="font-medium text-gray-800">
                      {selectedBooking.description}
                    </p>
                  </div>

                  {selectedBooking.linkMeet && (
                    <div className="mb-4">
                      <p className="text-gray-500 text-sm">Link Meet</p>
                      <a
                        href={selectedBooking.linkMeet}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {selectedBooking.linkMeet}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Ghi chú sau tư vấn */}
              <div>
                <h3 className="text-md font-medium text-gray-700 mb-3 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-[#B4925A]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Ghi chú sau tư vấn
                </h3>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <TextArea
                    value={masterNote}
                    onChange={(e) => setMasterNote(e.target.value)}
                    placeholder="Nhập ghi chú sau buổi tư vấn..."
                    autoSize={{ minRows: 3, maxRows: 6 }}
                    className="w-full mb-4"
                    disabled={selectedBooking.status === "Completed"}
                  />

                  <div className="flex justify-end mt-2">
                    <button
                      onClick={handleSaveNote}
                      disabled={
                        savingNote || selectedBooking.status === "Completed"
                      }
                      className={`px-5 py-2 rounded-lg transition-all ${
                        savingNote || selectedBooking.status === "Completed"
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {savingNote ? "Đang lưu..." : "Lưu ghi chú"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Không có thông tin chi tiết</p>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default ConsultingOnline;
