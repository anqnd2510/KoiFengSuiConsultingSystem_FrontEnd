import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Upload,
  DatePicker,
  message,
  Row,
  Col,
  Tag,
  Divider,
  Tabs,
  TimePicker,
} from "antd";
import {
  UploadCloud,
  Plus,
  Calendar,
  MapPin,
  Ticket,
  Info,
  Eye,
  Clock,
} from "lucide-react";
import WorkshopTable from "../../components/Workshop/WorkshopTable";
import SearchBar from "../../components/Common/SearchBar";
import Pagination from "../../components/Common/Pagination";
import Header from "../../components/Common/Header";
import Error from "../../components/Common/Error";
import CustomButton from "../../components/Common/CustomButton";
import {
  getAllWorkshops,
  getWorkshopById,
  createWorkshop,
  updateWorkshop,
  deleteWorkshop,
  formatWorkshopsData,
} from "../../services/workshopmaster.service";
import {
  getPendingWorkshops,
  formatPendingWorkshopsData,
} from "../../services/approve.service";
import { isAuthenticated } from "../../services/auth.service";
import { getAllLocations } from "../../services/location.service";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

// Component form cho workshop
const WorkshopForm = ({ form, loading, locations }) => {
  return (
    <Form form={form} layout="vertical" disabled={loading}>
      <Form.Item
        label="Tên hội thảo"
        name="name"
        rules={[{ required: true, message: "Vui lòng nhập tên hội thảo" }]}
      >
        <Input placeholder="Nhập tên hội thảo" />
      </Form.Item>

      <Form.Item
        label="Địa điểm"
        name="locationId"
        rules={[{ required: true, message: "Vui lòng chọn địa điểm!" }]}
      >
        <Select
          placeholder="Chọn địa điểm"
          options={locations.map((location) => ({
            value: location.id,
            label: location.name
          }))}
        />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Ngày tổ chức"
            name="date"
            rules={[{ required: true, message: "Vui lòng chọn ngày tổ chức" }]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              style={{ width: "100%" }}
              placeholder="Chọn ngày tổ chức"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Giờ bắt đầu"
            name="startTime"
            rules={[{ required: true, message: "Vui lòng chọn giờ bắt đầu" }]}
          >
            <TimePicker format="HH:mm" style={{ width: "100%" }} placeholder="Chọn giờ bắt đầu" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Giờ kết thúc"
            name="endTime"
            rules={[{ required: true, message: "Vui lòng chọn giờ kết thúc" }]}
          >
            <TimePicker format="HH:mm" style={{ width: "100%" }} placeholder="Chọn giờ kết thúc" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Giá vé"
            name="ticketPrice"
            rules={[{ required: true, message: "Vui lòng nhập giá vé" }]}
          >
            <Input placeholder="Nhập giá vé (VD: 300.000 VND)" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Số lượng vé"
            name="ticketSlots"
            rules={[{ required: true, message: "Vui lòng nhập số lượng vé" }]}
          >
            <InputNumber
              min={1}
              placeholder="Nhập số lượng vé"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        label="Hình ảnh"
        name="image"
        valuePropName="fileList"
        getValueFromEvent={(e) => {
          if (Array.isArray(e)) {
            return e;
          }
          return e?.fileList;
        }}
      >
        <Upload listType="picture-card" maxCount={1} beforeUpload={() => false}>
          <div className="flex flex-col items-center">
            <UploadCloud className="w-6 h-6 text-gray-400" />
            <div className="mt-2">Upload</div>
          </div>
        </Upload>
      </Form.Item>

      <Form.Item
        label="Mô tả hội thảo"
        name="description"
        rules={[{ required: true, message: "Vui lòng nhập mô tả hội thảo" }]}
      >
        <TextArea
          placeholder="Nhập mô tả về hội thảo"
          autoSize={{ minRows: 3, maxRows: 6 }}
        />
      </Form.Item>
    </Form>
  );
};

const Workshop = () => {
  const navigate = useNavigate();
  const [workshops, setWorkshops] = useState([]);
  const [pendingWorkshops, setPendingWorkshops] = useState([]);
  const [rejectedWorkshops, setRejectedWorkshops] = useState([]);
  const [locations, setLocations] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pendingCurrentPage, setPendingCurrentPage] = useState(1);
  const [rejectedCurrentPage, setRejectedCurrentPage] = useState(1);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [pendingTotalPages, setPendingTotalPages] = useState(1);
  const [rejectedTotalPages, setRejectedTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState("1");
  const [pageSize, setPageSize] = useState(10);

  // Kiểm tra xác thực khi component mount
  useEffect(() => {
    if (!isAuthenticated()) {
      message.error("Bạn cần đăng nhập để sử dụng chức năng này");
      navigate("/login");
      return;
    }
    fetchWorkshops();
    fetchPendingWorkshops();
    fetchLocations();
  }, [navigate]);

  // Thêm useEffect để refresh danh sách workshop khi quay lại từ trang WorkshopCheck
  useEffect(() => {
    const refreshOnFocus = () => {
      console.log("Trang được focus lại, refresh danh sách workshop");
      refreshData();
    };

    // Đăng ký sự kiện focus
    window.addEventListener("focus", refreshOnFocus);

    // Cleanup
    return () => {
      window.removeEventListener("focus", refreshOnFocus);
    };
  }, []);

  // Hàm fetch workshops từ API
  const fetchWorkshops = async () => {
    try {
      setLoading(true);
      const data = await getAllWorkshops();
      console.log("Dữ liệu gốc từ getAllWorkshops:", data);

      // In ra thông tin hình ảnh từ dữ liệu gốc
      if (Array.isArray(data)) {
        data.forEach(workshop => {
          console.log(`Workshop ${workshop.workshopId} từ API - image: ${workshop.image}, imageUrl: ${workshop.imageUrl}`);
        });
      }

      const formattedData = formatWorkshopsData(data);
      console.log("Dữ liệu đã format từ getAllWorkshops:", formattedData);
      
      // In ra thông tin hình ảnh sau khi format
      if (Array.isArray(formattedData)) {
        formattedData.forEach(workshop => {
          console.log(`Workshop ${workshop.id} sau format - image: ${workshop.image}, imageUrl: ${workshop.imageUrl}`);
        });
      }

      // Lọc các workshop đã bị từ chối
      const rejected = formattedData.filter(
        (workshop) => workshop.status === "Từ chối"
      );
      setRejectedWorkshops(rejected);
      setRejectedTotalPages(Math.ceil(rejected.length / 10));

      // Lọc các workshop không bị từ chối và không phải chờ duyệt để hiển thị ở tab 1
      const approved = formattedData.filter(
        (workshop) =>
          workshop.status !== "Từ chối" && workshop.status !== "Chờ duyệt"
      );
      setWorkshops(approved);
      setTotalPages(Math.ceil(approved.length / 10));

      setError(null);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách workshop:", err);

      // Xử lý lỗi 401
      if (err.message.includes("đăng nhập")) {
        message.error(err.message);
        navigate("/login");
        return;
      }

      setError("Không thể tải danh sách hội thảo. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Hàm fetch workshops chờ phê duyệt từ API
  const fetchPendingWorkshops = async () => {
    try {
      setLoading(true);
      const data = await getPendingWorkshops();
      
      // Log dữ liệu gốc từ API
      console.log("Dữ liệu gốc từ getPendingWorkshops:", data);
      
      const formattedData = formatPendingWorkshopsData(data);
      
      // Log dữ liệu sau khi format
      console.log("Dữ liệu sau khi format:", formattedData);
      
      setPendingWorkshops(formattedData);
      setPendingTotalPages(Math.ceil(formattedData.length / 10)); // Giả sử hiển thị 10 items mỗi trang
    } catch (err) {
      console.error("Lỗi khi lấy danh sách workshop chờ phê duyệt:", err);

      // Xử lý lỗi 401
      if (err.message.includes("đăng nhập")) {
        message.error(err.message);
        navigate("/login");
        return;
      }

      message.error(
        "Không thể tải danh sách hội thảo chờ phê duyệt. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  // Thêm hàm fetchLocations
  const fetchLocations = async () => {
    try {
      setLoading(true);
        const data = await getAllLocations();
      console.log("Response từ API locations:", data);

      if (Array.isArray(data)) {
        console.log("Đã tải được", data.length, "địa điểm");
        const formattedLocations = data.map(location => ({
          id: location.locationId,
          name: location.locationName
        }));
        setLocations(formattedLocations);
      } else {
        console.warn("Không có dữ liệu địa điểm hoặc dữ liệu không đúng định dạng");
        setLocations([]);
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh sách địa điểm:", err);
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    // Xử lý tìm kiếm ở đây
    console.log("Searching for:", searchTerm);
    // Có thể thêm logic tìm kiếm từ API ở đây
  };

  const handleOpenCreateModal = () => {
    form.resetFields();
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleViewWorkshop = (workshop) => {
    console.log("Workshop data đầy đủ:", workshop);
    
    // Kiểm tra và in ra URL hình ảnh
    let imageUrl = workshop.imageUrl || workshop.image || "";
    console.log("Image URL gốc:", imageUrl);

    // Nếu URL đã là URL đầy đủ (https://res.cloudinary.com hoặc bất kỳ URL http nào khác), 
    // giữ nguyên không thay đổi
    if (imageUrl && !imageUrl.startsWith("http")) {
      // Chỉ thêm domain nếu đường dẫn là tương đối
      imageUrl = `http://localhost:5261/${imageUrl.replace(/^\//, "")}`;
      console.log("Image URL đã được chuyển đổi:", imageUrl);
    } else {
      console.log("Sử dụng URL đầy đủ:", imageUrl);
    }
    
    // Lưu trữ dữ liệu workshop và thêm imageUrl để hiển thị trong modal
    const updatedWorkshop = {
      ...workshop,
      imageUrl: imageUrl
    };
    
    console.log("Workshop data đã được xử lý:", updatedWorkshop);
    
    // Mở modal với dữ liệu workshop đã được cập nhật
    setSelectedWorkshop(updatedWorkshop);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedWorkshop(null);
  };

  // Hàm refresh dữ liệu
  const refreshData = async () => {
    await fetchWorkshops();
    await fetchPendingWorkshops();
  };

  // Thêm hàm kiểm tra trùng lịch
  const checkTimeConflict = (workshops, newWorkshop) => {
    return workshops.some(workshop => {
      // Chỉ kiểm tra các workshop cùng địa điểm
      if (workshop.locationId !== newWorkshop.locationId) {
        return false;
      }

      // Kiểm tra ngày
      const workshopDate = new Date(workshop.date).toDateString();
      const newDate = new Date(newWorkshop.date).toDateString();
      if (workshopDate !== newDate) {
        return false;
      }

      // Chuyển đổi thời gian sang phút để dễ so sánh
      const getMinutes = (timeStr) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
      };

      const workshopStart = getMinutes(workshop.startTime);
      const workshopEnd = getMinutes(workshop.endTime);
      const newStart = getMinutes(newWorkshop.startTime);
      const newEnd = getMinutes(newWorkshop.endTime);

      // Kiểm tra xem có trùng thời gian không
      return (
        (newStart >= workshopStart && newStart < workshopEnd) || // Thời gian bắt đầu nằm trong khoảng
        (newEnd > workshopStart && newEnd <= workshopEnd) || // Thời gian kết thúc nằm trong khoảng
        (newStart <= workshopStart && newEnd >= workshopEnd) // Bao trọn workshop cũ
      );
    });
  };

  const handleSaveWorkshop = () => {
    // Kiểm tra xác thực trước khi tạo workshop
    if (!isAuthenticated()) {
      message.error("Bạn cần đăng nhập để tạo hội thảo");
      navigate("/login");
      return;
    }

    form
      .validateFields()
      .then(async (values) => {
        try {
          setLoading(true);

          // Xử lý giá vé
          let ticketPrice = 0;
          if (values.ticketPrice) {
            const numericValue = values.ticketPrice.replace(/[^\d]/g, "");
            ticketPrice = numericValue ? parseFloat(numericValue) : 0;
          }

          // Đảm bảo số lượng vé là số nguyên
          const ticketSlots = values.ticketSlots
            ? parseInt(values.ticketSlots, 10)
            : 0;

          // Format ngày thành YYYY-MM-DD
          const formattedDate = values.date
            ? values.date.format("YYYY-MM-DD")
            : new Date().toISOString().split("T")[0];

          // Format giờ thành HH:mm
          const startTime = values.startTime ? values.startTime.format("HH:mm") : "";
          const endTime = values.endTime ? values.endTime.format("HH:mm") : "";

          // Kiểm tra thời gian kết thúc phải sau thời gian bắt đầu
          const startDateTime = dayjs(`${formattedDate} ${startTime}`);
          const endDateTime = dayjs(`${formattedDate} ${endTime}`);
          
          if (endDateTime.isBefore(startDateTime)) {
            message.error("Thời gian kết thúc phải sau thời gian bắt đầu");
            setLoading(false);
            return;
          }

          // Kiểm tra ngày phải từ ngày hiện tại trở đi
          const today = dayjs().startOf('day');
          const selectedDate = dayjs(formattedDate).startOf('day');
          if (selectedDate.isBefore(today)) {
            message.error("Ngày tổ chức phải từ ngày hiện tại trở đi");
            setLoading(false);
            return;
          }

          // Tạo object workshop mới để kiểm tra trùng lịch
          const newWorkshop = {
            locationId: values.locationId,
            date: formattedDate,
            startTime: startTime,
            endTime: endTime
          };

          // Kiểm tra trùng lịch
          const hasConflict = checkTimeConflict([...workshops, ...pendingWorkshops], newWorkshop);
          if (hasConflict) {
            message.error("Đã có workshop khác diễn ra tại địa điểm này trong khoảng thời gian đã chọn");
            setLoading(false);
            return;
          }

          // Xử lý file hình ảnh từ Upload component
          let imageFile = null;
          if (values.image && values.image.length > 0) {
            imageFile = values.image[0].originFileObj;
          }

          // Chuẩn bị dữ liệu để gửi lên API
          const formData = new FormData();
          formData.append("WorkshopName", values.name);
          formData.append("LocationId", values.locationId);
          formData.append("StartDate", formattedDate);
          formData.append("StartTime", startTime);
          formData.append("EndTime", endTime);
          formData.append("Price", ticketPrice);
          formData.append("Capacity", ticketSlots);
          formData.append("Description", values.description || "");
          formData.append("Status", "Pending");

          // Lấy thông tin người dùng từ localStorage
          const userName = localStorage.getItem("userName");
          const userEmail = localStorage.getItem("userEmail");
          formData.append("MasterName", userName || "Unknown Master");
          formData.append("MasterAccount", userEmail || "unknown@example.com");

          if (imageFile) {
            formData.append("ImageUrl", imageFile);
          }

          console.log("Dữ liệu gửi đi:", {
            name: values.name,
            locationId: values.locationId,
            date: formattedDate,
            startTime: startTime,
            endTime: endTime,
            price: ticketPrice,
            capacity: ticketSlots,
            description: values.description,
            hasImage: !!imageFile
          });

          try {
            // Gọi API để tạo workshop mới
            const result = await createWorkshop(formData);
            console.log("Kết quả từ API:", result);

            if (result) {
              message.success("Đã tạo mới hội thảo thành công");
              refreshData();
              setIsCreateModalOpen(false);
            } else {
              message.error("Không thể tạo hội thảo. Vui lòng thử lại.");
            }
          } catch (apiError) {
            console.error("Lỗi API:", apiError);

            // Xử lý lỗi 401
            if (apiError.message.includes("đăng nhập")) {
              message.error(apiError.message);
              navigate("/login");
              return;
            }

            const errorMessage =
              apiError.response?.data?.message ||
              apiError.message ||
              "Lỗi không xác định";
            message.error("Lỗi API: " + errorMessage);
          }
        } catch (err) {
          console.error("Lỗi khi tạo workshop:", err);
          message.error(
            "Đã xảy ra lỗi khi tạo hội thảo: " +
              (err.message || "Lỗi không xác định")
          );
        } finally {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log("Validation failed:", err);
      });
  };

  const handlePageChange = (page) => {
    if (activeTab === "1") {
      setCurrentPage(page);
    } else if (activeTab === "2") {
      setPendingCurrentPage(page);
    } else if (activeTab === "3") {
      setRejectedCurrentPage(page);
    }
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  // Hàm lấy màu cho trạng thái
  const getStatusColor = (status) => {
    switch (status) {
      case "Đang diễn ra":
        return "green";
      case "Sắp diễn ra":
        return "blue";
      case "Đã kết thúc":
        return "gray";
      case "Đã hủy":
        return "red";
      case "Chờ duyệt":
        return "orange"; // Màu cam cho trạng thái chờ duyệt
      case "Từ chối":
        return "red"; // Màu đỏ cho trạng thái từ chối
      default:
        return "default";
    }
  };

  // Update the columns definition
  const columns = [
    {
      title: "Tên hội thảo",
      dataIndex: "name",
      key: "name",
      width: "20%",
    },
    {
      title: "Địa điểm",
      dataIndex: "location",
      key: "location",
      width: "15%",
      render: (location) => (
        <div className="flex items-center">
          <MapPin size={16} className="mr-2 text-gray-500" />
          {location}
        </div>
      ),
    },
    {
      title: "Thời gian",
      key: "time",
      width: "20%",
      render: (_, record) => (
        <div>
          <div className="flex items-center mb-1">
            <Calendar size={16} className="mr-2 text-gray-500" />
            {record.date}
          </div>
          <div className="text-sm text-gray-500">
            {record.startTime} - {record.endTime}
          </div>
        </div>
      ),
    },
    {
      title: "Giá vé",
      dataIndex: "ticketPrice",
      key: "ticketPrice",
      width: "15%",
      render: (price) => (
        <div className="flex items-center">
          <Ticket size={16} className="mr-2 text-gray-500" />
          {typeof price === 'number' ? price.toLocaleString("vi-VN") + " VND" : price}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "15%",
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: "15%",
      render: (_, record) => (
        <div className="flex gap-2">
          <CustomButton
            type="primary"
            size="small"
            onClick={() => handleViewWorkshop(record)}
            icon={<Eye size={14} />}
          >
            Xem
          </CustomButton>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        title="Quản lý hội thảo"
        description="Báo cáo và tổng quan về các hội thảo của bạn"
      />

      {/* Main Content */}
      <div id="main-content" className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <div className="flex gap-3">
            <CustomButton
              type="primary"
              icon={<Plus size={16} />}
              onClick={handleOpenCreateModal}
            >
              Tạo mới hội thảo
            </CustomButton>
          </div>
          <SearchBar onSearch={handleSearch} />
        </div>

        {error && <Error message={error} />}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Tabs defaultActiveKey="1" onChange={handleTabChange}>
            <TabPane tab="Hội thảo đã duyệt" key="1">
              <WorkshopTable
                workshops={workshops}
                onViewWorkshop={handleViewWorkshop}
                loading={loading}
                pagination={{
                  current: currentPage,
                  total: workshops.length,
                  pageSize: pageSize,
                  showSizeChanger: true,
                  showTotal: (total) => `Tổng số ${total} hội thảo`,
                  onChange: (page, pageSize) => {
                    setCurrentPage(page);
                    setPageSize(pageSize);
                  },
                }}
              />
              <div className="p-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(workshops.length / pageSize)}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                  }}
                />
              </div>
            </TabPane>
            <TabPane
              tab={`Hội thảo chờ duyệt (${pendingWorkshops.length})`}
              key="2"
            >
              <WorkshopTable
                workshops={pendingWorkshops}
                onViewWorkshop={handleViewWorkshop}
                loading={loading}
                pagination={{
                  current: pendingCurrentPage,
                  total: pendingWorkshops.length,
                  pageSize: pageSize,
                  showSizeChanger: true,
                  showTotal: (total) => `Tổng số ${total} hội thảo`,
                  onChange: (page, pageSize) => {
                    setPendingCurrentPage(page);
                    setPageSize(pageSize);
                  },
                }}
              />
              <div className="p-4">
                <Pagination
                  currentPage={pendingCurrentPage}
                  totalPages={Math.ceil(pendingWorkshops.length / pageSize)}
                  onPageChange={(page) => {
                    setPendingCurrentPage(page);
                  }}
                />
              </div>
            </TabPane>
            <TabPane
              tab={`Hội thảo bị từ chối (${rejectedWorkshops.length})`}
              key="3"
            >
              <WorkshopTable
                workshops={rejectedWorkshops}
                onViewWorkshop={handleViewWorkshop}
                loading={loading}
                pagination={{
                  current: rejectedCurrentPage,
                  total: rejectedWorkshops.length,
                  pageSize: pageSize,
                  showSizeChanger: true,
                  showTotal: (total) => `Tổng số ${total} hội thảo`,
                  onChange: (page, pageSize) => {
                    setRejectedCurrentPage(page);
                    setPageSize(pageSize);
                  },
                }}
              />
              <div className="p-4">
                <Pagination
                  currentPage={rejectedCurrentPage}
                  totalPages={Math.ceil(rejectedWorkshops.length / pageSize)}
                  onPageChange={(page) => {
                    setRejectedCurrentPage(page);
                  }}
                />
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>

      {/* Modal tạo workshop mới */}
      <Modal
        title={<div className="text-xl font-semibold">Tạo mới hội thảo</div>}
        open={isCreateModalOpen}
        onCancel={handleCloseCreateModal}
        footer={null}
        width={700}
        className="workshop-modal"
      >
        <div className="p-4">
          <WorkshopForm form={form} loading={loading} locations={locations} />

          <div className="flex justify-end gap-3 mt-6">
            <CustomButton onClick={handleCloseCreateModal}>Hủy bỏ</CustomButton>
            <CustomButton
              type="primary"
              onClick={handleSaveWorkshop}
              loading={loading}
            >
              Tạo mới
            </CustomButton>
          </div>
        </div>
      </Modal>

      {/* Modal xem chi tiết workshop */}
      <Modal
        title={<div className="text-xl font-semibold">{selectedWorkshop?.name || "Chi tiết hội thảo"}</div>}
        open={isViewModalOpen}
        onCancel={handleCloseViewModal}
        footer={null}
        width={800}
        className="workshop-modal"
      >
        {selectedWorkshop && (
          <div className="p-4">
            <div className="text-center mb-8">
              {selectedWorkshop.imageUrl ? (
                <img
                  src={selectedWorkshop.imageUrl}
                  alt={selectedWorkshop.name}
                  className="max-h-[300px] w-auto mx-auto object-contain rounded-lg shadow-lg"
                  onError={(e) => {
                    console.error("Lỗi tải hình ảnh:", e);
                    console.log("URL hình ảnh bị lỗi:", selectedWorkshop.imageUrl);
                    e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_15ba800aa21%20text%20%7B%20fill%3A%23999%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_15ba800aa21%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23E5E5E5%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22277%22%20y%3D%22217.7%22%3EKh%C3%B4ng%20c%C3%B3%20h%C3%ACnh%20%E1%BA%A3nh%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E";
                  }}
                />
              ) : (
                <div className="bg-gray-100 h-[200px] rounded-lg flex items-center justify-center text-gray-400">
                  <span>Không có hình ảnh</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">{selectedWorkshop.name}</h3>
              <Tag
                color={getStatusColor(selectedWorkshop.status)}
                className="text-sm px-3 py-1"
              >
                {selectedWorkshop.status}
              </Tag>
            </div>

            <div className="grid grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg mb-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-500 uppercase tracking-wider">Ngày tổ chức</p>
                <p className="text-base font-medium text-gray-800 flex items-center">
                  <Calendar size={16} className="mr-2 text-gray-500" />
                  {selectedWorkshop.date}
                </p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-500 uppercase tracking-wider">Địa điểm</p>
                <p className="text-base font-medium text-gray-800 flex items-center">
                  <MapPin size={16} className="mr-2 text-gray-500" />
                  {selectedWorkshop.location}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-500 uppercase tracking-wider">Thời gian</p>
                <div>
                  <p className="text-base font-medium text-gray-800 flex items-center mb-1">
                    <Clock size={16} className="mr-2 text-gray-500" />
                    Bắt đầu: {selectedWorkshop.startTime ? selectedWorkshop.startTime.substring(0, 5) : "Chưa có thông tin"}
                  </p>
                  <p className="text-base font-medium text-gray-800 flex items-center">
                    <Clock size={16} className="mr-2 text-gray-500" />
                    Kết thúc: {selectedWorkshop.endTime ? selectedWorkshop.endTime.substring(0, 5) : "Chưa có thông tin"}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-500 uppercase tracking-wider">Giá vé</p>
                <p className="text-base font-medium text-gray-800 flex items-center">
                  <Ticket size={16} className="mr-2 text-gray-500" />
                  {typeof selectedWorkshop.price === 'number' 
                    ? selectedWorkshop.price.toLocaleString("vi-VN") + " VND" 
                    : (selectedWorkshop.ticketPrice || "Chưa có thông tin")}
                </p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-500 uppercase tracking-wider">Số lượng vé</p>
                <p className="text-base font-medium text-gray-800 flex items-center">
                  <Info size={16} className="mr-2 text-gray-500" />
                  {selectedWorkshop.capacity !== undefined ? selectedWorkshop.capacity : (
                    selectedWorkshop.ticketSlots || "Chưa có thông tin"
                  )}
                </p>
              </div>

              {selectedWorkshop.masterName && (
                <div className="space-y-2 col-span-2">
                  <p className="text-sm text-gray-500 uppercase tracking-wider">Master phụ trách</p>
                  <p className="text-base font-medium text-gray-800">
                    {selectedWorkshop.masterName}
                  </p>
                </div>
              )}
            </div>

            {/* Phần mô tả */}
            {selectedWorkshop.description && (
              <div className="space-y-4 bg-white p-6 rounded-lg border border-gray-100">
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Mô tả hội thảo</p>
                  <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded">
                    {selectedWorkshop.description}
                  </p>
                </div>
              </div>
            )}

            {/* Hiển thị lý do từ chối nếu workshop bị từ chối */}
            {selectedWorkshop.status === "Từ chối" && (
              <div className="mt-6 bg-red-50 p-4 rounded-lg border border-red-100">
                <h4 className="text-md font-medium mb-2 text-red-500">
                  Lý do từ chối
                </h4>
                {(() => {
                  try {
                    const rejectionHistory = JSON.parse(
                      localStorage.getItem("rejectionHistory") || "{}"
                    );
                    const rejectionInfo = rejectionHistory[selectedWorkshop.id];
                    if (rejectionInfo && rejectionInfo.reason) {
                      return (
                        <div>
                          <p className="text-gray-700">
                            {rejectionInfo.reason}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Từ chối vào:{" "}
                            {new Date(rejectionInfo.timestamp).toLocaleString(
                              "vi-VN"
                            )}
                          </p>
                        </div>
                      );
                    } else {
                      return (
                        <p className="text-gray-600">
                          Không có thông tin về lý do từ chối.
                        </p>
                      );
                    }
                  } catch (e) {
                    console.error("Lỗi khi đọc lý do từ chối:", e);
                    return (
                      <p className="text-gray-600">
                        Không thể hiển thị lý do từ chối.
                      </p>
                    );
                  }
                })()}
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <CustomButton type="primary" onClick={handleCloseViewModal}>
                Đóng
              </CustomButton>
            </div>
          </div>
        )}
      </Modal>

      <style jsx global>{`
        .workshop-modal .ant-modal-content {
          border-radius: 12px;
          overflow: hidden;
        }
        .workshop-modal .ant-modal-header {
          border-bottom: 1px solid #f0f0f0;
          padding: 16px 24px;
        }
        .workshop-modal .ant-modal-body {
          padding: 12px;
        }
        .workshop-modal .ant-modal-footer {
          border-top: 1px solid #f0f0f0;
        }
      `}</style>
    </div>
  );
};

export default Workshop;
