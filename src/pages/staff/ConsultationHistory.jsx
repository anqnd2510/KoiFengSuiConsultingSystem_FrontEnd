import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Space,
  Table,
  Button,
  Typography,
  Tag,
  Popconfirm,
  message,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Divider,
  Row,
  Col,
} from "antd";
import SearchBar from "../../components/Common/SearchBar";
import Pagination from "../../components/Common/Pagination";
import Header from "../../components/Common/Header";
import Error from "../../components/Common/Error";
import CustomButton from "../../components/Common/CustomButton";
import {
  User,
  Trash2,
  Calendar,
  FileText,
  Check,
  Clock,
  Filter,
  Phone,
  DollarSign,
  Video,
  CheckCircle,
} from "lucide-react";
import {
  getBookingHistory,
  getBookingDetail,
} from "../../services/booking.service";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

// Hàm dịch trạng thái sang tiếng Việt
const translateStatus = (status) => {
  // Ánh xạ trạng thái BookingOnline
  const onlineStatusMap = {
    Pending: "Chờ xử lý",
    PendingConfirm: "Chờ xác nhận",
    Confirmed: "Đã xác nhận",
    Completed: "Hoàn thành",
    Canceled: "Đã hủy",
  };

  // Ánh xạ trạng thái BookingOffline
  const offlineStatusMap = {
    Pending: "Chờ xử lý",
    InProgress: "Đang xử lý",
    ContractRejectedByManager: "Hợp đồng bị từ chối bởi quản lý",
    ContractConfirmedByManager: "Hợp đồng được xác nhận bởi quản lý",
    ContractRejectedByCustomer: "Hợp đồng bị từ chối bởi khách hàng",
    ContractConfirmedByCustomer: "Hợp đồng được xác nhận bởi khách hàng",
    VerifyingOTP: "Đang xác minh OTP",
    VerifiedOTP: "Đã xác minh OTP",
    FirstPaymentPending: "Chờ thanh toán lần 1",
    FirstPaymentPendingConfirm: "Chờ xác nhận thanh toán lần 1",
    FirstPaymentSuccess: "Thanh toán lần 1 thành công",
    DocumentRejectedByManager: "Hồ sơ bị từ chối bởi quản lý",
    DocumentConfirmedByManager: "Hồ sơ được xác nhận bởi quản lý",
    DocumentRejectedByCustomer: "Hồ sơ bị từ chối bởi khách hàng",
    DocumentConfirmedByCustomer: "Hồ sơ được xác nhận bởi khách hàng",
    AttachmentRejected: "Biên bản kèm bị từ chối",
    AttachmentConfirmed: "Biên bản kèm được xác nhận",
    VerifyingOTPAttachment: "Đang xác minh OTP Biên bản kèm",
    VerifiedOTPAttachment: "Đã xác minh OTP Biên bản kèm",
    SecondPaymentPending: "Chờ thanh toán lần 2",
    SecondPaymentPendingConfirm: "Chờ xác nhận thanh toán lần 2",
    Completed: "Hoàn thành",
    Canceled: "Đã hủy",
  };

  // Kiểm tra trong bảng ánh xạ BookingOnline
  if (onlineStatusMap[status]) {
    return onlineStatusMap[status];
  }

  // Kiểm tra trong bảng ánh xạ BookingOffline
  if (offlineStatusMap[status]) {
    return offlineStatusMap[status];
  }

  // Nếu không tìm thấy, trả về giá trị ban đầu
  return status;
};

// Hàm xác định màu cho trạng thái
const getStatusColor = (status) => {
  // Các trạng thái hoàn thành
  if (status === "Completed") {
    return "success";
  }

  // Các trạng thái bị hủy hoặc từ chối
  if (status === "Canceled" || status.includes("Rejected")) {
    return "error";
  }

  // Các trạng thái đã xác nhận
  if (
    status.includes("Confirmed") ||
    status.includes("Success") ||
    status.includes("Verified")
  ) {
    return "blue";
  }

  // Các trạng thái đang chờ
  if (
    status.includes("Pending") ||
    status === "InProgress" ||
    status.includes("Verifying")
  ) {
    return "warning";
  }

  // Mặc định
  return "default";
};

