import React, { useState, useEffect } from "react";
import { FaSearch, FaPlus, FaExclamationCircle } from "react-icons/fa";
import { Button, Modal, Form, Input, InputNumber, Upload, message, Row, Col, Divider, Tag } from "antd";
import SearchBar from "../components/Common/SearchBar";
import Pagination from "../components/Common/Pagination";
import CourseTable from "../components/Course/CourseTable";
import Header from "../components/Common/Header";
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
  // State cho danh sách khóa học
  const [courses, setCourses] = useState([
    {
      id: 1,
      name: "Đại Đạo Chi Giản - Phong Thủy Cổ Học",
      price: 20.5,
      date: "1/5/2021",
      createdAt: "1/5/2021",
      learningObjectives: "Hiểu về nguyên lý cơ bản của phong thủy cổ học",
      description: "Khóa học giới thiệu các khái niệm cơ bản và ứng dụng của phong thủy cổ học trong đời sống hiện đại. Học viên sẽ được tìm hiểu về lịch sử, các nguyên tắc cơ bản và cách áp dụng phong thủy vào không gian sống và làm việc.",
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
      description: "Khóa học đi sâu vào các khái niệm của Kinh Dịch và cách áp dụng trong cuộc sống. Học viên sẽ được học về 64 quẻ, hệ thống Âm Dương và Ngũ Hành, và cách sử dụng kiến thức này để đưa ra quyết định trong cuộc sống.",
      videoUrl: "https://example.com/video2",
      image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1974&auto=format&fit=crop",
      status: "Sắp diễn ra"
    },
    {
      id: 3,
      name: "Phong Thủy Hiện Đại",
      price: 18.9,
      date: "10/7/2021",
      createdAt: "10/7/2021",
      learningObjectives: "Áp dụng phong thủy vào không gian hiện đại",
      description: "Khóa học tập trung vào việc áp dụng các nguyên tắc phong thủy cổ điển vào thiết kế hiện đại. Học viên sẽ được học cách tạo ra không gian sống và làm việc hài hòa, tăng cường năng lượng tích cực và loại bỏ năng lượng tiêu cực.",
      videoUrl: "https://example.com/video3",
      image: "https://images.unsplash.com/photo-1536094627367-b0d7616d0dde?q=80&w=2070&auto=format&fit=crop",
      status: "Đã kết thúc"
    },
    {
      id: 4,
      name: "Cơ Bản Về Tử Vi",
      price: 30.2,
      date: "20/8/2021",
      createdAt: "20/8/2021",
      learningObjectives: "Hiểu rõ về lá số tử vi và cách luận giải cơ bản",
      description: "Khóa học cung cấp kiến thức nền tảng về Tử Vi học. Học viên sẽ được học cách lập và đọc lá số tử vi, hiểu về các cung mệnh, sao chiếu và cách luận giải các yếu tố ảnh hưởng đến vận mệnh con người.",
      videoUrl: "https://example.com/video4",
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1974&auto=format&fit=crop",
      status: "Đang hoạt động"
    },
  ]);

  // State cho trang hiện tại
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(""); // Để hiển thị lỗi nếu có
  
  // Form và state cho modal
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  
  // State cho trạng thái modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Xử lý chức năng tìm kiếm
  const handleSearch = (searchTerm) => {
    console.log("Searching for:", searchTerm);
    // Thực hiện logic tìm kiếm ở đây
  };

  // Xử lý thêm khóa học mới
  const handleOpenCreateModal = () => {
    setSelectedCourse(null);
    form.resetFields();
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleSaveCourse = () => {
    form.validateFields().then((values) => {
      setLoading(true);
      
      setTimeout(() => {
        // Tạo một khóa học mới với ID tự động tăng
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
        
        // Thêm khóa học mới vào danh sách
        setCourses([...courses, newCourse]);
        
        // Đóng modal và hiển thị thông báo
        message.success("Đã tạo mới khóa học thành công");
        setLoading(false);
        setIsCreateModalOpen(false);
      }, 1000);
    });
  };

  // Xử lý modal xem chi tiết
  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedCourse(null);
  };

  // Xử lý cập nhật và xóa khóa học
  const handleUpdateCourse = (course) => {
    console.log("Updating course:", course);
    // Logic cập nhật khóa học
  };

  const handleDeleteCourse = (course) => {
    console.log("Deleting course:", course.id);
    // Logic xóa khóa học
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    console.log("Changing to page:", page);
  };

  // Hàm lấy màu cho trạng thái
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
    <div className="min-h-screen bg-gray-50 relative">
      <Header 
        title="Quản lý khóa học"
        description="Báo cáo và tổng quan về khóa học của bạn"
      />

      {/* Main Content */}
      <div id="main-content" className="p-6">
        {/* Header với nút thêm mới và thanh tìm kiếm */}
        <div className="mb-6 flex justify-between items-center">
          <Button 
            type="primary" 
            icon={<FaPlus />}
            onClick={handleOpenCreateModal}
          >
            Thêm khóa học mới
          </Button>
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Hiển thị lỗi nếu có */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <span className="font-bold">Lỗi: </span> {error}
          </div>
        )}

        {/* Bảng danh sách khóa học */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <CourseTable
            courses={courses}
            onViewCourse={handleViewCourse}
            onUpdateCourse={handleUpdateCourse}
            onDeleteCourse={handleDeleteCourse}
          />
        </div>

        {/* Phân trang */}
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
            <Button onClick={handleCloseCreateModal}>
              Hủy bỏ
            </Button>
            <Button type="primary" onClick={handleSaveCourse} loading={loading}>
              Tạo mới
            </Button>
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
              {/* Cột bên trái cho hình ảnh */}
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
              
              {/* Cột bên phải cho thông tin */}
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
            
            {/* Phần mô tả */}
            {selectedCourse.description && (
              <div className="mb-4">
                <h4 className="text-md font-medium mb-2">Mô tả khóa học</h4>
                <p className="text-gray-600">{selectedCourse.description}</p>
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