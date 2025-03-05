import React, { useState } from "react";
import { FaSearch, FaPlus } from "react-icons/fa";
import { Modal, Form, Input, InputNumber, Upload, message, Row, Col, Divider, Tag } from "antd";
import SearchBar from "../components/Common/SearchBar";
import Pagination from "../components/Common/Pagination";
import CustomTable from "../components/Common/CustomTable";
import Header from "../components/Common/Header";
import Error from "../components/Common/Error";
import CustomButton from "../components/Common/CustomButton";
import { UploadCloud, Book, Calendar, DollarSign, Award, FileText } from "lucide-react";

const { TextArea } = Input;

// Component form cho khóa học
const CourseForm = ({ form, initialData, loading }) => {
  return (
    <Form
      form={form}
      layout="vertical"
      disabled={loading}
      initialValues={initialData}
    >
      <Form.Item
        label="Tên khóa học"
        name="name"
        rules={[{ required: true, message: "Vui lòng nhập tên khóa học" }]}
      >
        <Input placeholder="Nhập tên khóa học" />
      </Form.Item>

      <Form.Item
        label="Giá"
        name="price"
        rules={[{ required: true, message: "Vui lòng nhập giá khóa học" }]}
      >
        <InputNumber
          placeholder="Nhập giá khóa học"
          min={0}
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item
        label="Mục tiêu học tập"
        name="learningObjectives"
        rules={[{ required: true, message: "Vui lòng nhập mục tiêu học tập" }]}
      >
        <TextArea
          placeholder="Nhập mục tiêu học tập của khóa học"
          autoSize={{ minRows: 3, maxRows: 6 }}
        />
      </Form.Item>

      <Form.Item
        label="Mô tả"
        name="description"
        rules={[{ required: true, message: "Vui lòng nhập mô tả khóa học" }]}
      >
        <TextArea
          placeholder="Nhập mô tả khóa học"
          autoSize={{ minRows: 3, maxRows: 6 }}
        />
      </Form.Item>

      <Form.Item
        label="URL Video"
        name="videoUrl"
      >
        <Input placeholder="Nhập URL video giới thiệu khóa học" />
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
    </Form>
  );
};