// Component modal xem chi tiết tư vấn
const ConsultationDetail = React.memo(({ consultation, visible, onClose }) => {
  // Log để debug data nhận được
  console.log("Modal consultation data:", consultation);

  // Kiểm tra và format dữ liệu trước khi render
  const formattedData = {
    customerName: consultation?.customerName || "Chưa có thông tin",
    customerEmail: consultation?.customerEmail || "Chưa có email",
    masterName: consultation?.masterName || "Chưa phân công",
    bookingOnlineId:
      consultation?.id || consultation?.bookingOnlineId || "Không có mã",
    bookingDate: consultation?.bookingDate
      ? new Date(consultation.bookingDate).toLocaleDateString("vi-VN")
      : "Chưa có ngày",
    startTime: consultation?.startTime || "--:--",
    endTime: consultation?.endTime || "--:--",
    type: consultation?.type || "Chưa xác định",
    status: consultation?.status || "Chưa có trạng thái",
    description: consultation?.description || "Không có yêu cầu",
    masterNote: consultation?.masterNote || "Chưa có ghi chú",
  };

  return (
    <Modal
      title={<div className="text-xl font-semibold">Chi tiết buổi tư vấn</div>}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
      className="consultation-modal"
    >
      <div className="p-4">
        <div className="space-y-4">
          <Row gutter={16} key="customer-row">
            <Col span={24} md={12}>
              <div>
                <p className="text-gray-500 mb-1">Khách hàng</p>
                <div className="flex items-center gap-2">
                  <User className="w-6 h-6 text-gray-400" />
                  <div>
                    <p className="font-medium">{formattedData.customerName}</p>
                    <p className="text-sm text-gray-500">
                      {formattedData.customerEmail}
                    </p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          <Row gutter={16} key="master-row">
            <Col span={24} md={12}>
              <div>
                <p className="text-gray-500 mb-1">Thầy tư vấn</p>
                <p className="font-medium">{formattedData.masterName}</p>
              </div>
            </Col>

            <Col span={24} md={12}>
              <div>
                <p className="text-gray-500 mb-1">Mã đặt lịch</p>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <p className="font-medium">{formattedData.bookingOnlineId}</p>
                </div>
              </div>
            </Col>
          </Row>

          <Row gutter={16} key="consult-date-row">
            <Col span={24} md={12}>
              <div>
                <p className="text-gray-500 mb-1">Thời gian tư vấn</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <p className="font-medium">{formattedData.bookingDate}</p>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <p className="font-medium">
                    {`${formattedData.startTime} - ${formattedData.endTime}`}
                  </p>
                </div>
              </div>
            </Col>
          </Row>

          <Row gutter={16} key="status-row">
            <Col span={24}>
              <div>
                <p className="text-gray-500 mb-1">Trạng thái</p>
                <Tag color={getStatusColor(formattedData.status)}>
                  {translateStatus(formattedData.status)}
                </Tag>
              </div>
            </Col>
          </Row>

          <div>
            <p className="text-gray-500 mb-1">Yêu cầu tư vấn</p>
            <p className="mt-1">{formattedData.description}</p>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <CustomButton onClick={onClose}>Đóng</CustomButton>
          </div>
        </div>
      </div>
    </Modal>
  );
});

