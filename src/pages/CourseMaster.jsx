import React, { useState, useEffect } from "react";
import { FaSearch, FaPlus, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { Modal, Form, Input, InputNumber, Upload, message, Row, Col, Divider, Tag, Select } from "antd";
import SearchBar from "../components/Common/SearchBar";
import Pagination from "../components/Common/Pagination";
import CustomTable from "../components/Common/CustomTable";
import Header from "../components/Common/Header";
import Error from "../components/Common/Error";
import CustomButton from "../components/Common/CustomButton";
import { UploadCloud, Book, Calendar, DollarSign, Award, FileText, Trash2 } from "lucide-react";
import { getAllCourses, createCourse } from "../services/course.service";
import { formatDate, formatPrice } from '../utils/formatters';

const { TextArea } = Input;

// Component form cho khóa học
const CourseForm = ({ form, initialData, loading, courseCategories }) => {
  return (
    <Form
      form={form}
      layout="vertical"
      disabled={loading}
      initialValues={initialData}
    >
      <Form.Item
        label="Tên khóa học"
        name="courseName"
        rules={[{ required: true, message: "Vui lòng nhập tên khóa học" }]}
      >
        <Input placeholder="Nhập tên khóa học" />
      </Form.Item>

      <Form.Item
        label="Loại khóa học"
        name="courseCategory"
        rules={[{ required: true, message: "Vui lòng nhập loại khóa học" }]}
      >
        <Input placeholder="Nhập loại khóa học" />
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
        label="Mô tả"
        name="description"
        rules={[{ required: true, message: "Vui lòng nhập mô tả khóa học" }]}
      >
        <TextArea
          placeholder="Nhập mô tả khóa học"
          autoSize={{ minRows: 3, maxRows: 6 }}
        />
      </Form.Item>

      {/* Tạm thời ẩn trường URL Video
      <Form.Item
        label="URL Video"
        name="videoUrl"
      >
        <Input placeholder="Nhập URL video giới thiệu khóa học" />
      </Form.Item>
      */}

      {/* Tạm thời ẩn trường Hình ảnh
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
      */}
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
  const [courses, setCourses] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [courseCategories, setCourseCategories] = useState([]);
  const pageSize = 10;

  useEffect(() => {
    fetchCourses();
    fetchCourseCategories();
  }, []);

  const fetchCourseCategories = async () => {
    try {
      const response = await getAllCourseCategories();
      if (response && response.isSuccess && Array.isArray(response.data)) {
        setCourseCategories(response.data);
      }
    } catch (err) {
      console.error("Error fetching course categories:", err);
      message.error("Không thể tải danh sách loại khóa học");
    }
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await getAllCourses();
      console.log("API response:", response);
      setRawData(response);
      
      // Kiểm tra cấu trúc phản hồi API
      if (response && response.isSuccess && Array.isArray(response.data)) {
        console.log("Course data array:", response.data);
        
        // Lấy mẫu dữ liệu đầu tiên để debug
        if (response.data.length > 0) {
          console.log("Sample course item:", response.data[0]);
        }
        
        // Ánh xạ dữ liệu từ API vào state dựa trên cấu trúc DB thực tế
        const mappedCourses = response.data.map(course => {
          console.log("Processing course:", course);
          
          // Xác định người tạo từ các trường có thể
          let creator = "N/A";
          if (course.createBy) creator = course.createBy;
          else if (course.createdBy) creator = course.createdBy;
          else if (course.author) creator = course.author;
          else if (course.CreateBy) creator = course.CreateBy; // Kiểm tra viết hoa
          else if (course.creatorBy) creator = course.creatorBy;
          
          // Lấy trường của người tạo được ghi trong hình ảnh DB
          if (creator === "N/A") {
            if (course.y1QwrxpqEM9QM) creator = "y1QwrxpqEM9QM";
            else if (course["1CB074F5-1D02-4BB8-A802-5B8B9A1C98FB"]) creator = "1CB074F5-1D02-4BB8-A802-5B8B9A1C98FB";
            else if (course["26B871F0-EBC0-4F36-9D69-CCED82742789"]) creator = "26B871F0-EBC0-4F36-9D69-CCED82742789";
            else if (course["8JexUUOPr0baxk"]) creator = "8JexUUOPr0baxk";
            else if (course["8J7jRVFyoko7vO"]) creator = "8J7jRVFyoko7vO";
          }
          
return {
            id: course.courseId || course.id || "N/A",
            name: course.courseName || "N/A",
            price: parseFloat(course.price) || 0,
            date: course.createAt || "N/A",
            createdAt: course.createAt || "N/A",
            status: course.status || "Đang hoạt động",
            description: course.description || "N/A",
            learningObjectives: course.learningObjectives || "N/A",
            videoUrl: course.videoUrl || "",
            image: course.image || "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?q=80&w=2070&auto=format&fit=crop",
            creator: creator,
            certificate: course.certificateId ? true : false,
            quizId: course.quizId || "N/A"
          };          
        });
        
        setCourses(mappedCourses);
        setError("");
      } else {
        console.error("API response structure is not as expected:", response);
        setError("Định dạng dữ liệu không đúng. Vui lòng liên hệ quản trị viên.");
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Không thể tải danh sách khóa học. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

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
      render: (price) => formatPrice(price),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => formatDate(date),
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
            icon={<FaEye size={14} />}
          >
            Xem
          </CustomButton>
          <CustomButton 
            type="default" 
            size="small"
            onClick={() => handleUpdateCourse(record)}
            icon={<FaEdit size={14} />}
          >
            Sửa
          </CustomButton>
          <CustomButton 
            type="text" 
            danger 
            size="small"
            onClick={() => handleDeleteCourse(record)}
            icon={<FaTrash size={14} />}
          />
        </div>
      ),
    },
  ];

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    console.log("Searching for:", searchTerm);
  };

  const handleSaveCourse = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      // Kiểm tra các trường bắt buộc
      if (!values.courseName || !values.courseCategory || !values.description || !values.price) {
        message.error("Vui lòng điền đầy đủ thông tin khóa học");
        return;
      }
      
      // Chuẩn bị dữ liệu theo đúng format API yêu cầu
      const courseData = {
        courseName: values.courseName.trim(),
        courseCategory: values.courseCategory.trim(),
        description: values.description.trim(),
        price: Number(values.price),
        //author: "1CB074F5-15AB-4058-8" // Thêm author ID theo response body
      };

      console.log("Sending course data:", courseData);
      const response = await createCourse(courseData);
      
      if (response.isSuccess) {
        message.success(response.message || "Tạo khóa học thành công!");
        setIsCreateModalOpen(false);
        form.resetFields();
        fetchCourses();
      } else {
        message.error(response.message || "Có lỗi xảy ra khi tạo khóa học");
      }
    } catch (error) {
      console.error("Error saving course:", error);
      message.error("Vui lòng điền đầy đủ thông tin khóa học");
    } finally {
      setLoading(false);
    }
  };

  // Hàm chuyển đổi hình ảnh sang base64
  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
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
      case "Active":
        return "green";
      case "Sắp diễn ra":
      case "Pending":
        return "blue";
      case "Đã kết thúc":
      case "Inactive":
        return "gray";
      default:
        return "default";
    }
  };

  // Lọc dữ liệu theo từ khóa tìm kiếm
  const filteredCourses = courses.filter(course => {
    return (
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (course.id && course.id.toString().toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // Phân trang dữ liệu
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Quản lý khóa học"
        description="Báo cáo và tổng quan về khóa học của bạn"
      />

      <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CustomButton 
              type="primary" 
              icon={<FaPlus />}
              onClick={handleOpenCreateModal}
            >
              Thêm khóa học mới
            </CustomButton>
            <CustomButton 
              onClick={fetchCourses} 
              loading={loading}
              title="Làm mới dữ liệu"
            >
              Làm mới
            </CustomButton>
          </div>
          <SearchBar 
            onSearch={handleSearch} 
            placeholder="Tìm khóa học theo tên, mô tả"
          />
        </div>

        {error && (
          <Error 
            message={error} 
            action={
              <CustomButton type="primary" onClick={fetchCourses} loading={loading}>
                Thử lại
              </CustomButton>
            } 
          />
        )}

        {courses.length === 0 && !loading && !error && (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-500 mb-4">Không có dữ liệu khóa học nào</p>
            <CustomButton type="primary" onClick={fetchCourses} loading={loading}>
              Làm mới dữ liệu
            </CustomButton>
          </div>
        )}

        {courses.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <CustomTable 
              columns={columns}
              dataSource={paginatedCourses}
              loading={loading}
            />
            
            <div className="p-4 flex justify-end">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredCourses.length / pageSize)}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        )}
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
            courseCategories={courseCategories}
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
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/640x360?text=Không+có+hình+ảnh";
                    }}
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h3 className="text-lg font-semibold mb-2">Thông tin chung</h3>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <Book className="text-gray-500 w-5 h-5" />
                      <span className="text-gray-700">Mã khóa học: {selectedCourse.id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="text-gray-500 w-5 h-5" />
                      <span className="text-gray-700">Ngày tạo: {formatDate(selectedCourse.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="text-gray-500 w-5 h-5" />
                      <span className="text-gray-700">Giá: {formatPrice(selectedCourse.price)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="text-gray-500 w-5 h-5" />
                      <span className="text-gray-700">Chứng chỉ: {selectedCourse.certificate ? "Có" : "Không"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="text-gray-500 w-5 h-5" />
                      <span className="text-gray-700">Người tạo: {selectedCourse.creator}</span>
                    </div>
                  </div>
                </div>
              </Col>
              
              <Col xs={24} md={12}>
                <div className="mb-4">
                  <h2 className="text-xl font-bold mb-1">{selectedCourse.name}</h2>
                  <Tag color={getStatusColor(selectedCourse.status)} className="mb-4">
                    {selectedCourse.status}
                  </Tag>
                </div>
                
                <Divider orientation="left">Mô tả</Divider>
                <p className="text-gray-700 mb-6">{selectedCourse.description}</p>
                
                <Divider orientation="left">Mục tiêu học tập</Divider>
                <p className="text-gray-700 mb-6">{selectedCourse.learningObjectives}</p>
                
                {selectedCourse.videoUrl && (
                  <>
                    <Divider orientation="left">Video</Divider>
                    <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                      <iframe
                        src={selectedCourse.videoUrl}
                        title={selectedCourse.name}
                        className="w-full h-full"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </>
                )}
              </Col>
            </Row>
            
            <div className="flex justify-end gap-3 mt-6">
              <CustomButton onClick={handleCloseViewModal}>
                Đóng
              </CustomButton>
              <CustomButton 
                type="primary" 
                onClick={() => {
                  handleCloseViewModal();
                  handleUpdateCourse(selectedCourse);
                }}
              >
                Chỉnh sửa
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