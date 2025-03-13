import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Modal, Form, Input, Select, InputNumber, Upload, DatePicker, message, Row, Col, Tag, Divider, Tabs } from "antd";
import { UploadCloud, Plus, Calendar, MapPin, Ticket, Info } from "lucide-react";
import WorkshopTable from "../components/Workshop/WorkshopTable";
import SearchBar from "../components/Common/SearchBar";
import Pagination from "../components/Common/Pagination";
import Header from "../components/Common/Header";
import Error from "../components/Common/Error";
import CustomButton from "../components/Common/CustomButton";
import { 
  getAllWorkshops, 
  getWorkshopById, 
  createWorkshop, 
  updateWorkshop, 
  deleteWorkshop,
  formatWorkshopsData
} from "../services/workshopmaster.service";
import { getPendingWorkshops, formatPendingWorkshopsData } from "../services/approve.service";
import { isAuthenticated } from "../services/auth.service";

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

// Component form cho workshop
const WorkshopForm = ({ form, loading }) => {
  return (
    <Form
      form={form}
      layout="vertical"
      disabled={loading}
    >
      <Form.Item
        label="Tên hội thảo"
        name="name"
        rules={[{ required: true, message: "Vui lòng nhập tên hội thảo" }]}
      >
        <Input placeholder="Nhập tên hội thảo" />
      </Form.Item>

      <Form.Item
        label="Địa điểm"
        name="location"
        rules={[{ required: true, message: "Vui lòng nhập địa điểm" }]}
      >
        <Input placeholder="Nhập địa điểm tổ chức hội thảo" />
      </Form.Item>

      <Form.Item
        label="Ngày tổ chức"
        name="date"
        rules={[{ required: true, message: "Vui lòng chọn ngày tổ chức" }]}
      >
        <DatePicker 
          format="DD/MM/YYYY" 
          style={{ width: '100%' }} 
          placeholder="Chọn ngày tổ chức"
        />
      </Form.Item>

      <Form.Item
        label="Giá vé"
        name="ticketPrice"
        rules={[{ required: true, message: "Vui lòng nhập giá vé" }]}
      >
        <Input placeholder="Nhập giá vé (VD: 300.000 VND)" />
      </Form.Item>

      <Form.Item
        label="Số lượng vé"
        name="ticketSlots"
        rules={[{ required: true, message: "Vui lòng nhập số lượng vé" }]}
      >
        <InputNumber min={1} placeholder="Nhập số lượng vé" style={{ width: '100%' }} />
      </Form.Item>

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
        <Upload
          listType="picture-card"
          maxCount={1}
          beforeUpload={() => false}
        >
          <div className="flex flex-col items-center">
            <UploadCloud className="w-6 h-6 text-gray-400" />
            <div className="mt-2">Upload</div>
          </div>
        </Upload>
      </Form.Item>

      <Form.Item
        label="Mô tả hội thảo"
        name="description"
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

  // Kiểm tra xác thực khi component mount
  useEffect(() => {
    if (!isAuthenticated()) {
      message.error("Bạn cần đăng nhập để sử dụng chức năng này");
      navigate("/login");
      return;
    }
    fetchWorkshops();
    fetchPendingWorkshops();
  }, [navigate]);

  // Thêm useEffect để refresh danh sách workshop khi quay lại từ trang WorkshopCheck
  useEffect(() => {
    const refreshOnFocus = () => {
      console.log("Trang được focus lại, refresh danh sách workshop");
      refreshData();
    };

    // Đăng ký sự kiện focus
    window.addEventListener('focus', refreshOnFocus);

    // Cleanup
    return () => {
      window.removeEventListener('focus', refreshOnFocus);
    };
  }, []);

  // Hàm fetch workshops từ API
  const fetchWorkshops = async () => {
    try {
      setLoading(true);
      const data = await getAllWorkshops();
      const formattedData = formatWorkshopsData(data);
      
      // Lọc các workshop đã bị từ chối
      const rejected = formattedData.filter(workshop => workshop.status === "Từ chối");
      setRejectedWorkshops(rejected);
      setRejectedTotalPages(Math.ceil(rejected.length / 10));
      
      // Lọc các workshop không bị từ chối và không phải chờ duyệt để hiển thị ở tab 1
      const approved = formattedData.filter(workshop => 
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
      const formattedData = formatPendingWorkshopsData(data);
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
      
      message.error("Không thể tải danh sách hội thảo chờ phê duyệt. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    // Xử lý tìm kiếm ở đây
    console.log('Searching for:', searchTerm);
    // Có thể thêm logic tìm kiếm từ API ở đây
  };

  const handleOpenCreateModal = () => {
    form.resetFields();
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleViewWorkshop = async (workshop) => {
    try {
      setLoading(true);
      // Lấy thông tin chi tiết từ API nếu cần
      const detailData = await getWorkshopById(workshop.id);
      if (detailData) {
        // Format dữ liệu nếu cần
        const formattedWorkshop = {
          ...workshop,
          // Thêm các thông tin chi tiết khác nếu có
        };
        setSelectedWorkshop(formattedWorkshop);
        setIsViewModalOpen(true);
      }
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết workshop:", err);
      
      // Xử lý lỗi 401
      if (err.message.includes("đăng nhập")) {
        message.error(err.message);
        navigate("/login");
        return;
      }
      
      message.error("Không thể tải thông tin chi tiết hội thảo");
    } finally {
      setLoading(false);
    }
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

  const handleSaveWorkshop = () => {
    // Kiểm tra xác thực trước khi tạo workshop
    if (!isAuthenticated()) {
      message.error("Bạn cần đăng nhập để tạo hội thảo");
      navigate("/login");
      return;
    }

    form.validateFields().then(async (values) => {
      try {
        setLoading(true);
        
        // Xử lý giá vé
        let ticketPrice = 0;
        if (values.ticketPrice) {
          // Loại bỏ tất cả các ký tự không phải số
          const numericValue = values.ticketPrice.replace(/[^\d]/g, '');
          ticketPrice = numericValue ? parseFloat(numericValue) : 0;
        }
        
        // Chuẩn bị dữ liệu để gửi lên API
        const workshopData = {
          name: values.name,
          location: values.location,
          date: values.date ? values.date.format('YYYY-MM-DD') : new Date().toISOString().split('T')[0],
          ticketPrice: ticketPrice,
          ticketSlots: values.ticketSlots,
          description: values.description || ""
        };
        
        console.log("Dữ liệu gửi đi:", workshopData);
        
        try {
          // Gọi API để tạo workshop mới
          const result = await createWorkshop(workshopData);
          console.log("Kết quả từ API:", result);
          
          if (result) {
            message.success("Đã tạo mới hội thảo thành công");
            refreshData(); // Refresh cả hai danh sách
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
          
          const errorMessage = apiError.response?.data?.message || apiError.message || "Lỗi không xác định";
          message.error("Lỗi API: " + errorMessage);
        }
      } catch (err) {
        console.error("Lỗi khi tạo workshop:", err);
        message.error("Đã xảy ra lỗi khi tạo hội thảo: " + (err.message || "Lỗi không xác định"));
      } finally {
        setLoading(false);
      }
    }).catch(err => {
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
        return "orange";
      case "Từ chối":
        return "volcano"; // Màu đỏ cam cho trạng thái từ chối
      default:
        return "default";
    }
  };

  const handleCheckPendingWorkshops = () => {
    navigate('/workshop-check');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#B89D71] p-4">
        <h1 className="text-white text-xl font-semibold">Quản lý hội thảo</h1>
        <p className="text-white/80 text-sm">Báo cáo và tổng quan về các hội thảo của bạn</p>
      </div>

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
            {pendingWorkshops.length > 0 && (
              <CustomButton 
                onClick={handleCheckPendingWorkshops}
              >
                Kiểm duyệt hội thảo ({pendingWorkshops.length})
              </CustomButton>
            )}
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
              />
              <div className="p-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </TabPane>
            <TabPane tab={`Hội thảo chờ duyệt (${pendingWorkshops.length})`} key="2">
              <WorkshopTable 
                workshops={pendingWorkshops} 
                onViewWorkshop={handleViewWorkshop}
                loading={loading}
              />
              <div className="p-4">
                <Pagination
                  currentPage={pendingCurrentPage}
                  totalPages={pendingTotalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </TabPane>
            <TabPane tab={`Hội thảo bị từ chối (${rejectedWorkshops.length})`} key="3">
              <WorkshopTable 
                workshops={rejectedWorkshops} 
                onViewWorkshop={handleViewWorkshop}
                loading={loading}
              />
              <div className="p-4">
                <Pagination
                  currentPage={rejectedCurrentPage}
                  totalPages={rejectedTotalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>

      {/* Modal tạo workshop mới */}
      <Modal
        title={
          <div className="text-xl font-semibold">
            Tạo mới hội thảo
          </div>
        }
        open={isCreateModalOpen}
        onCancel={handleCloseCreateModal}
        footer={null}
        width={700}
        className="workshop-modal"
      >
        <div className="p-4">
          <WorkshopForm
            form={form}
            loading={loading}
          />
          
          <div className="flex justify-end gap-3 mt-6">
            <CustomButton onClick={handleCloseCreateModal}>
              Hủy bỏ
            </CustomButton>
            <CustomButton type="primary" onClick={handleSaveWorkshop} loading={loading}>
              Tạo mới
            </CustomButton>
          </div>
        </div>
      </Modal>

      {/* Modal xem chi tiết workshop */}
      <Modal
        title={
          <div className="text-xl font-semibold">
            Chi tiết hội thảo
          </div>
        }
        open={isViewModalOpen}
        onCancel={handleCloseViewModal}
        footer={null}
        width={800}
        className="workshop-modal"
      >
        {selectedWorkshop && (
          <div className="p-4">
            <Row gutter={[24, 24]}>
              {/* Cột bên trái cho hình ảnh */}
              <Col xs={24} md={12}>
                <div className="rounded-lg overflow-hidden h-64 bg-gray-200 mb-4">
                  <img 
                    src={selectedWorkshop.image} 
                    alt={selectedWorkshop.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {e.target.src = "https://via.placeholder.com/400x300?text=Workshop+Image"}}
                  />
                </div>
                <Tag color={getStatusColor(selectedWorkshop.status)} className="text-sm px-3 py-1">
                  {selectedWorkshop.status}
                </Tag>
              </Col>
              
              {/* Cột bên phải cho thông tin */}
              <Col xs={24} md={12}>
                <h3 className="text-xl font-semibold mb-4">{selectedWorkshop.name}</h3>
                
                <div className="mb-3 flex items-center">
                  <Calendar size={16} className="text-gray-500 mr-2" />
                  <span>{selectedWorkshop.date}</span>
                </div>
                
                <div className="mb-3 flex items-center">
                  <MapPin size={16} className="text-gray-500 mr-2" />
                  <span>{selectedWorkshop.location}</span>
                </div>
                
                <div className="mb-3 flex items-center">
                  <Ticket size={16} className="text-gray-500 mr-2" />
                  <span>Giá vé: {selectedWorkshop.ticketPrice}</span>
                </div>
                
                <div className="mb-3 flex items-center">
                  <Info size={16} className="text-gray-500 mr-2" />
                  <span>Số lượng vé: {selectedWorkshop.ticketSlots}</span>
                </div>
              </Col>
            </Row>
            
            <Divider className="my-4" />
            
            {/* Phần mô tả */}
            {selectedWorkshop.description && (
              <div className="mb-4">
                <h4 className="text-md font-medium mb-2">Mô tả hội thảo</h4>
                <p className="text-gray-600">{selectedWorkshop.description}</p>
              </div>
            )}
            
            {/* Hiển thị lý do từ chối nếu workshop bị từ chối */}
            {selectedWorkshop.status === "Từ chối" && (
              <div className="mb-4">
                <h4 className="text-md font-medium mb-2 text-red-500">Lý do từ chối</h4>
                {(() => {
                  try {
                    const rejectionHistory = JSON.parse(localStorage.getItem('rejectionHistory') || '{}');
                    const rejectionInfo = rejectionHistory[selectedWorkshop.id];
                    if (rejectionInfo && rejectionInfo.reason) {
                      return (
                        <div>
                          <p className="text-gray-600">{rejectionInfo.reason}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            Từ chối vào: {new Date(rejectionInfo.timestamp).toLocaleString('vi-VN')}
                          </p>
                        </div>
                      );
                    } else {
                      return <p className="text-gray-600">Không có thông tin về lý do từ chối.</p>;
                    }
                  } catch (e) {
                    console.error("Lỗi khi đọc lý do từ chối:", e);
                    return <p className="text-gray-600">Không thể hiển thị lý do từ chối.</p>;
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