const ConsultationHistory = () => {
  // Thêm ref để track mounted state
  const isMounted = React.useRef(false);

  // Các state hiện tại
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null); // Chỉ set error khi thực sự có lỗi
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [pageSize, setPageSize] = useState(10);

  // Tối ưu lại fetchConsultationHistory với useCallback
  const fetchConsultationHistory = useCallback(async () => {
    if (!isMounted.current) return;

    try {
      setLoading(true);
      const response = await getBookingHistory();
      console.log("Raw data from API:", response.data);

      if (!response?.data) {
        throw new Error("Định dạng dữ liệu không đúng");
      }

      const dataArray = Array.isArray(response.data)
        ? response.data
        : [response.data];

      const formattedData = dataArray.map((item) => ({
        key: item.id,
        bookingOnlineId: item.id,
        bookingDate: item.bookingDate,
        startTime: item.startTime || "Chưa có",
        endTime: item.endTime || "Chưa có",
        customerName: item.customerName,
        customerEmail: item.customerEmail,
        masterName: item.masterName,
        masterNote: item.masterNote || "Chưa có ghi chú",
        type: item.type,
        status: item.status,
        description: item.description || "Không có mô tả",
        customer: {
          name: item.customerName || "Không có tên",
          email: item.customerEmail || "Không có email",
        },
        master: item.masterName || "Chưa phân công",
        consultType: item.type,
        consultDate: item.createDate,
        topics: [item.description].filter(Boolean),
      }));

      console.log("Formatted data with IDs:", formattedData);
      setConsultations(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message || "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }, []);

  // Sử dụng useEffect với cleanup function
  useEffect(() => {
    isMounted.current = true;
    fetchConsultationHistory();

    return () => {
      isMounted.current = false;
    };
  }, [fetchConsultationHistory]);

  // Tối ưu các hàm xử lý với useCallback
  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  const handleOpenDetailModal = async (record) => {
    try {
      console.log("Record data:", record);
      const response = await getBookingDetail(record.bookingOnlineId);
      console.log("API Response:", response);

      // Kiểm tra và lấy dữ liệu từ response
      if (response.isSuccess && response.data) {
        const detailData = response.data;
        console.log("Detail data received:", detailData);

        // Set data cho modal
        setSelectedConsultation({
          customerName: detailData.customerName,
          customerEmail: detailData.customerEmail,
          masterName: detailData.masterName,
          bookingOnlineId: detailData.bookingOnlineId,
          bookingDate: detailData.bookingDate,
          startTime: detailData.startTime,
          endTime: detailData.endTime,
          type: detailData.type,
          status: detailData.status,
          description: detailData.description,
          masterNote: detailData.masterNote,
        });
      } else {
        // Nếu không có data từ API, sử dụng data từ record
        setSelectedConsultation(record);
        console.warn("No detail data received from API, using record data");
      }

      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching booking detail:", error);
      // Trong trường hợp lỗi, vẫn hiển thị modal với dữ liệu từ record
      setSelectedConsultation(record);
      setIsModalOpen(true);
      message.error(
        "Không thể lấy thông tin chi tiết. Hiển thị dữ liệu cơ bản."
      );
    }
  };

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedConsultation(null);
  }, []);

  const handleStatusFilterChange = useCallback((value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  }, []);

  const handleTypeFilterChange = useCallback((value) => {
    setTypeFilter(value);
    setCurrentPage(1);
  }, []);

  // Tối ưu filteredData với useMemo
  const filteredData = useMemo(() => {
    return consultations.filter((item) => {
      const matchesSearchTerm =
        item.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.master.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.topics.some((topic) =>
          topic.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;
      const matchesType =
        typeFilter === "all" || item.consultType === typeFilter;

      return matchesSearchTerm && matchesStatus && matchesType;
    });
  }, [consultations, searchTerm, statusFilter, typeFilter]);

  // Tối ưu paginatedData với useMemo
  const paginatedData = useMemo(() => {
    return filteredData.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
  }, [filteredData, currentPage, pageSize]);

  // Render columns theo dữ liệu từ hình ảnh
  const columns = [
    {
      title: "Khách hàng",
      dataIndex: "customer",
      key: "customer",
      render: (customer) => (
        <div>
          <div>{customer?.name || "Không có tên"}</div>
          <div style={{ color: "#888", fontSize: "12px" }}>
            {customer?.email || "Không có email"}
          </div>
        </div>
      ),
    },
    {
      title: "Thầy tư vấn",
      dataIndex: "master",
      key: "master",
      render: (master) => master || "Chưa phân công",
    },
    {
      title: "Ngày tạo tư vấn",
      dataIndex: "consultDate",
      key: "consultDate",
      render: (date) => {
        if (!date) return "Chưa có ngày";

        try {
          const dateObj = new Date(date);

          // Kiểm tra xem ngày có hợp lệ không
          if (isNaN(dateObj.getTime())) return "Ngày không hợp lệ";

          // Format ngày theo định dạng DD/MM/YYYY
          const day = dateObj.getDate().toString().padStart(2, "0");
          const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
          const year = dateObj.getFullYear();

          // Format giờ theo định dạng HH:MM
          const hours = dateObj.getHours().toString().padStart(2, "0");
          const minutes = dateObj.getMinutes().toString().padStart(2, "0");

          return (
            <div>
              <div className="font-medium">{`${day}/${month}/${year}`}</div>
              <div className="text-xs text-gray-500 flex items-center mt-1">
                <Clock className="inline-block mr-1 w-3 h-3" />
                {`${hours}:${minutes}`}
              </div>
            </div>
          );
        } catch (error) {
          console.error("Error formatting date:", error);
          return "Lỗi định dạng ngày";
        }
      },
    },
    {
      title: "Loại tư vấn",
      dataIndex: "consultType",
      key: "consultType",
      render: (type) => (
        <Tag color={type === "Online" ? "green" : "gold"}>
          {type === "Online"
            ? "Trực tuyến"
            : type === "Offline"
            ? "Trực tiếp"
            : type || "Chưa xác định"}
        </Tag>
      ),
    },
    {
      title: "Yêu cầu tư vấn",
      dataIndex: "topics",
      key: "topics",
      render: (topics) => (
        <>
          {(topics || []).map((topic, index) => (
            <Tag color="blue" key={`${topic}-${index}`}>
              {topic || "Không có yêu cầu"}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color = getStatusColor(status);
        const displayText = translateStatus(status);

        let icon = null;
        if (status === "Completed") {
          icon = <Check className="inline-block mr-1 w-4 h-4" />;
        } else if (status === "Canceled" || status.includes("Rejected")) {
          icon = <Trash2 className="inline-block mr-1 w-4 h-4" />;
        } else if (
          status.includes("Pending") ||
          status === "InProgress" ||
          status.includes("Verifying")
        ) {
          icon = <Clock className="inline-block mr-1 w-4 h-4" />;
        } else if (
          status.includes("Confirmed") ||
          status.includes("Success") ||
          status.includes("Verified")
        ) {
          icon = <CheckCircle className="inline-block mr-1 w-4 h-4" />;
        }

        return (
          <Tag color={color} icon={icon}>
            {displayText}
          </Tag>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Button type="primary" onClick={() => handleOpenDetailModal(record)}>
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Lịch sử tư vấn phong thủy Koi"
        description="Quản lý thông tin và lịch sử các buổi tư vấn phong thủy"
      />

      {/* Main Content */}
      <div className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex flex-wrap justify-between items-center mb-4">
            <SearchBar
              placeholder="Tìm kiếm theo tên khách hàng, thầy, chủ đề..."
              onSearch={handleSearch}
              className="w-64 mb-2 md:mb-0"
            />

            <div className="flex flex-wrap gap-2">
              <Select
                defaultValue="all"
                style={{ width: 150 }}
                onChange={handleStatusFilterChange}
                placeholder="Trạng thái"
                suffixIcon={<FilterOutlined />}
                className="mb-2 md:mb-0"
              >
                <Option key="status-all" value="all">
                  Tất cả trạng thái
                </Option>
                <Option key="status-pending" value="Pending">
                  Chờ xử lý
                </Option>
                <Option key="status-confirmed" value="Confirmed">
                  Đã xác nhận
                </Option>
                <Option key="status-completed" value="Completed">
                  Hoàn thành
                </Option>
                <Option key="status-canceled" value="Canceled">
                  Đã hủy
                </Option>
                <Option key="status-first-payment" value="FirstPaymentPending">
                  Chờ thanh toán lần 1
                </Option>
                <Option
                  key="status-second-payment"
                  value="SecondPaymentPending"
                >
                  Chờ thanh toán lần 2
                </Option>
              </Select>

              <Select
                defaultValue="all"
                style={{ width: 150 }}
                onChange={handleTypeFilterChange}
                placeholder="Loại tư vấn"
                suffixIcon={<FilterOutlined />}
                className="mb-2 md:mb-0"
              >
                <Option key="type-all" value="all">
                  Tất cả loại
                </Option>
                <Option key="type-online" value="Online">
                  Online
                </Option>
                <Option key="type-offline" value="Offline">
                  Offline
                </Option>
              </Select>
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={filteredData}
            pagination={{
              current: currentPage,
              total: filteredData.length,
              pageSize: pageSize,
              showSizeChanger: true,
              showTotal: (total) => `Tổng số ${total} lịch sử tư vấn`,
              onChange: (page, pageSize) => {
                setCurrentPage(page);
                setPageSize(pageSize);
              },
            }}
            rowKey="key"
            bordered
            loading={loading}
          />
        </div>
      </div>

      {/* Modal xem chi tiết tư vấn */}
      {selectedConsultation && (
        <ConsultationDetail
          consultation={selectedConsultation}
          visible={isModalOpen}
          onClose={handleCloseModal}
        />
      )}

      <style jsx global>{`
        .consultation-modal .ant-modal-content {
          border-radius: 12px;
          overflow: hidden;
        }
        .consultation-modal .ant-modal-header {
          border-bottom: 1px solid #f0f0f0;
          padding: 16px 24px;
        }
        .consultation-modal .ant-modal-body {
          padding: 12px;
        }
        .consultation-modal .ant-modal-footer {
          border-top: 1px solid #f0f0f0;
        }
      `}</style>
    </div>
  );
};

export default React.memo(ConsultationHistory);
