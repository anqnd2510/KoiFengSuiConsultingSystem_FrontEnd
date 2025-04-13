import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Common/Pagination";
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
import Sidebar from "../../components/Layout/Sidebar";
import CustomDatePicker from "../../components/Common/CustomDatePicker";
import Header from "../../components/Common/Header";
import Error from "../../components/Common/Error";
import CustomButton from "../../components/Common/CustomButton";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { Modal, Select, Tag } from "antd";
import CustomTable from "../../components/Common/CustomTable";
import {
  getOfflineConsultingBookings,
  getBookingOfflineDetail,
} from "../../services/booking.service";
import { message } from "antd";
import { createDocument } from "../../services/document.service";
import { createAttachment } from "../../services/attachment.service";

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
  const [documentName, setDocumentName] = useState("");
  const [documentDescription, setDocumentDescription] = useState("");
  const [documentTags, setDocumentTags] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportData, setReportData] = useState({
    title: "",
    content: "",
    conclusion: "",
  });
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedBookingDetail, setSelectedBookingDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetchOfflineConsultingBookings();
  }, [currentPage, selectedDate]);

  const fetchOfflineConsultingBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getOfflineConsultingBookings();

      // Nếu response có data và là mảng
      if (response && response.data && Array.isArray(response.data)) {
        const formattedData = response.data.map((booking, index) => ({
          id: booking.bookingOfflineId || index,
          customerName: booking.customerName || "Không có tên",
          customerEmail: booking.customerEmail || "Không có email",
          service: booking.type || "Tư vấn trực tiếp",
          date:
            booking.bookingDate ||
            dayjs(booking.createdAt).format("DD-MM-YYYY"),
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
      } else {
        // Nếu không có dữ liệu, đặt mảng rỗng mà không hiển thị lỗi
        setBookings([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu tư vấn trực tiếp:", err);
      // Chỉ hiển thị lỗi khi có vấn đề thực sự với API (không phải do không có dữ liệu)
      if (err.response && err.response.status !== 404) {
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
        message.error("Không thể tải dữ liệu tư vấn trực tiếp");
      } else {
        // Nếu là lỗi 404 (không tìm thấy dữ liệu), đặt mảng rỗng
        setBookings([]);
      }
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);

      const fileUrl = URL.createObjectURL(file);
      setPdfPreviewUrl(fileUrl);
    } else {
      message.error("Chỉ chấp nhận file PDF");
      setSelectedFile(null);
      setPdfPreviewUrl(null);
    }
  };

  const handleSaveChanges = async () => {
    try {
      if (!selectedFile) {
        message.error("Vui lòng tải lên file tài liệu PDF");
        return;
      }

      if (!selectedItem || !selectedItem.id) {
        message.error("Không tìm thấy mã đặt lịch");
        return;
      }

      if (selectedFile.size > 10 * 1024 * 1024) {
        // 10MB
        message.error("File quá lớn. Vui lòng chọn file nhỏ hơn 10MB");
        return;
      }

      message.loading({ content: "Đang tạo hồ sơ...", key: "createDoc" });

      const formData = new FormData();
      formData.append("BookingOfflineId", selectedItem.id);
      formData.append("PdfFile", selectedFile);
      formData.append(
        "DocumentName",
        documentName || `Tài liệu tư vấn - ${selectedItem.customerName}`
      );

      const response = await createDocument(formData);

      message.success({
        content: "Tạo hồ sơ tư vấn thành công",
        key: "createDoc",
      });
      handleCloseModal();
      fetchOfflineConsultingBookings();
    } catch (err) {
      console.error("Lỗi khi lưu thông tin:", err);

      if (err.response && err.response.status === 500) {
        message.error({
          content:
            "Lỗi máy chủ khi tạo hồ sơ. Vui lòng thử lại sau hoặc liên hệ quản trị viên.",
          key: "createDoc",
        });
      } else if (err.code === "ECONNABORTED") {
        message.error({
          content:
            "Quá thời gian xử lý. File có thể quá lớn hoặc kết nối không ổn định.",
          key: "createDoc",
        });
      } else {
        message.error({
          content: "Không thể lưu thông tin. Vui lòng thử lại.",
          key: "createDoc",
        });
      }
    }
  };

  const formatDate = (date) => {
    return date.locale("vi").format("dddd, DD [tháng] MM, YYYY");
  };

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
    if (item) {
      setDocumentName(
        `Tài liệu tư vấn - ${
          item.customerName || "Khách hàng"
        } - ${dayjs().format("DD/MM/YYYY")}`
      );
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setSelectedFile(null);

    if (pdfPreviewUrl) {
      URL.revokeObjectURL(pdfPreviewUrl);
      setPdfPreviewUrl(null);
    }
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
      dataIndex: "id",
      key: "id",
      render: (text) => (
        <span
          className="font-semibold text-[#B4925A] cursor-pointer hover:underline"
          onClick={(e) => {
            e.stopPropagation();
            const record = bookings.find((booking) => booking.id === text);
            handleViewDetail(record);
          }}
        >
          #{text ? text.toString().padStart(4, "0") : "0000"}
        </span>
      ),
      width: "12%",
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      width: "15%",
      render: (text) => (
        <span className="font-medium text-gray-800">{text}</span>
      ),
    },
    {
      title: "Email",
      dataIndex: "customerEmail",
      key: "customerEmail",
      width: "20%",
      render: (text) => <span className="text-gray-600 italic">{text}</span>,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: "25%",
      ellipsis: true,
      render: (text) => (
        <div className="max-w-md truncate text-gray-700">
          {text || "Không có mô tả"}
        </div>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "date",
      key: "date",
      width: "12%",
      render: (text) => <span className="text-gray-600 text-sm">{text}</span>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "12%",
      render: (status) => (
        <Tag
          color={getStatusColor(status)}
          className="px-3 py-1 text-xs font-medium rounded-full"
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Tạo mới",
      key: "action",
      width: "12%",
      render: (_, record) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleOpenModal(record)}
            className="px-3 py-1.5 bg-[#B4925A] text-white text-xs rounded-lg hover:bg-[#8B6B3D] transition-all duration-200 shadow-sm cursor-pointer flex items-center justify-center"
          >
            <span className="hidden sm:inline">Hồ sơ</span>
            <span className="sm:hidden">Hồ sơ</span>
          </button>
          <button
            onClick={() => handleCreateReport(record)}
            className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-all duration-200 shadow-sm cursor-pointer flex items-center justify-center"
          >
            <span className="hidden sm:inline">Biên bản</span>
            <span className="sm:hidden">BB</span>
          </button>
        </div>
      ),
    },
  ];

  const handleCreateReport = (item) => {
    setSelectedItem(item);
    setIsReportModalOpen(true);
    setReportData({
      title: `Biên bản nghiệm thu tư vấn - ${
        item.customerName || "Khách hàng"
      } - ${dayjs().format("DD/MM/YYYY")}`,
      content: "",
      conclusion: "",
    });
  };

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
    setSelectedItem(null);
    setReportData({
      title: "",
      content: "",
      conclusion: "",
    });
  };

  const handleSaveReport = async () => {
    try {
      if (!selectedFile) {
        message.error("Vui lòng tải lên file biên bản nghiệm thu");
        return;
      }

      if (!selectedItem || !selectedItem.id) {
        message.error("Không tìm thấy mã đặt lịch");
        return;
      }

      if (selectedFile.size > 10 * 1024 * 1024) {
        // 10MB
        message.error("File quá lớn. Vui lòng chọn file nhỏ hơn 10MB");
        return;
      }

      message.loading({ content: "Đang tạo biên bản...", key: "createReport" });

      const formData = new FormData();
      formData.append("BookingOfflineId", selectedItem.id);
      formData.append("PdfFile", selectedFile);
      formData.append(
        "AttachmentName",
        `Biên bản nghiệm thu tư vấn - ${
          selectedItem.customerName
        } - ${dayjs().format("DD/MM/YYYY")}`
      );

      const response = await createAttachment(formData);

      message.success({
        content: "Tạo biên bản nghiệm thu thành công",
        key: "createReport",
      });
      handleCloseReportModal();
      fetchOfflineConsultingBookings();
    } catch (err) {
      console.error("Lỗi khi tạo biên bản:", err);

      if (err.response && err.response.status === 500) {
        message.error({
          content:
            "Lỗi máy chủ khi tạo biên bản. Vui lòng thử lại sau hoặc liên hệ quản trị viên.",
          key: "createReport",
        });
      } else if (err.code === "ECONNABORTED") {
        message.error({
          content:
            "Quá thời gian xử lý. File có thể quá lớn hoặc kết nối không ổn định.",
          key: "createReport",
        });
      } else {
        message.error({
          content: "Không thể tạo biên bản. Vui lòng thử lại.",
          key: "createReport",
        });
      }
    }
  };

  const handleViewDetail = async (record) => {
    setDetailLoading(true);
    try {
      const response = await getBookingOfflineDetail(record.id);
      setSelectedBookingDetail(response.data || record);
      setDetailModalVisible(true);
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết booking:", err);
      // Nếu không lấy được chi tiết, hiển thị thông tin cơ bản từ record
      setSelectedBookingDetail(record);
      setDetailModalVisible(true);
      message.error("Không thể lấy thông tin chi tiết. Vui lòng thử lại sau.");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseDetailModal = () => {
    setDetailModalVisible(false);
    setSelectedBookingDetail(null);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 bg-gray-50 min-h-screen">
        <Header
          title="Tư vấn trực tiếp"
          description="Quản lý và theo dõi các buổi tư vấn trực tiếp"
        />

        <div className="p-6 md:p-8">
          <div className="bg-white rounded-xl shadow-sm mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:p-6 border-b border-gray-100">
              <div className="border-b border-gray-200 mb-4 md:mb-0">
                <div className="flex gap-1">
                  <div
                    className={`px-4 md:px-8 py-3 font-medium text-base relative transition-all duration-200 text-[#B4925A] border-[#B4925A] cursor-pointer`}
                    onClick={() => navigate("/master/consulting-offline")}
                  >
                    <span>Yêu cầu tư vấn</span>
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#B4925A]" />
                  </div>
                  <button
                    onClick={() => navigate("/master/document")}
                    className="px-4 md:px-8 py-3 font-medium text-base text-gray-500 hover:text-gray-800 cursor-pointer"
                  >
                    Hồ sơ
                  </button>
                  <button
                    onClick={() => navigate("/master/attachments")}
                    className="px-4 md:px-8 py-3 font-medium text-base text-gray-500 hover:text-gray-800 cursor-pointer"
                  >
                    Biên bản nghiệm thu
                  </button>
                </div>
              </div>

              <CustomDatePicker
                value={selectedDate}
                onChange={(date) => setSelectedDate(date)}
              />
            </div>

            <div className="p-4 md:p-6">
              {/* Chỉ hiển thị thông báo lỗi khi có lỗi nghiêm trọng */}
              {error && <Error message={error} />}

              <div className="overflow-x-auto rounded-lg border border-gray-100">
                <CustomTable
                  columns={columns}
                  dataSource={bookings}
                  loading={loading}
                  className="custom-table"
                  rowClassName={() =>
                    "hover:bg-gray-50 cursor-pointer transition-colors"
                  }
                  onRow={(record) => ({
                    onClick: () => handleViewDetail(record),
                  })}
                  locale={{
                    emptyText: (
                      <div className="py-5 flex flex-col items-center">
                        <img
                          src="/assets/images/no-data.png"
                          alt="No data"
                          className="w-16 h-16 mb-2 opacity-40"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTMyIDJDMTUuNDMxIDIgMiAxNS40MzEgMiAzMmMwIDE2LjU2OSAxMy40MzEgMzAgMzAgMzAgMTYuNTY5IDAgMzAtMTMuNDMxIDMwLTMwQzYyIDE1LjQzMSA0OC41NjkgMiAzMiAyem0wIDQwYy0xLjEwNCAwLTIgLjg5NS0yIDJzLjg5NiAyIDIgMiAyLS44OTUgMi0yLS44OTYtMi0yLTJ6bTItMzBjMC0xLjEwNC0uODk2LTItMi0ycy0yIC44OTYtMiAydjIwYzAgMS4xMDUuODk2IDIgMiAyczItLjg5NSAyLTJWMTJ6IiBmaWxsPSIjRDhEOEQ4Ii8+PC9zdmc+";
                          }}
                        />
                        <span className="text-gray-500">Không có dữ liệu</span>
                      </div>
                    ),
                  }}
                />
              </div>

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
          </div>
        </div>

        <Modal
          title={
            <div className="text-xl font-medium text-gray-800">
              Tạo hồ sơ phong thủy mới
            </div>
          }
          open={isModalOpen}
          onCancel={handleCloseModal}
          footer={null}
          width={800}
          centered
          closeIcon={<span className="text-gray-500 text-xl">&times;</span>}
        >
          {selectedItem && (
            <div className="py-4">
              <div className="text-gray-500 mb-2">
                Khách hàng: {selectedItem.customerName} -{" "}
                {selectedItem.customerEmail}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <div className="flex items-start">
                  <div className="mr-2">
                    <FaBook className="text-blue-600 mt-1" />
                  </div>
                  <div>
                    <h3 className="text-blue-700 font-medium">
                      Thông tin buổi tư vấn
                    </h3>
                    <div className="mt-2 text-gray-700">
                      <p>Khách hàng: {selectedItem.customerName}</p>
                      <p>Ngày tư vấn: {selectedItem.date || "Invalid date"}</p>
                      <p>
                        Mã đặt lịch:{" "}
                        {selectedItem.id
                          ? `#${selectedItem.id.toString().padStart(4, "0")}`
                          : "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg mb-6">
                <div className="flex items-start">
                  <div className="mr-2 text-yellow-600">
                    <FaBell />
                  </div>
                  <div className="text-yellow-800">
                    <p className="font-medium">Lưu ý quan trọng</p>
                    <p className="mt-1">
                      Vui lòng tải lên file tài liệu tư vấn cho khách hàng. Chỉ
                      chấp nhận file PDF.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2 flex items-center">
                  <span className="text-red-500 mr-1">*</span> Tải lên file tài
                  liệu (PDF)
                </label>
                <div className="mt-1">
                  <label className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                    <input
                      type="file"
                      className="sr-only"
                      accept=".pdf"
                      onChange={handleFileChange}
                    />
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Chọn file PDF
                  </label>
                </div>
                {selectedFile && (
                  <p className="mt-2 text-sm text-gray-600">
                    File đã chọn: {selectedFile.name}
                  </p>
                )}

                {pdfPreviewUrl && (
                  <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-100 p-2 border-b border-gray-200 flex justify-between items-center">
                      <span className="font-medium text-gray-700">
                        Preview tài liệu
                      </span>
                      <a
                        href={pdfPreviewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Mở trong tab mới
                      </a>
                    </div>
                    <div className="h-[400px] overflow-hidden">
                      <iframe
                        src={pdfPreviewUrl}
                        title="PDF Preview"
                        className="w-full h-full"
                        frameBorder="0"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-all duration-200 shadow-sm"
                >
                  Tạo hồ sơ
                </button>
              </div>
            </div>
          )}
        </Modal>

        <Modal
          title={
            <div className="text-xl font-medium text-gray-800">
              Tạo biên bản nghiệm thu tư vấn
            </div>
          }
          open={isReportModalOpen}
          onCancel={handleCloseReportModal}
          footer={null}
          width={800}
          centered
          closeIcon={<span className="text-gray-500 text-xl">&times;</span>}
        >
          {selectedItem && (
            <div className="py-4">
              <div className="text-gray-500 mb-4">
                Khách hàng: {selectedItem.customerName} -{" "}
                {selectedItem.customerEmail}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <div className="flex items-start">
                  <div className="mr-2 text-blue-600">
                    <FaBook />
                  </div>
                  <div>
                    <h3 className="text-blue-700 font-medium">
                      Thông tin buổi tư vấn
                    </h3>
                    <div className="mt-2 text-gray-700">
                      <p>Khách hàng: {selectedItem.customerName}</p>
                      <p>Ngày tư vấn: {selectedItem.date || "Chưa xác định"}</p>
                      <p>
                        Mã đặt lịch: #
                        {selectedItem.id
                          ? selectedItem.id.toString().padStart(4, "0")
                          : "0000"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg mb-6">
                <div className="flex items-start">
                  <div className="mr-2 text-yellow-600">
                    <FaBell />
                  </div>
                  <div>
                    <p className="text-yellow-800 font-medium">
                      Lưu ý quan trọng
                    </p>
                    <p className="mt-1 text-yellow-800">
                      Vui lòng tải lên file biên bản nghiệm thu tư vấn cho khách
                      hàng. Chỉ chấp nhận file PDF.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-gray-700 mb-2">
                  <span className="text-red-500 mr-1">*</span> Tải lên file biên
                  bản (PDF)
                </label>
                <div className="mt-1">
                  <label className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                    <input
                      type="file"
                      className="sr-only"
                      accept=".pdf"
                      onChange={handleFileChange}
                    />
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Chọn file PDF
                  </label>
                </div>
                {selectedFile && (
                  <p className="mt-2 text-sm text-gray-600">
                    File đã chọn: {selectedFile.name}
                  </p>
                )}

                {pdfPreviewUrl && (
                  <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-100 p-2 border-b border-gray-200 flex justify-between items-center">
                      <span className="font-medium text-gray-700">
                        Preview tài liệu
                      </span>
                      <a
                        href={pdfPreviewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Mở trong tab mới
                      </a>
                    </div>
                    <div className="h-[400px] overflow-hidden">
                      <iframe
                        src={pdfPreviewUrl}
                        title="PDF Preview"
                        className="w-full h-full"
                        frameBorder="0"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={handleCloseReportModal}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleSaveReport}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-all duration-200 shadow-sm"
                >
                  Tạo biên bản
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Modal chi tiết booking */}
        <Modal
          title={
            <div className="text-xl font-medium text-gray-800">
              Chi tiết đặt lịch tư vấn trực tiếp
            </div>
          }
          open={detailModalVisible}
          onCancel={handleCloseDetailModal}
          footer={[
            <button
              key="close"
              onClick={handleCloseDetailModal}
              className="px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Đóng
            </button>,
          ]}
          width={700}
          centered
          closeIcon={<span className="text-gray-500 text-xl">&times;</span>}
        >
          {detailLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#B4925A]"></div>
            </div>
          ) : selectedBookingDetail ? (
            <div className="space-y-6">
              {/* Thông tin cơ bản */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm">Mã đặt lịch</p>
                    <p className="font-medium text-gray-800">
                      #
                      {selectedBookingDetail.bookingOfflineId
                        ?.toString()
                        .padStart(4, "0") ||
                        selectedBookingDetail.id?.toString().padStart(4, "0") ||
                        "0000"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Trạng thái</p>
                    <Tag color={getStatusColor(selectedBookingDetail.status)}>
                      {selectedBookingDetail.status}
                    </Tag>
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
                        {selectedBookingDetail.customerName ||
                          "Không có thông tin"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Email</p>
                      <p className="font-medium text-gray-800">
                        {selectedBookingDetail.customerEmail ||
                          "Không có thông tin"}
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
                      <p className="text-gray-500 text-sm">Ngày đặt lịch</p>
                      <p className="font-medium text-gray-800">
                        {selectedBookingDetail.bookingDate ||
                          selectedBookingDetail.date ||
                          "Chưa có thông tin"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Giá dịch vụ</p>
                      <p className="font-medium text-gray-800">
                        {selectedBookingDetail.selectedPrice?.toLocaleString(
                          "vi-VN"
                        ) || "0"}{" "}
                        VNĐ
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-500 text-sm">Địa điểm</p>
                    <p className="font-medium text-gray-800">
                      {selectedBookingDetail.location || "Không có thông tin"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-sm">Mô tả</p>
                    <div className="font-medium text-gray-800 bg-gray-50 p-3 rounded-md">
                      {selectedBookingDetail.description || "Không có mô tả"}
                    </div>
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

const styles = `
  .custom-table .ant-table {
    border-radius: 8px;
    overflow: hidden;
  }
  
  .custom-table .ant-table-thead > tr > th {
    background-color: #f9fafb;
    color: #4b5563;
    font-weight: 600;
    padding: 12px 16px;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .custom-table .ant-table-tbody > tr > td {
    padding: 12px 16px;
    border-bottom: 1px solid #f3f4f6;
  }
  
  .custom-table .ant-table-tbody > tr:last-child > td {
    border-bottom: none;
  }
  
  .custom-table .ant-table-tbody > tr:hover > td {
    background-color: #f9fafb;
  }
  
  .custom-table .ant-empty-description {
    color: #6b7280;
  }
  
  .custom-table .ant-pagination {
    margin: 16px 0;
  }
  
  .custom-table .ant-tag {
    border: none;
    padding: 4px 8px;
  }
  
  @media (max-width: 640px) {
    .custom-table .ant-table-thead > tr > th,
    .custom-table .ant-table-tbody > tr > td {
      padding: 8px 12px;
      white-space: nowrap;
    }
  }
`;

if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default ConsultingOffline;