const CourseMaster = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [form] = Form.useForm();

  const [courses, setCourses] = useState([
    {
      id: 1,
      name: "Đại Đạo Chi Giản - Phong Thủy Cổ Học",
      price: 20.5,
      date: "1/5/2021",
      createdAt: "1/5/2021",
      learningObjectives: "Hiểu về nguyên lý cơ bản của phong thủy cổ học",
      description: "Khóa học giới thiệu các khái niệm cơ bản và ứng dụng của phong thủy cổ học trong đời sống hiện đại.",
      videoUrl: "https://example.com/video1",
      image: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?q=80&w=2070&auto=format&fit=crop",
      status: "Đang hoạt động"
    },
    {
      id: 2,
      name: "Kinh Dịch Ứng Dụng",
      price: 25.8,
      date: "15/6/2021",
      createdAt: "15/6/2021",
      learningObjectives: "Nắm vững các khái niệm cơ bản về Kinh Dịch và ứng dụng thực tiễn",
      description: "Khóa học đi sâu vào các khái niệm của Kinh Dịch và cách áp dụng trong cuộc sống.",
      videoUrl: "https://example.com/video2",
      image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1974&auto=format&fit=crop",
      status: "Sắp diễn ra"
    }
  ]);

  // Định nghĩa cột cho bảng
  const columns = [
    {
      title: "Tên khóa học",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price}`,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <CustomButton 
            type="primary" 
            size="small"
            onClick={() => handleViewCourse(record)}
          >
            Xem chi tiết
          </CustomButton>
          <CustomButton 
            type="default" 
            size="small"
            onClick={() => handleUpdateCourse(record)}
          >
            Cập nhật
          </CustomButton>
          <CustomButton 
            type="primary" 
            danger 
            size="small"
            onClick={() => handleDeleteCourse(record)}
          >
            Xóa
          </CustomButton>
        </div>
      ),
    },
  ];

  const handleOpenCreateModal = () => {
    form.resetFields();
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleSearch = (searchTerm) => {
    console.log("Searching for:", searchTerm);
  };

  const handleSaveCourse = () => {
    form.validateFields().then((values) => {
      setLoading(true);
      
      setTimeout(() => {
        const newCourse = {
          id: courses.length + 1,
          name: values.name,
          price: values.price || 20.5,
          date: new Date().toLocaleDateString(),
          createdAt: new Date().toLocaleDateString(),
          learningObjectives: values.learningObjectives || "",
          description: values.description || "",
          videoUrl: values.videoUrl || "",
          image: values.image || "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?q=80&w=2070&auto=format&fit=crop",
          status: "Đang hoạt động"
        };
        
        setCourses([...courses, newCourse]);
        message.success("Đã tạo mới khóa học thành công");
        setLoading(false);
        setIsCreateModalOpen(false);
      }, 1000);
    });
  };

  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedCourse(null);
  };

  const handleUpdateCourse = (course) => {
    console.log("Updating course:", course);
  };

  const handleDeleteCourse = (course) => {
    const updatedCourses = courses.filter(c => c.id !== course.id);
    setCourses(updatedCourses);
    message.success("Đã xóa khóa học thành công");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Đang hoạt động":
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
      <Header 
        title="Quản lý khóa học"
        description="Báo cáo và tổng quan về khóa học của bạn"
      />

      <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <CustomButton 
            type="primary" 
            icon={<FaPlus />}
            onClick={handleOpenCreateModal}
          >
            Thêm khóa học mới
          </CustomButton>
          <SearchBar onSearch={handleSearch} />
        </div>

        {error && <Error message={error} />}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <CustomTable 
            columns={columns}
            dataSource={courses}
            loading={loading}
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

      {/* Modal tạo khóa học mới */}
      <Modal
        title={
          <div className="text-xl font-semibold">
            Tạo mới khóa học
          </div>
        }
        open={isCreateModalOpen}
        onCancel={handleCloseCreateModal}
        footer={null}
        width={700}
        className="course-modal"
      >
        <div className="p-4">
          <CourseForm
            form={form}
            loading={loading}
          />
          
          <div className="flex justify-end gap-3 mt-6">
            <CustomButton onClick={handleCloseCreateModal}>
              Hủy bỏ
            </CustomButton>
            <CustomButton type="primary" onClick={handleSaveCourse} loading={loading}>
              Tạo mới
            </CustomButton>
          </div>
        </div>
      </Modal>

      {/* Modal xem chi tiết khóa học */}
      <Modal
        title={
          <div className="text-xl font-semibold">
            Chi tiết khóa học
          </div>
        }
        open={isViewModalOpen}
        onCancel={handleCloseViewModal}
        footer={null}
        width={800}
        className="course-modal"
      >
        {selectedCourse && (
          <div className="p-4">
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <div className="rounded-lg overflow-hidden h-64 bg-gray-200 mb-4">
                  <img 
                    src={selectedCourse.image} 
                    alt={selectedCourse.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {e.target.src = "https://via.placeholder.com/400x300?text=Course+Image"}}
                  />
                </div>
                <Tag color={getStatusColor(selectedCourse.status)} className="text-sm px-3 py-1">
                  {selectedCourse.status}
                </Tag>
              </Col>
              
              <Col xs={24} md={12}>
                <h3 className="text-xl font-semibold mb-4">{selectedCourse.name}</h3>
                
                <div className="mb-3 flex items-center">
                  <Book size={16} className="text-gray-500 mr-2" />
                  <span>Mục tiêu: {selectedCourse.learningObjectives}</span>
                </div>
                
                <div className="mb-3 flex items-center">
                  <Calendar size={16} className="text-gray-500 mr-2" />
                  <span>Ngày tạo: {selectedCourse.createdAt}</span>
                </div>
                
                <div className="mb-3 flex items-center">
                  <DollarSign size={16} className="text-gray-500 mr-2" />
                  <span>Giá: ${selectedCourse.price}</span>
                </div>
                
                {selectedCourse.videoUrl && (
                  <div className="mb-3 flex items-center">
                    <FileText size={16} className="text-gray-500 mr-2" />
                    <span>Video: <a href={selectedCourse.videoUrl} target="_blank" rel="noopener noreferrer">Xem video</a></span>
                  </div>
                )}
              </Col>
            </Row>
            
            <Divider className="my-4" />
            
            {selectedCourse.description && (
              <div className="mb-4">
                <h4 className="text-md font-medium mb-2">Mô tả khóa học</h4>
                <p className="text-gray-600">{selectedCourse.description}</p>
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
        .course-modal .ant-modal-content {
          border-radius: 12px;
          overflow: hidden;
        }
        .course-modal .ant-modal-header {
          border-bottom: 1px solid #f0f0f0;
          padding: 16px 24px;
        }
        .course-modal .ant-modal-body {
          padding: 12px;
        }
        .course-modal .ant-modal-footer {
          border-top: 1px solid #f0f0f0;
        }
      `}</style>
    </div>
  );
};

export default CourseMaster; 