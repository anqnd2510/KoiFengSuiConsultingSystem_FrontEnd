import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Spin,
  message,
  Upload,
  Button,
  InputNumber,
  Tag,
  Tooltip,
  Card,
  Row,
  Col,
  Divider,
  Tabs,
  Badge,
  Space,
  Progress,
  Avatar,
  Alert,
} from "antd";
import {
  UploadOutlined,
  EyeOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  SafetyCertificateOutlined,
  StopOutlined,
  CreditCardOutlined,
  FileAddOutlined,
  ReloadOutlined,
  UserDeleteOutlined,
  InfoCircleOutlined,
  BellOutlined,
  DollarOutlined,
  FileDoneOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { FaEye, FaDownload } from "react-icons/fa";
import Header from "../../components/Common/Header";
import SearchBar from "../../components/Common/SearchBar";
import Pagination from "../../components/Common/Pagination";
import CustomButton from "../../components/Common/CustomButton";
import { getAllBookingOffline } from "../../services/booking.service";
import {
  createContract,
  getAllContractsByStaff,
} from "../../services/contract.service";
import { useNavigate } from "react-router-dom";

const stringToColor = (string) => {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
};

const { TextArea } = Input;
const { RangePicker } = DatePicker;

const ConsultingContract = () => {
  const [contracts, setContracts] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("bookings");
  const [stats, setStats] = useState({
    pendingBookings: 0,
    completedBookings: 0,
    activeContracts: 0,
    rejectedContracts: 0,
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [contractSearchTerm, setContractSearchTerm] = useState("");
  const navigate = useNavigate();

  // Fetch danh sách booking offline
  const fetchBookings = useCallback(async () => {
    try {
      setBookingsLoading(true);
      const response = await getAllBookingOffline();

      if (response?.data && Array.isArray(response.data)) {
        // Xử lý dữ liệu booking
        const offlineBookings = response.data.map((booking) => ({
          id: booking.bookingOfflineId,
          status: booking.status || "Pending", // Mặc định là Pending nếu không có
          bookingStatus: booking.bookingStatus || booking.status || "Pending", // Sử dụng bookingStatus hoặc fallback về status
          customerName: booking.customerName || "Không có tên",
          customerEmail: booking.customerEmail || "Không có email",
          location: booking.location || "Không có địa điểm",
          description: booking.description || "Không có mô tả",
          bookingDate: booking.bookingDate,
          createDate: booking.createDate, // Thêm trường createDate
          hasContract: booking.hasContract || false,
          contractId: booking.contractId || null,
          contractStatus: booking.contractStatus || null,
        }));

        console.log("Processed bookings:", offlineBookings);
        setBookings(offlineBookings);
        setTotalPages(Math.ceil(offlineBookings.length / 10));
        setError(null);

        // Tính toán số liệu thống kê
        const pendingCount = offlineBookings.filter(
          (b) => b.bookingStatus === "Pending" || !b.hasContract
        ).length;

        const rejectedCount = offlineBookings.filter(
          (b) =>
            b.bookingStatus === "ContractRejectedByManager" ||
            b.bookingStatus === "ContractRejectedByCustomer"
        ).length;

        const completedCount = offlineBookings.filter(
          (b) => b.bookingStatus === "Completed"
        ).length;

        const activeCount = offlineBookings.filter(
          (b) =>
            b.bookingStatus === "ContractConfirmedByManager" ||
            b.bookingStatus === "ContractConfirmedByCustomer" ||
            b.bookingStatus === "VerifyingOTP" ||
            b.bookingStatus === "VerifiedOTP"
        ).length;

        setStats((prev) => ({
          ...prev,
          pendingBookings: pendingCount,
          completedBookings: completedCount,
          rejectedContracts: rejectedCount,
          activeContracts: activeCount,
        }));
      } else {
        console.error("Invalid booking data format:", response);
        setBookings([]);
        setTotalPages(1);
        setError("Không có dữ liệu lịch tư vấn");
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setBookings([]);
      setTotalPages(1);
      setError(
        err.message === "Network Error"
          ? "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng và thử lại."
          : "Có lỗi xảy ra khi tải dữ liệu lịch tư vấn. Vui lòng thử lại sau."
      );
    } finally {
      setBookingsLoading(false);
    }
  }, []);

  // Fetch danh sách hợp đồng
  const fetchContracts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllContractsByStaff();

      if (response?.data && Array.isArray(response.data)) {
        // Xử lý dữ liệu từ API mới
        const formattedContracts = response.data.map((contract) => ({
          id: contract.contractId,
          contractNumber: contract.docNo,
          customerName: contract.bookingOffline?.customerName || "Không có tên",
          contractName: contract.contractName,
          status: contract.status || "Pending", // Mặc định là Pending nếu không có
          contractURL: contract.contractUrl,
          createdDate: contract.createdDate,
          // Thêm các trường cần thiết khác với giá trị mặc định
          startDate: contract.createdDate,
          endDate: null,
          totalAmount: 0,
        }));

        setContracts(formattedContracts);
        setError(null);

        // Cập nhật số liệu thống kê
        const activeCount = formattedContracts.filter(
          (c) =>
            c.status === "ContractConfirmedByManager" ||
            c.status === "ContractConfirmedByCustomer" ||
            c.status === "VerifyingOTP" ||
            c.status === "VerifiedOTP"
        ).length;

        setStats((prev) => ({
          ...prev,
          activeContracts: activeCount,
        }));
      } else {
        setContracts([]);
        setError(null);
      }
    } catch (err) {
      console.error("Error fetching contracts:", err);
      setContracts([]);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
    fetchContracts();
  }, [fetchBookings, fetchContracts]);

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  const handleStatusFilter = (status) => {
    setFilterStatus(status);
  };

  // Lọc bookings dựa trên tìm kiếm và trạng thái
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.location.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === "all") return matchesSearch;
    if (filterStatus === "pending")
      return (
        matchesSearch && booking.status === "Scheduled" && !booking.hasContract
      );
    if (filterStatus === "completed")
      return matchesSearch && booking.status === "Completed";
    if (filterStatus === "hasContract")
      return matchesSearch && booking.hasContract;

    return matchesSearch && booking.status === filterStatus;
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleOpenModal = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
    form.setFieldsValue({
      bookingId: booking.id,
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
    setPreviewUrl(null);
    form.resetFields();
  };

  const handleCreateContract = async (values) => {
    try {
      setLoading(true);

      // Kiểm tra xem có file PDF được chọn không
      if (
        !values.pdfFile ||
        !values.pdfFile.fileList ||
        values.pdfFile.fileList.length === 0
      ) {
        message.error("Vui lòng tải lên file hợp đồng PDF");
        setLoading(false);
        return;
      }

      // Tạo FormData để gửi dữ liệu
      const formData = new FormData();
      formData.append("BookingOfflineId", values.bookingId);
      formData.append("PdfFile", values.pdfFile.fileList[0].originFileObj);

      // Gọi API tạo hợp đồng
      const response = await createContract(formData);

      // Kiểm tra response từ API
      if (response && (response.status === 200 || response.status === 201)) {
        message.success("Tạo hợp đồng thành công");
        handleCloseModal();
        // Cập nhật lại danh sách booking và hợp đồng
        fetchBookings();
        fetchContracts();
      } else {
        message.error(response?.data?.message || "Tạo hợp đồng thất bại");
      }
    } catch (err) {
      console.error("Error creating contract:", err);
      message.error(
        "Có lỗi xảy ra khi tạo hợp đồng: " +
          (err.message || "Lỗi không xác định")
      );
    } finally {
      setLoading(false);
    }
  };

  // Thêm hàm xử lý khi file thay đổi
  const handleFileChange = (info) => {
    const file = info.fileList[0]?.originFileObj;
    if (file) {
      // Tạo URL để xem trước file
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleContractSearch = (term) => {
    setContractSearchTerm(term);
  };

  const filteredContracts = contracts.filter((contract) => {
    return (
      contract.contractNumber
        ?.toLowerCase()
        .includes(contractSearchTerm.toLowerCase()) ||
      contract.contractName
        ?.toLowerCase()
        .includes(contractSearchTerm.toLowerCase()) ||
      contract.customerName
        ?.toLowerCase()
        .includes(contractSearchTerm.toLowerCase())
    );
  });

  const handleViewContract = (url) => {
    if (url) {
      window.open(url, "_blank");
    } else {
      message.error("Không tìm thấy đường dẫn hợp đồng");
    }
  };

  const handleDownloadContract = async (url, name) => {
    if (!url) {
      message.error("Không tìm thấy đường dẫn hợp đồng");
      return;
    }

    try {
      message.loading({ content: "Đang tải hợp đồng...", key: "download" });

      // Fetch dữ liệu từ URL
      const response = await fetch(url);

      // Kiểm tra nếu response không thành công
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Chuyển đổi response thành Blob
      const blob = await response.blob();

      // Tạo URL tạm thời từ Blob
      const blobUrl = window.URL.createObjectURL(blob);

      // Tạo thẻ a để tải xuống
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = name || "contract.pdf";

      // Thêm link vào DOM, click để tải xuống, và xóa
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Giải phóng URL tạm thời
      window.URL.revokeObjectURL(blobUrl);

      // Hiển thị thông báo thành công
      message.success({ content: "Tải xuống thành công", key: "download" });
    } catch (error) {
      console.error("Lỗi khi tải xuống hợp đồng:", error);
      message.error({
        content: "Không thể tải xuống hợp đồng. Vui lòng thử lại sau.",
        key: "download",
      });
    }
  };

  // Helper function để kiểm tra xem có thể tạo hợp đồng hay không
  const canCreateContract = (record) => {
    // Nếu booking chưa có hợp đồng
    if (!record.hasContract) {
      return record.status === "Scheduled";
    }

    // Nếu booking đã có hợp đồng, chỉ cho phép tạo lại trong trường hợp bị từ chối
    if (
      record.contractStatus === "ContractRejectedByManager" ||
      record.contractStatus === "ContractRejectedByCustomer"
    ) {
      return true;
    }

    return false;
  };

  // Render function cho trạng thái booking
  const renderBookingStatus = (status) => {
    let color = "gray";
    let text = status || "Chưa xác định";
    let bgColor = "bg-gray-100";
    let icon = <InfoCircleOutlined />;

    switch (status) {
      case "Pending":
        color = "#faad14";
        text = "Chờ xử lý";
        bgColor = "bg-yellow-50";
        icon = <ClockCircleOutlined className="mr-1" />;
        break;
      case "InProgress":
        color = "#1890ff";
        text = "Đang xử lý";
        bgColor = "bg-blue-50";
        icon = <SyncOutlined spin className="mr-1" />;
        break;
      case "ContractRejectedByManager":
        color = "#f5222d";
        text = "Quản lý từ chối hợp đồng";
        bgColor = "bg-red-50";
        icon = <CloseCircleOutlined className="mr-1" />;
        break;
      case "ContractRejectedByCustomer":
        color = "#f5222d";
        text = "Khách hàng từ chối hợp đồng";
        bgColor = "bg-red-50";
        icon = <UserDeleteOutlined className="mr-1" />;
        break;
      case "ContractConfirmedByManager":
        color = "#52c41a";
        text = "Quản lý đã duyệt hợp đồng";
        bgColor = "bg-green-50";
        icon = <CheckCircleOutlined className="mr-1" />;
        break;
      case "ContractConfirmedByCustomer":
        color = "#52c41a";
        text = "Khách hàng đã duyệt hợp đồng";
        bgColor = "bg-green-50";
        icon = <CheckCircleOutlined className="mr-1" />;
        break;
      case "VerifyingOTP":
        color = "#722ed1";
        text = "Đang xác thực OTP hợp đồng";
        bgColor = "bg-purple-50";
        icon = <SafetyCertificateOutlined className="mr-1" />;
        break;
      case "VerifiedOTP":
        color = "#13c2c2";
        text = "Đã xác thực OTP hợp đồng";
        bgColor = "bg-cyan-50";
        icon = <CheckCircleOutlined className="mr-1" />;
        break;
      case "FirstPaymentPending":
        color = "#fa8c16";
        text = "Chờ thanh toán lần 1";
        bgColor = "bg-orange-50";
        icon = <CreditCardOutlined className="mr-1" />;
        break;
      case "FirstPaymentPendingConfirm":
        color = "#fa8c16";
        text = "Chờ xác nhận thanh toán lần 1";
        bgColor = "bg-orange-50";
        icon = <CreditCardOutlined className="mr-1" />;
        break;
      case "FirstPaymentSuccess":
        color = "#52c41a";
        text = "Đã thanh toán lần 1";
        bgColor = "bg-green-50";
        icon = <CheckCircleOutlined className="mr-1" />;
        break;
      case "DocumentRejectedByManager":
        color = "#f5222d";
        text = "Quản lý từ chối hồ sơ";
        bgColor = "bg-red-50";
        icon = <CloseCircleOutlined className="mr-1" />;
        break;
      case "DocumentConfirmedByManager":
        color = "#52c41a";
        text = "Quản lý đã duyệt hồ sơ";
        bgColor = "bg-green-50";
        icon = <CheckCircleOutlined className="mr-1" />;
        break;
      case "DocumentRejectedByCustomer":
        color = "#f5222d";
        text = "Khách hàng từ chối hồ sơ";
        bgColor = "bg-red-50";
        icon = <UserDeleteOutlined className="mr-1" />;
        break;
      case "DocumentConfirmedByCustomer":
        color = "#52c41a";
        text = "Khách hàng đã duyệt hồ sơ";
        bgColor = "bg-green-50";
        icon = <CheckCircleOutlined className="mr-1" />;
        break;
      case "AttachmentRejected":
        color = "#f5222d";
        text = "Biên bản kèm bị từ chối";
        bgColor = "bg-red-50";
        icon = <CloseCircleOutlined className="mr-1" />;
        break;
      case "AttachmentConfirmed":
        color = "#52c41a";
        text = "Biên bản kèm được xác nhận";
        bgColor = "bg-green-50";
        icon = <CheckCircleOutlined className="mr-1" />;
        break;
      case "VerifyingOTPAttachment":
        color = "#722ed1";
        text = "Đang xác thực OTP biên bản kèm";
        bgColor = "bg-purple-50";
        icon = <SafetyCertificateOutlined className="mr-1" />;
        break;
      case "VerifiedOTPAttachment":
        color = "#13c2c2";
        text = "Đã xác thực OTP biên bản kèm";
        bgColor = "bg-cyan-50";
        icon = <CheckCircleOutlined className="mr-1" />;
        break;
      case "SecondPaymentPending":
        color = "#fa8c16";
        text = "Chờ thanh toán lần 2";
        bgColor = "bg-orange-50";
        icon = <CreditCardOutlined className="mr-1" />;
        break;
      case "SecondPaymentPendingConfirm":
        color = "#fa8c16";
        text = "Chờ xác nhận thanh toán lần 2";
        bgColor = "bg-orange-50";
        icon = <CreditCardOutlined className="mr-1" />;
        break;
      case "Completed":
        color = "#52c41a";
        text = "Đã hoàn thành";
        bgColor = "bg-green-50";
        icon = <CheckCircleOutlined className="mr-1" />;
        break;
      case "Canceled":
        color = "#f5222d";
        text = "Đã hủy";
        bgColor = "bg-red-50";
        icon = <CloseCircleOutlined className="mr-1" />;
        break;
      default:
        break;
    }

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor} flex items-center`}
        style={{ color, display: "inline-flex", width: "fit-content" }}
      >
        {icon}
        {text}
      </span>
    );
  };

  // Columns cho bảng booking
  const bookingColumns = [
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <Avatar
            style={{
              backgroundColor: stringToColor(text),
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
            size="default"
            icon={<UserOutlined />}
          />
          <div className="flex flex-col">
            <span className="text-gray-800 font-medium">{text}</span>
            <span className="text-gray-500 text-xs">
              {record.customerEmail}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Địa điểm",
      dataIndex: "location",
      key: "location",
      width: "15%",
      render: (text) => (
        <div className="flex items-center">
          <EnvironmentOutlined className="text-blue-400 mr-1" />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Ngày đặt lịch",
      dataIndex: "bookingDate",
      key: "bookingDate",
      width: "15%",
      render: (date) => (
        <div className="flex flex-col">
          <span className="font-medium">
            {moment(date).format("DD/MM/YYYY")}
          </span>
          <span className="text-xs text-gray-500">
            {moment(date).format("HH:mm")}
          </span>
        </div>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createDate",
      key: "createDate",
      width: "15%",
      render: (date) =>
        date ? (
          <div className="flex flex-col">
            <span className="font-medium">
              {moment(date).format("DD/MM/YYYY")}
            </span>
            <span className="text-xs text-gray-500">
              {moment(date).format("HH:mm")}
            </span>
          </div>
        ) : (
          "-"
        ),
    },
    {
      title: "Trạng thái",
      dataIndex: "bookingStatus",
      key: "bookingStatus",
      width: "15%",
      render: (status) => renderBookingStatus(status),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => {
        // Lấy trạng thái booking
        const bookingStatus = record.bookingStatus || "Pending";

        // Booking đã hủy
        if (bookingStatus === "Canceled") {
          return (
            <Tag color="red" className="rounded-full px-3 py-1">
              <CloseCircleOutlined className="mr-1" />
              Đã hủy
            </Tag>
          );
        }

        // Booking đã hoàn thành
        if (bookingStatus === "Completed") {
          return (
            <Button
              size="small"
              type="primary"
              className="bg-green-500 hover:bg-green-600"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/contract-details/${record.contractId}`)}
            >
              Xem hợp đồng
            </Button>
          );
        }

        // Booking đang trong trạng thái xác thực OTP
        if (
          bookingStatus === "VerifyingOTP" ||
          bookingStatus === "VerifiedOTP"
        ) {
          return (
            <Button
              size="small"
              type="primary"
              className="bg-purple-500 hover:bg-purple-600"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/contract-details/${record.contractId}`)}
            >
              Theo dõi hợp đồng
            </Button>
          );
        }

        // Booking đang chờ thanh toán
        if (
          bookingStatus === "FirstPaymentPending" ||
          bookingStatus === "FirstPaymentSuccess"
        ) {
          return (
            <Button
              size="small"
              type="primary"
              className="bg-orange-500 hover:bg-orange-600"
              icon={<CreditCardOutlined />}
              onClick={() => navigate(`/contract-details/${record.contractId}`)}
            >
              Xem thanh toán
            </Button>
          );
        }

        // Booking đang trong quá trình xử lý
        if (
          bookingStatus === "InProgress" ||
          bookingStatus === "ContractConfirmedByManager" ||
          bookingStatus === "ContractConfirmedByCustomer"
        ) {
          return (
            <Button
              size="small"
              type="dashed"
              icon={<SyncOutlined spin />}
              onClick={() =>
                message.info("Hợp đồng đang được xử lý. Vui lòng đợi.")
              }
            >
              Đang xử lý
            </Button>
          );
        }

        // Booking bị từ chối hợp đồng
        if (
          bookingStatus === "ContractRejectedByManager" ||
          bookingStatus === "ContractRejectedByCustomer"
        ) {
          const rejectionText =
            bookingStatus === "ContractRejectedByManager"
              ? "Quản lý từ chối"
              : "Khách hàng từ chối";

          return (
            <Tooltip title={`${rejectionText} - Bạn có thể tạo lại hợp đồng`}>
              <Button
                danger
                type="primary"
                size="small"
                onClick={() => handleOpenModal(record)}
                icon={<ReloadOutlined />}
              >
                Tạo lại hợp đồng
              </Button>
            </Tooltip>
          );
        }

        // Mặc định: Hiển thị nút tạo hợp đồng (cho trạng thái Pending)
        return (
          <Button
            type="primary"
            size="small"
            onClick={() => handleOpenModal(record)}
            icon={<FileAddOutlined />}
          >
            Tạo hợp đồng
          </Button>
        );
      },
    },
  ];

  // Thêm định nghĩa columns sau function renderBookingStatus (khoảng dòng 477)
  const columns = [
    {
      title: "Mã hợp đồng",
      dataIndex: "contractNumber",
      key: "contractNumber",
    },
    {
      title: "Tên hợp đồng",
      dataIndex: "contractName",
      key: "contractName",
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      render: (text) => (
        <div className="flex items-center gap-2">
          <Avatar
            style={{
              backgroundColor: stringToColor(text),
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
            size="default"
            icon={<UserOutlined />}
          />
          <span className="font-medium">{text}</span>
        </div>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (date) =>
        date ? (
          <div className="flex flex-col">
            <span className="font-medium">
              {moment(date).format("DD/MM/YYYY")}
            </span>
            <span className="text-xs text-gray-500">
              {moment(date).format("HH:mm")}
            </span>
          </div>
        ) : (
          "-"
        ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => renderBookingStatus(status),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => {
        // Trạng thái hợp đồng
        const status = record.status || "Pending";

        // Xử lý theo trạng thái
        if (status === "Completed") {
          return (
            <div className="flex space-x-2">
              <Button
                size="small"
                type="primary"
                icon={<EyeOutlined />}
                onClick={() => handleViewContract(record.contractURL)}
                className="bg-green-500 hover:bg-green-600"
              >
                Xem hợp đồng
              </Button>
              <Button
                size="small"
                type="default"
                icon={<FaDownload className="mr-1" />}
                onClick={() =>
                  handleDownloadContract(
                    record.contractURL,
                    record.contractName
                  )
                }
              >
                Tải xuống
              </Button>
            </div>
          );
        }

        if (status === "VerifyingOTP" || status === "VerifiedOTP") {
          return (
            <div className="flex space-x-2">
              <Button
                size="small"
                type="primary"
                icon={<EyeOutlined />}
                onClick={() => handleViewContract(record.contractURL)}
                className="bg-purple-500 hover:bg-purple-600"
              >
                Xem
              </Button>
              <Button
                size="small"
                type="default"
                icon={<FaDownload className="mr-1" />}
                onClick={() =>
                  handleDownloadContract(
                    record.contractURL,
                    record.contractName
                  )
                }
              >
                Tải xuống
              </Button>
            </div>
          );
        }

        if (
          status === "FirstPaymentPending" ||
          status === "FirstPaymentSuccess"
        ) {
          return (
            <div className="flex space-x-2">
              <Button
                size="small"
                type="primary"
                icon={<EyeOutlined />}
                onClick={() => handleViewContract(record.contractURL)}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Xem
              </Button>
              <Button
                size="small"
                type="default"
                icon={<FaDownload className="mr-1" />}
                onClick={() =>
                  handleDownloadContract(
                    record.contractURL,
                    record.contractName
                  )
                }
              >
                Tải xuống
              </Button>
            </div>
          );
        }

        // Mặc định
        return (
          <div className="flex space-x-2">
            <Button
              size="small"
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => handleViewContract(record.contractURL)}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Xem
            </Button>
            <Button
              size="small"
              type="default"
              icon={<FaDownload className="mr-1" />}
              onClick={() =>
                handleDownloadContract(record.contractURL, record.contractName)
              }
            >
              Tải xuống
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Quản lý hợp đồng tư vấn"
        description="Tạo và quản lý hợp đồng tư vấn offline"
      />

      <div className="p-6">
        {/* Thống kê tổng quan */}
        <div className="mb-6">
          <Card className="shadow-md border-0 rounded-xl">
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={24} className="mb-4">
                <div className="flex flex-wrap items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                      <FileDoneOutlined className="mr-2 text-blue-500" /> Tổng
                      quan hợp đồng
                    </h2>
                    <p className="text-gray-500 mt-1">
                      Thống kê về hợp đồng tư vấn
                    </p>
                  </div>
                  <div>
                    <Button
                      type="primary"
                      className="bg-blue-500 hover:bg-blue-600"
                      onClick={() => {
                        message.loading({
                          content: "Đang tải dữ liệu...",
                          key: "dataLoading",
                        });
                        fetchBookings()
                          .then(() =>
                            message.success({
                              content: "Dữ liệu đã được cập nhật",
                              key: "dataLoading",
                            })
                          )
                          .catch(() =>
                            message.error({
                              content: "Không thể tải dữ liệu",
                              key: "dataLoading",
                            })
                          );
                      }}
                      icon={<SyncOutlined />}
                      loading={bookingsLoading}
                    >
                      Cập nhật dữ liệu
                    </Button>
                  </div>
                </div>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Card className="bg-blue-50 border-0 text-center h-full hover:shadow-md transition-all duration-300">
                  <Badge
                    count={stats.pendingBookings}
                    offset={[10, 10]}
                    color="blue"
                  >
                    <div className="rounded-full bg-blue-100 p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                      <BellOutlined className="text-blue-500 text-lg" />
                    </div>
                  </Badge>
                  <h3 className="text-2xl font-bold text-blue-500">
                    {stats.pendingBookings}
                  </h3>
                  <p className="text-gray-600">Chờ tạo hợp đồng</p>
                </Card>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Card className="bg-red-50 border-0 text-center h-full hover:shadow-md transition-all duration-300">
                  <Badge
                    count={stats.rejectedContracts}
                    offset={[10, 10]}
                    color="red"
                  >
                    <div className="rounded-full bg-red-100 p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                      <CloseCircleOutlined className="text-red-500 text-lg" />
                    </div>
                  </Badge>
                  <h3 className="text-2xl font-bold text-red-500">
                    {stats.rejectedContracts || 0}
                  </h3>
                  <p className="text-gray-600">Hợp đồng bị từ chối</p>
                </Card>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Card className="bg-green-50 border-0 text-center h-full hover:shadow-md transition-all duration-300">
                  <Badge
                    count={stats.activeContracts}
                    offset={[10, 10]}
                    color="green"
                  >
                    <div className="rounded-full bg-green-100 p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                      <CheckCircleOutlined className="text-green-500 text-lg" />
                    </div>
                  </Badge>
                  <h3 className="text-2xl font-bold text-green-500">
                    {stats.activeContracts}
                  </h3>
                  <p className="text-gray-600">Hợp đồng hiệu lực</p>
                </Card>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Card className="bg-purple-50 border-0 text-center h-full hover:shadow-md transition-all duration-300">
                  <Badge
                    count={stats.completedBookings}
                    offset={[10, 10]}
                    color="purple"
                  >
                    <div className="rounded-full bg-purple-100 p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                      <DollarOutlined className="text-purple-500 text-lg" />
                    </div>
                  </Badge>
                  <h3 className="text-2xl font-bold text-purple-500">
                    {stats.completedBookings}
                  </h3>
                  <p className="text-gray-600">Hoàn thành</p>
                </Card>
              </Col>
            </Row>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs
          defaultActiveKey={activeTab}
          onChange={(key) => setActiveTab(key)}
          className="custom-tabs bg-white rounded-lg shadow-md mb-6"
          type="card"
        >
          <Tabs.TabPane
            tab={
              <span className="flex items-center">
                <ClockCircleOutlined className="mr-2" /> Lịch tư vấn
                {stats.pendingBookings > 0 && (
                  <Badge count={stats.pendingBookings} className="ml-2" />
                )}
              </span>
            }
            key="bookings"
          />
          <Tabs.TabPane
            tab={
              <span className="flex items-center">
                <FileDoneOutlined className="mr-2" /> Hợp đồng đã tạo
                {stats.activeContracts > 0 && (
                  <Badge
                    count={stats.activeContracts}
                    className="ml-2"
                    color="green"
                  />
                )}
              </span>
            }
            key="contracts"
          />
        </Tabs>

        {activeTab === "bookings" && (
          <>
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
              <div>
                <h2 className="text-xl font-semibold flex items-center">
                  <ClockCircleOutlined className="mr-2 text-blue-500" />
                  Danh sách lịch tư vấn trực tiếp
                </h2>
                <p className="text-gray-500 text-sm">
                  Quản lý và tạo hợp đồng cho các buổi tư vấn
                </p>
              </div>
              <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                <Select
                  defaultValue="all"
                  style={{ width: 180 }}
                  onChange={handleStatusFilter}
                  className="w-full md:w-auto"
                >
                  <Select.Option value="all">Tất cả trạng thái</Select.Option>
                  <Select.Option value="pending">
                    Cần tạo hợp đồng
                  </Select.Option>
                  <Select.Option value="hasContract">
                    Đã có hợp đồng
                  </Select.Option>
                  <Select.Option value="Completed">Đã hoàn thành</Select.Option>
                  <Select.Option value="Canceled">Đã hủy</Select.Option>
                </Select>
                <SearchBar
                  onSearch={handleSearch}
                  placeholder="Tìm kiếm..."
                  className="w-full md:w-64"
                />
              </div>
            </div>

            {error && (
              <Alert
                message="Lỗi kết nối"
                description={error}
                type="error"
                showIcon
                className="mb-4"
                action={
                  <Button size="small" onClick={fetchBookings}>
                    Thử lại
                  </Button>
                }
              />
            )}

            {bookingsLoading ? (
              <div className="text-center py-16 bg-white rounded-lg shadow">
                <Spin size="large" />
                <div className="mt-4 text-gray-500">
                  Đang tải dữ liệu lịch tư vấn...
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow mb-8">
                <Table
                  columns={bookingColumns}
                  dataSource={filteredBookings}
                  rowKey="id"
                  pagination={false}
                  rowClassName={(record) => {
                    const status = record.bookingStatus || "Pending";
                    if (status === "Pending")
                      return "bg-blue-50 hover:bg-blue-100";
                    if (status.includes("Rejected"))
                      return "bg-red-50 hover:bg-red-100";
                    if (status === "VerifyingOTP" || status === "VerifiedOTP")
                      return "bg-purple-50 hover:bg-purple-100";
                    if (status === "Completed")
                      return "bg-green-50 hover:bg-green-100";
                    return "";
                  }}
                  locale={{
                    emptyText: searchTerm
                      ? "Không tìm thấy kết quả phù hợp"
                      : "Chưa có lịch tư vấn nào",
                  }}
                />
              </div>
            )}

            <div className="mt-4 mb-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}

        {activeTab === "contracts" && (
          <>
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
              <div>
                <h2 className="text-xl font-semibold flex items-center">
                  <FileDoneOutlined className="mr-2 text-green-500" />
                  Danh sách hợp đồng đã tạo
                </h2>
                <p className="text-gray-500 text-sm">
                  Quản lý tất cả các hợp đồng tư vấn
                </p>
              </div>
              <SearchBar
                onSearch={handleContractSearch}
                placeholder="Tìm kiếm hợp đồng..."
                className="w-full md:w-64 mt-3 md:mt-0"
              />
            </div>

            {loading ? (
              <div className="text-center py-16 bg-white rounded-lg shadow">
                <Spin size="large" />
                <div className="mt-4 text-gray-500">
                  Đang tải dữ liệu hợp đồng...
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow mb-8">
                <Table
                  columns={columns}
                  dataSource={filteredContracts}
                  rowKey="id"
                  pagination={false}
                  rowClassName={(record) => {
                    const status = record.status || "Pending";
                    if (status.includes("Rejected"))
                      return "bg-red-50 hover:bg-red-100";
                    if (status === "VerifyingOTP" || status === "VerifiedOTP")
                      return "bg-purple-50 hover:bg-purple-100";
                    if (status === "Completed")
                      return "bg-green-50 hover:bg-green-100";
                    if (
                      status === "FirstPaymentPending" ||
                      status === "FirstPaymentSuccess"
                    )
                      return "bg-orange-50 hover:bg-orange-100";
                    if (
                      status === "ContractConfirmedByManager" ||
                      status === "ContractConfirmedByCustomer"
                    )
                      return "bg-blue-50 hover:bg-blue-100";
                    return "";
                  }}
                  locale={{ emptyText: "Chưa có hợp đồng nào được tạo" }}
                />
              </div>
            )}

            <div className="mt-4 mb-8">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredContracts.length / 10)}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}

        <Modal
          title={
            <div className="text-xl font-semibold">
              Tạo hợp đồng tư vấn mới
              {selectedBooking && (
                <div className="text-sm font-normal text-gray-500 mt-1">
                  Khách hàng: {selectedBooking.customerName} -{" "}
                  {selectedBooking.customerEmail}
                </div>
              )}
            </div>
          }
          open={isModalOpen}
          onCancel={handleCloseModal}
          footer={null}
          width={800}
          className="contract-modal"
        >
          <div className="p-4">
            <Form form={form} layout="vertical" onFinish={handleCreateContract}>
              <Form.Item name="bookingId" hidden>
                <Input />
              </Form.Item>

              {selectedBooking && (
                <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-100">
                  <h3 className="font-medium mb-2 text-blue-800">
                    Thông tin lịch tư vấn
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-gray-600">
                        <strong>Khách hàng:</strong>{" "}
                        {selectedBooking.customerName}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Email:</strong> {selectedBooking.customerEmail}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Địa điểm:</strong> {selectedBooking.location}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        <strong>Ngày tư vấn:</strong>{" "}
                        {moment(selectedBooking.bookingDate).format(
                          "DD/MM/YYYY HH:mm"
                        )}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Trạng thái:</strong>{" "}
                        <span className="text-green-600">Đã lên lịch</span>
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      <strong>Mô tả:</strong> {selectedBooking.description}
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-yellow-50 p-4 rounded-lg mb-4 border border-yellow-100">
                <div className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-yellow-500 mr-2 mt-0.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <h3 className="font-medium text-yellow-800 text-sm">
                      Lưu ý quan trọng
                    </h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      Vui lòng tải lên file hợp đồng đã được ký kết giữa hai
                      bên. Chỉ chấp nhận file PDF.
                    </p>
                  </div>
                </div>
              </div>

              <Form.Item
                label="Tải lên file hợp đồng (PDF)"
                name="pdfFile"
                rules={[
                  { required: true, message: "Vui lòng tải lên file hợp đồng" },
                ]}
              >
                <Upload
                  listType="picture"
                  beforeUpload={(file) => {
                    // Kiểm tra định dạng file
                    const isPdf = file.type === "application/pdf";
                    if (!isPdf) {
                      message.error("Chỉ chấp nhận file PDF!");
                    }
                    return false; // Ngăn chặn tự động upload
                  }}
                  onChange={handleFileChange}
                  accept=".pdf"
                  maxCount={1}
                >
                  <Button
                    icon={<UploadOutlined />}
                    className="bg-white border border-gray-300 hover:bg-gray-50"
                  >
                    Chọn file PDF
                  </Button>
                </Upload>
              </Form.Item>

              {previewUrl && (
                <div className="mt-4 border rounded-lg overflow-hidden">
                  <div className="bg-gray-100 px-4 py-2 border-b flex justify-between items-center">
                    <h3 className="font-medium text-gray-700">
                      Xem trước hợp đồng
                    </h3>
                    <Button
                      type="link"
                      onClick={() => window.open(previewUrl, "_blank")}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Mở rộng
                    </Button>
                  </div>
                  <div className="pdf-preview-container">
                    <iframe
                      src={previewUrl}
                      title="PDF Preview"
                      className="w-full h-[400px] border-0"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <CustomButton
                  onClick={handleCloseModal}
                  className="border border-gray-300"
                >
                  Hủy bỏ
                </CustomButton>
                <CustomButton
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Tạo hợp đồng
                </CustomButton>
              </div>
            </Form>
          </div>
        </Modal>

        <style jsx global>{`
          .contract-modal .ant-modal-content {
            border-radius: 12px;
            overflow: hidden;
          }
          .contract-modal .ant-modal-header {
            border-bottom: 1px solid #f0f0f0;
            padding: 16px 24px;
          }
          .contract-modal .ant-modal-body {
            padding: 12px;
          }
          .contract-modal .ant-modal-footer {
            border-top: 1px solid #f0f0f0;
          }
          .ant-table-row-level-0:hover {
            transition: all 0.3s;
          }
          .pdf-preview-container {
            background-color: #f5f5f5;
            padding: 8px;
            border-radius: 0 0 8px 8px;
          }
          .pdf-preview-container iframe {
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            background-color: white;
          }
          .custom-tabs .ant-tabs-nav {
            margin-bottom: 0;
          }
          .custom-tabs .ant-tabs-tab {
            padding: 12px 20px;
            transition: all 0.3s;
          }
          .custom-tabs .ant-tabs-tab:hover {
            color: #1890ff;
          }
          .custom-tabs .ant-tabs-tab.ant-tabs-tab-active {
            background-color: #e6f7ff;
          }
          .custom-tabs .ant-tabs-tab-btn {
            font-weight: 500;
          }
        `}</style>
      </div>
    </div>
  );
};

export default ConsultingContract;
