import React, { useState, useEffect } from "react";
import { FaSearch, FaPlus, FaExclamationCircle } from "react-icons/fa";
import SearchBar from "../components/Common/SearchBar";
import Pagination from "../components/Common/Pagination";
import CreateCourseModal from "../components/Course/CreateCourseModal";
import AddCourseButton from "../components/Course/AddCourseButton";
import CourseTable from "../components/Course/CourseTable";
import ViewCourseModal from "../components/Course/ViewCourseModal";

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
      description: "Khóa học giới thiệu các khái niệm cơ bản và ứng dụng của phong thủy cổ học trong đời sống hiện đại",
      videoUrl: "https://example.com/video1",
      image: "https://example.com/image1.jpg"
    },
    {
      id: 2,
      name: "Đại Đạo Chi Giản - Phong Thủy Cổ Học",
      price: 20.5,
      date: "1/5/2021",
      createdAt: "1/5/2021",
      learningObjectives: "Hiểu về nguyên lý cơ bản của phong thủy cổ học",
      description: "Khóa học giới thiệu các khái niệm cơ bản và ứng dụng của phong thủy cổ học trong đời sống hiện đại",
      videoUrl: "https://example.com/video2",
      image: "https://example.com/image2.jpg"
    },
    {
      id: 3,
      name: "Đại Đạo Chi Giản - Phong Thủy Cổ Học",
      price: 20.5,
      date: "1/5/2021",
      createdAt: "1/5/2021",
      learningObjectives: "Hiểu về nguyên lý cơ bản của phong thủy cổ học",
      description: "Khóa học giới thiệu các khái niệm cơ bản và ứng dụng của phong thủy cổ học trong đời sống hiện đại",
      videoUrl: "https://example.com/video3",
      image: "https://example.com/image3.jpg"
    },
    {
      id: 4,
      name: "Đại Đạo Chi Giản - Phong Thủy Cổ Học",
      price: 20.5,
      date: "1/5/2021",
      createdAt: "1/5/2021",
      learningObjectives: "Hiểu về nguyên lý cơ bản của phong thủy cổ học",
      description: "Khóa học giới thiệu các khái niệm cơ bản và ứng dụng của phong thủy cổ học trong đời sống hiện đại",
      videoUrl: "https://example.com/video4",
      image: "https://example.com/image4.jpg"
    },
  ]);

  // State cho trang hiện tại
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("Error"); // Để hiển thị lỗi nếu có
  // State cho trạng thái modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Thêm hiệu ứng làm mờ nhẹ nội dung chính khi modal mở
  useEffect(() => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      if (isCreateModalOpen || isViewModalOpen) {
        mainContent.style.filter = 'blur(0.8px)';
      } else {
        mainContent.style.filter = 'none';
      }
    }
  }, [isCreateModalOpen, isViewModalOpen]);

  // Xử lý chức năng tìm kiếm
  const handleSearch = (searchTerm) => {
    console.log("Searching for:", searchTerm);
    // Thực hiện logic tìm kiếm ở đây
  };

  // Xử lý thêm khóa học mới
  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleSaveCourse = (courseData) => {
    console.log("Saving course:", courseData);
    // Tạo một khóa học mới với ID tự động tăng
    const newCourse = {
      id: courses.length + 1,
      name: courseData.name,
      price: courseData.price || 20.5,
      date: new Date().toLocaleDateString(),
      createdAt: new Date().toLocaleDateString(),
      learningObjectives: courseData.learningObjectives || "",
      description: courseData.description || "",
      videoUrl: courseData.videoUrl || "",
      image: courseData.image || ""
    };
    
    // Thêm khóa học mới vào danh sách
    setCourses([...courses, newCourse]);
    
    // Đóng modal
    setIsCreateModalOpen(false);
  };

  // Xử lý các hành động với khóa học
  const handleViewCourse = (course) => {
    console.log("Viewing course:", course);
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
    console.log("Deleting course:", course.id);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    console.log("Changing to page:", page);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#B89D71] p-4">
        <h1 className="text-white text-xl font-semibold">Courses Management</h1>
        <p className="text-white/80 text-sm">Reports and overview of your courses</p>
      </div>

      {/* Main Content */}
      <div id="main-content" className="p-6 relative">
        {/* Header với nút thêm mới và thanh tìm kiếm */}
        <div className="mb-6 flex justify-between items-center">
          <AddCourseButton onClick={handleOpenCreateModal} />
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Hiển thị lỗi nếu có */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <span className="font-bold">Error</span>
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

        {/* Modal tạo khóa học mới */}
        {isCreateModalOpen && (
          <CreateCourseModal
            isOpen={isCreateModalOpen}
            onClose={handleCloseCreateModal}
            onSave={handleSaveCourse}
          />
        )}

        {/* Modal xem chi tiết khóa học */}
        {isViewModalOpen && (
          <ViewCourseModal
            isOpen={isViewModalOpen}
            onClose={handleCloseViewModal}
            course={selectedCourse}
          />
        )}
      </div>
    </div>
  );
};

export default CourseMaster; 