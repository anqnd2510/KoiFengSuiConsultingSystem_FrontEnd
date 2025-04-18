import React, { useState, useEffect } from "react";
import { FaExclamationCircle, FaSync, FaEye, FaTimes } from "react-icons/fa";
import { Tag, Button, Modal, Dropdown, Checkbox, Menu, Rate } from "antd";
import SearchBar from "../../components/Common/SearchBar";
import Pagination from "../../components/Common/Pagination";
import CustomTable from "../../components/Common/CustomTable";
import Header from "../../components/Common/Header";
import Error from "../../components/Common/Error";
import FilterBar from "../../components/Common/FilterBar";
import { getAllCourses } from "../../services/course.service";
import {
  getAllCategories,
  getCategoryById,
} from "../../services/category.service";

const CourseManagement = () => {
  // State cho danh sách khóa học đã đăng ký
  const [registrations, setRegistrations] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  // State cho danh mục khóa học
  const [courseCategories, setCourseCategories] = useState([]);
  const [categoryNames, setCategoryNames] = useState({});

  // State cho lỗi
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // State cho việc hiển thị cột
  const [visibleColumns, setVisibleColumns] = useState({
    courseName: true,
    courseType: true,
    date: true,
    paymentMethod: false,
    customerName: false,
    total: true,
    rating: true,
    certificate: true,
    creator: true,
    status: true,
    isBestSeller: false,
  });

  useEffect(() => {
    fetchCourses();
    fetchCourseCategories();
  }, []);

  const fetchCourseCategories = async () => {
    try {
      const response = await getAllCategories();
      console.log("Categories API response:", response);

      // Kiểm tra response có đúng cấu trúc không
      if (response && response.isSuccess && response.data) {
        console.log("Categories data:", response.data);

        // Map dữ liệu để đảm bảo có categoryId
        const mappedCategories = response.data.map((category) => ({
          categoryId: category.categoryId, // Lấy categoryId
          categoryName: category.categoryName,
        }));

        console.log("Mapped categories:", mappedCategories);
        setCourseCategories(mappedCategories);

        // Tạo object mapping từ categoryId đến categoryName để dễ tra cứu
        const categoryNameMapping = {};
        mappedCategories.forEach((category) => {
          categoryNameMapping[category.categoryId] = category.categoryName;
        });
        setCategoryNames(categoryNameMapping);
      } else {
        console.warn("Invalid categories response structure:", response);
        setCourseCategories([]);
      }
    } catch (err) {
      console.error("Error fetching course categories:", err);
      setCourseCategories([]); // Set mảng rỗng khi có lỗi
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
          // Log tất cả các thuộc tính để kiểm tra
          const firstCourse = response.data[0];
          console.log("All properties of the first course:");
          Object.keys(firstCourse).forEach((key) => {
            console.log(`${key}:`, firstCourse[key]);
          });
        }

        // Ánh xạ dữ liệu từ API vào state dựa trên cấu trúc DB thực tế
        setRegistrations(
          response.data.map((course) => {
            console.log("Processing course:", course);

            // Xác định người tạo từ các trường có thể
            let creator = "N/A";
            if (course.createBy) creator = course.createBy;
            else if (course.createdBy) creator = course.createdBy;
            else if (course.author) creator = course.author;
            else if (course.CreateBy)
              creator = course.CreateBy; // Kiểm tra viết hoa
            else if (course.creatorBy) creator = course.creatorBy;

            // Lấy trường của người tạo được ghi trong hình ảnh DB
            if (creator === "N/A") {
              if (course.y1QwrxpqEM9QM) creator = "y1QwrxpqEM9QM";
              else if (course["1CB074F5-1D02-4BB8-A802-5B8B9A1C98FB"])
                creator = "1CB074F5-1D02-4BB8-A802-5B8B9A1C98FB";
              else if (course["26B871F0-EBC0-4F36-9D69-CCED82742789"])
                creator = "26B871F0-EBC0-4F36-9D69-CCED82742789";
              else if (course["8JexUUOPr0baxk"]) creator = "8JexUUOPr0baxk";
              else if (course["8J7jRVFyoko7vO"]) creator = "8J7jRVFyoko7vO";
            }

            return {
              id: course.courseId || course.id || "N/A",
              courseName: course.courseName || "N/A",
              rating: course.rating || 0,
              isBestSeller: course.isBestSeller || false,
              courseType: course.courseCategory || course.courseType || "N/A",
              categoryId: course.courseCategory || course.categoryId || null,
              categoryName: course.categoryName || "Chưa phân loại",
              status: course.status || "Active",
              certificate: course.certificateId ? true : false,
              certificateId: course.certificateId || "N/A",
              quizCode: course.quizId || "N/A",
              total: course.price || 0,
              date: course.createAt || "N/A",
              creator: creator,
              updateAt: course.updateAt || "N/A",
              description: course.description || "N/A",
            };
          })
        );
        setError("");
      } else {
        console.error("API response structure is not as expected:", response);
        setError(
          "Định dạng dữ liệu không đúng. Vui lòng liên hệ quản trị viên."
        );
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Không thể tải danh sách khóa học. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Hàm để lấy tên category
  const getCategoryName = (categoryId) => {
    if (!categoryId || categoryId === "N/A") return "Chưa phân loại";
    return categoryNames[categoryId] || categoryId;
  };

  // Xử lý tìm kiếm
  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    console.log("Searching for:", searchTerm);
    // Thực hiện logic tìm kiếm ở đây
  };

  // Xử lý filter theo trạng thái
  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
    console.log("Lọc theo trạng thái:", value);
  };

  // Xử lý phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Xác định màu sắc cho trạng thái
  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "success";
      case "Inactive":
        return "error";
      case "Pending":
        return "warning";
      default:
        return "default";
    }
  };

  // Tùy chọn trạng thái cho bộ lọc
  const statusOptions = [
    { value: "Active", label: "Hoạt động" },
    { value: "Inactive", label: "Không hoạt động" },
    { value: "Pending", label: "Đang chờ" },
  ];

  // Lọc dữ liệu theo từ khóa tìm kiếm và trạng thái
  const filteredRegistrations = registrations.filter((registration) => {
    const matchesSearch =
      registration.courseName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      getCategoryName(registration.categoryId)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      registration.creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (registration.id &&
        registration.id
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" || registration.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Phân trang dữ liệu
  const paginatedRegistrations = filteredRegistrations.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Xử lý thay đổi hiển thị cột
  const handleColumnVisibilityChange = (columnKey) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnKey]: !prev[columnKey],
    }));
  };

  const allColumnsDefinition = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 150,
    },
    {
      title: "TÊN KHÓA HỌC",
      dataIndex: "courseName",
      key: "courseName",
    },
    {
      title: "LOẠI KHÓA HỌC",
      dataIndex: "courseType",
      key: "courseType",
      render: (_, record) => (
        <Tag color="blue">
          {record.categoryName || getCategoryName(record.categoryId)}
        </Tag>
      ),
    },
    {
      title: "NGÀY TẠO",
      dataIndex: "date",
      key: "date",
      render: (date) => {
        if (!date || date === "N/A") return "Không có";
        try {
          const dateObj = new Date(date);
          return dateObj.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
        } catch (error) {
          return date;
        }
      },
    },
    {
      title: "TRẠNG THÁI",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: "GIẤY CHỨNG NHẬN",
      dataIndex: "certificate",
      key: "certificate",
      render: (certificate) => (
        <Tag color={certificate ? "green" : "default"}>
          {certificate ? "Có" : "Không"}
        </Tag>
      ),
    },
    {
      title: "GIÁ",
      dataIndex: "total",
      key: "total",
      render: (total) => `${total.toLocaleString()} đ`,
    },
    {
      title: "ĐÁNH GIÁ",
      dataIndex: "rating",
      key: "rating",
      render: (rating) => (
        <div className="flex items-center">
          <Rate disabled defaultValue={rating || 0} />
          <span className="ml-2 text-gray-500">
            {rating ? `(${rating})` : "Chưa có đánh giá"}
          </span>
        </div>
      ),
    },
    {
      title: "NGƯỜI TẠO",
      dataIndex: "creator",
      key: "creator",
      render: (creator) => {
        if (!creator || creator === "N/A") return "Không có";
        // Hiển thị ID ngắn gọn nếu là GUID dài
        if (creator.length > 20) {
          return `${creator.substring(0, 8)}...`;
        }
        return creator;
      },
    },
  ];

  // Lọc các cột hiển thị
  const columns = allColumnsDefinition.filter(
    (col) => visibleColumns[col.dataIndex]
  );

  // Menu cho dropdown tùy chọn cột
  const columnMenu = (
    <Menu>
      {allColumnsDefinition.map((column) => (
        <Menu.Item key={column.dataIndex}>
          <Checkbox
            checked={visibleColumns[column.dataIndex]}
            onChange={() => handleColumnVisibilityChange(column.dataIndex)}
          >
            {column.title}
          </Checkbox>
        </Menu.Item>
      ))}
    </Menu>
  );

  // Xử lý khi click vào hàng
  const handleRowClick = (record) => {
    console.log("Selected course:", record);
    setSelectedCourse(record);
    setIsModalVisible(true);
  };

  // Đóng modal
  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Quản lý khóa học"
        description="Quản lý thông tin chi tiết về các khóa học và đăng ký"
      />

      <div className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex flex-wrap justify-between items-center mb-4">
            <div className="flex items-center">
              <SearchBar
                placeholder="Tìm theo tên khóa học, loại, người tạo"
                onSearch={handleSearch}
                className="w-64 mr-2"
              />
              <Dropdown overlay={columnMenu} trigger={["click"]}>
                <Button
                  className="ml-2"
                  icon={<FaEye />}
                  title="Tùy chọn hiển thị cột"
                >
                  Hiển thị cột
                </Button>
              </Dropdown>
              <FilterBar
                statusOptions={statusOptions}
                onStatusChange={handleStatusFilterChange}
                defaultValue="all"
                placeholder="Trạng thái"
                width="150px"
                className="ml-2"
              />
            </div>
          </div>

          {error && (
            <Error
              message={error}
              action={
                <Button type="primary" onClick={fetchCourses} loading={loading}>
                  Thử lại
                </Button>
              }
            />
          )}

          {registrations.length === 0 && !loading && !error && (
            <div className="p-4 text-center text-gray-500">
              Không có dữ liệu khóa học nào
            </div>
          )}

          <div className="overflow-x-auto">
            <CustomTable
              columns={columns}
              dataSource={paginatedRegistrations}
              pagination={false}
              loading={loading}
              scroll={{ x: true }}
              onRow={(record) => ({
                onClick: () => handleRowClick(record),
                style: { cursor: "pointer" },
              })}
            />
          </div>

          <div className="mt-4 flex justify-end">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredRegistrations.length / pageSize)}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      {/* Modal hiển thị chi tiết khóa học */}
      <Modal
        title="Chi tiết khóa học"
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={[
          <Button key="close" onClick={handleCloseModal}>
            Đóng
          </Button>,
        ]}
        width={700}
      >
        {selectedCourse && (
          <div className="course-details">
            <div className="grid grid-cols-2 gap-4">
              <div className="detail-item">
                <p className="font-semibold">ID:</p>
                <p>{selectedCourse.id}</p>
              </div>
              <div className="detail-item">
                <p className="font-semibold">Tên khóa học:</p>
                <p>{selectedCourse.courseName}</p>
              </div>
              <div className="detail-item">
                <p className="font-semibold">Loại khóa học:</p>
                <p>
                  <Tag color="blue">
                    {selectedCourse.categoryName ||
                      getCategoryName(selectedCourse.categoryId)}
                  </Tag>
                </p>
              </div>
              <div className="detail-item">
                <p className="font-semibold">Ngày tạo:</p>
                <p>
                  {selectedCourse.date === "N/A"
                    ? "Không có"
                    : new Date(selectedCourse.date).toLocaleDateString(
                        "vi-VN",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )}
                </p>
              </div>
              <div className="detail-item">
                <p className="font-semibold">Giá:</p>
                <p>{selectedCourse.total.toLocaleString()} đ</p>
              </div>
              <div className="detail-item">
                <p className="font-semibold">Giấy chứng nhận:</p>
                <p>
                  <Tag color={selectedCourse.certificate ? "green" : "default"}>
                    {selectedCourse.certificate ? "Có" : "Không"}
                  </Tag>
                </p>
              </div>
              <div className="detail-item">
                <p className="font-semibold">Đánh giá:</p>
                <div className="flex items-center">
                  <Rate disabled defaultValue={selectedCourse.rating || 0} />
                  <span className="ml-2 text-gray-500">
                    {selectedCourse.rating ? `(${selectedCourse.rating})` : "Chưa có đánh giá"}
                  </span>
                </div>
              </div>
              <div className="detail-item">
                <p className="font-semibold">Người tạo:</p>
                <p>
                  {selectedCourse.creator === "N/A"
                    ? "Không có"
                    : selectedCourse.creator}
                </p>
              </div>
              <div className="detail-item">
                <p className="font-semibold">Trạng thái:</p>
                <p>
                  <Tag color={getStatusColor(selectedCourse.status)}>
                    {selectedCourse.status}
                  </Tag>
                </p>
              </div>
              {selectedCourse.description && (
                <div className="detail-item col-span-2">
                  <p className="font-semibold">Mô tả:</p>
                  <p>{selectedCourse.description}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CourseManagement;
