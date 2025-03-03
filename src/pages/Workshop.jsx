import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Modal, Form, Input, Select, InputNumber, Upload, DatePicker, message, Row, Col, Tag, Divider } from "antd";
import { UploadCloud, Plus, Calendar, MapPin, Ticket, Info } from "lucide-react";
import WorkshopTable from "../components/Workshop/WorkshopTable";
import SearchBar from "../components/Common/SearchBar";
import Pagination from "../components/Common/Pagination";
import Header from "../components/Common/Header";

const { TextArea } = Input;
const { Option } = Select;

// Component form cho workshop
const WorkshopForm = ({ form, loading }) => {
  return (
    <Form
      form={form}
      layout="vertical"
      disabled={loading}
    >
      <Form.Item
        label="Tên workshop"
        name="name"
        rules={[{ required: true, message: "Vui lòng nhập tên workshop" }]}
      >
        <Input placeholder="Nhập tên workshop" />
      </Form.Item>

      <Form.Item
        label="Địa điểm"
        name="location"
        rules={[{ required: true, message: "Vui lòng nhập địa điểm" }]}
      >
        <Input placeholder="Nhập địa điểm tổ chức workshop" />
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
        label="Trạng thái"
        name="status"
        rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
      >
        <Select placeholder="Chọn trạng thái workshop">
          <Option value="Sắp diễn ra">Sắp diễn ra</Option>
          <Option value="Đang diễn ra">Đang diễn ra</Option>
          <Option value="Đã kết thúc">Đã kết thúc</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Hình ảnh"
        name="image"
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
        label="Mô tả workshop"
        name="description"
      >
        <TextArea 
          placeholder="Nhập mô tả về workshop"
          autoSize={{ minRows: 3, maxRows: 6 }}
        />
      </Form.Item>
    </Form>
  );
};

const Workshop = () => {
  const [workshops, setWorkshops] = useState([
    {
      id: 1,
      name: "Đại Đạo Chi Giản - Phòng Thủy Cơ Học",
      location: "Đại học FPT",
      date: "1/5/2021",
      image: "https://images.unsplash.com/photo-1529870797170-55aaafe68c6f?q=80&w=1974&auto=format&fit=crop",
      ticketPrice: "300.000 VND",
      ticketSlots: "50",
      status: "Đang diễn ra",
      description: "Workshop về Phong Thủy cổ học và ứng dụng thực tiễn trong cuộc sống hiện đại. Tham gia để học hỏi từ các chuyên gia hàng đầu trong lĩnh vực."
    },
    {
      id: 2,
      name: "Đại Đạo Chi Giản - Phòng Thủy Cơ Học I",
      location: "Đại học FPT",
      date: "1/5/2021",
      image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop",
      ticketPrice: "350.000 VND",
      ticketSlots: "45",
      status: "Sắp diễn ra",
      description: "Tiếp nối thành công của phần 1, workshop mới sẽ đi sâu hơn vào các ứng dụng của Phong Thủy trong thiết kế nội thất và cảnh quan."
    },
    {
      id: 3,
      name: "Đại Đạo Chi Giản - Phòng Thủy Cơ Học II",
      location: "Đại học FPT",
      date: "1/5/2021",
      image: "https://images.unsplash.com/photo-1492538368677-f6e0afe31dcc?q=80&w=1770&auto=format&fit=crop",
      ticketPrice: "400.000 VND",
      ticketSlots: "40",
      status: "Đã kết thúc",
      description: "Workshop tập trung vào Phong Thủy văn phòng và không gian làm việc, giúp tạo ra môi trường làm việc hiệu quả và thịnh vượng."
    },
    {
      id: 4,
      name: "Đại Đạo Chi Giản - Phòng Thủy Cơ Học III",
      location: "Đại học FPT",
      date: "1/5/2021",
      image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?q=80&w=1770&auto=format&fit=crop",
      ticketPrice: "450.000 VND",
      ticketSlots: "35",
      status: "Sắp diễn ra",
      description: "Workshop nâng cao về Phong Thủy, đi sâu vào nghiên cứu các trường hợp thực tế và giải pháp toàn diện cho nhà ở và không gian sống."
    }
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // Để hiển thị lỗi nếu có

  const handleSearch = (searchTerm) => {
    // Xử lý tìm kiếm ở đây
    console.log('Searching for:', searchTerm);
  };

  const handleOpenCreateModal = () => {
    form.resetFields();
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleViewWorkshop = (workshop) => {
    setSelectedWorkshop(workshop);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedWorkshop(null);
  };

  const handleSaveWorkshop = () => {
    form.validateFields().then((values) => {
      setLoading(true);
      
      setTimeout(() => {
        // Tạo một workshop mới với ID tự động tăng
        const newWorkshop = {
          id: workshops.length + 1,
          name: values.name,
          location: values.location,
          date: values.date ? values.date.format('DD/MM/YYYY') : new Date().toLocaleDateString(),
          image: values.image || "default-workshop.jpg",
          ticketPrice: values.ticketPrice,
          ticketSlots: values.ticketSlots,
          status: values.status,
          description: values.description || ""
        };
        
        // Thêm workshop mới vào danh sách
        setWorkshops([...workshops, newWorkshop]);
        
        // Đóng modal và hiển thị thông báo
        message.success("Đã tạo mới workshop thành công");
        setLoading(false);
        setIsCreateModalOpen(false);
      }, 1000);
    }).catch(err => {
      console.log("Validation failed:", err);
    });
  };

  const handleRequestWorkshop = () => {
    // Xử lý yêu cầu workshop mới
    message.info("Đã gửi yêu cầu workshop mới");
    setIsCreateModalOpen(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    console.log("Changing to page:", page);
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
      default:
        return "default";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#B89D71] p-4">
        <h1 className="text-white text-xl font-semibold">Quản lý Workshops</h1>
        <p className="text-white/80 text-sm">Báo cáo và tổng quan về các workshop của bạn</p>
      </div>

      {/* Main Content */}
      <div id="main-content" className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <Button 
            type="primary" 
            icon={<Plus size={16} />}
            onClick={handleOpenCreateModal}
          >
            Tạo mới workshop
          </Button>
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <span className="font-bold">Lỗi: </span> {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <WorkshopTable 
            workshops={workshops} 
            onViewWorkshop={handleViewWorkshop}
          />
        </div>
        
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={5}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* Modal tạo workshop mới */}
      <Modal
        title={
          <div className="text-xl font-semibold">
            Tạo mới workshop
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
            <Button onClick={handleRequestWorkshop}>
              Yêu cầu workshop
            </Button>
            <Button onClick={handleCloseCreateModal}>
              Hủy bỏ
            </Button>
            <Button type="primary" onClick={handleSaveWorkshop} loading={loading}>
              Tạo mới
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal xem chi tiết workshop */}
      <Modal
        title={
          <div className="text-xl font-semibold">
            Chi tiết workshop
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
                <h4 className="text-md font-medium mb-2">Mô tả workshop</h4>
                <p className="text-gray-600">{selectedWorkshop.description}</p>
              </div>
            )}
            
            <div className="flex justify-end gap-3 mt-6">
              <Button type="primary" onClick={handleCloseViewModal}>
                Đóng
              </Button>
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