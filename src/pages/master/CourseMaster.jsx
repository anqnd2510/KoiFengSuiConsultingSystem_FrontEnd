import React, { useState, useEffect } from "react";
import { FaSearch, FaPlus, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Upload,
  message,
  Row,
  Col,
  Divider,
  Tag,
  Select,
} from "antd";
import SearchBar from "../../components/Common/SearchBar";
import Pagination from "../../components/Common/Pagination";
import CustomTable from "../../components/Common/CustomTable";
import Header from "../../components/Common/Header";
import Error from "../../components/Common/Error";
import CustomButton from "../../components/Common/CustomButton";
import {
  UploadCloud,
  Book,
  Calendar,
  DollarSign,
  Award,
  FileText,
  Trash2,
  ClipboardList,
} from "lucide-react";
import {
  getAllCourses,
  createCourse,
  deleteCourse,
  updateCourse,
  getAllCoursesByMaster,
} from "../../services/course.service";
import { formatDate, formatPrice } from "../../utils/formatters";
import {
  getChaptersByCourseId,
  formatDuration,
  createChapter,
} from "../../services/chapter.service";
import {
  getCategoryById,
  getAllCategories,
  createCategory,
} from "../../services/category.service";
import { useNavigate } from "react-router-dom";
import Chapter from "./Chapter";

const { TextArea } = Input;

// Component form cho khóa học
const CourseForm = ({ form, initialData, loading, courseCategories }) => {
  console.log("Rendering CourseForm with initialData:", initialData);
  console.log("Available courseCategories:", courseCategories);

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
        rules={[{ required: true, message: "Vui lòng chọn loại khóa học" }]}
      >
        <Select
          placeholder="Chọn loại khóa học"
          loading={!courseCategories || courseCategories.length === 0}
          showSearch
          optionFilterProp="label"
          options={courseCategories.map((category) => ({
            value: category.categoryId,
            label: category.categoryName,
          }))}
        />
      </Form.Item>

      <Form.Item
        label="Giá"
        name="price"
        rules={[{ required: true, message: "Vui lòng nhập giá khóa học" }]}
      >
        <InputNumber
          placeholder="Nhập giá khóa học"
          min={0}
          style={{ width: "100%" }}
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

      {/* Tạm thời ẩn trường URL Video
      <Form.Item
        label="URL Video"
        name="videoUrl"
      >
        <Input placeholder="Nhập URL video giới thiệu khóa học" />
      </Form.Item>
      */}
    </Form>
  );
};

// Thêm form component cho chương
const ChapterForm = ({ form, loading }) => {
  return (
    <Form form={form} layout="vertical" disabled={loading}>
      <Form.Item
        label="Tiêu đề chương"
        name="chapterName"
        rules={[{ required: true, message: "Vui lòng nhập tiêu đề chương" }]}
      >
        <Input placeholder="Nhập tiêu đề chương" />
      </Form.Item>

      <Form.Item
        label="Mô tả"
        name="description"
        rules={[{ required: true, message: "Vui lòng nhập mô tả chương" }]}
      >
        <TextArea
          placeholder="Nhập mô tả nội dung chương"
          autoSize={{ minRows: 3, maxRows: 6 }}
        />
      </Form.Item>

      <Form.Item
        label="Thời lượng (phút)"
        name="duration"
        rules={[{ required: true, message: "Vui lòng nhập thời lượng" }]}
      >
        <InputNumber
          placeholder="Nhập thời lượng (phút)"
          min={1}
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Form.Item
        label="Thứ tự hiển thị"
        name="order"
        rules={[{ required: true, message: "Vui lòng nhập thứ tự hiển thị" }]}
      >
        <InputNumber
          placeholder="Nhập thứ tự hiển thị"
          min={1}
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Form.Item
        label="URL Video"
        name="videoUrl"
        rules={[{ required: false, message: "Vui lòng nhập URL video" }]}
      >
        <Input placeholder="Nhập URL video bài giảng (YouTube, Vimeo...)" />
      </Form.Item>

      <Form.Item label="Nội dung chi tiết" name="content">
        <TextArea
          placeholder="Nhập nội dung chi tiết chương (không bắt buộc)"
          autoSize={{ minRows: 4, maxRows: 10 }}
        />
      </Form.Item>

      <Form.Item label="Đường dẫn tài nguyên" name="resourceUrl">
        <Input placeholder="Nhập đường dẫn đến tài liệu (không bắt buộc)" />
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
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [form] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [courses, setCourses] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [courseCategories, setCourseCategories] = useState([]);
  const pageSize = 10;
  const [isNavigatingToChapters, setIsNavigatingToChapters] = useState(false);
  const [isChaptersModalOpen, setIsChaptersModalOpen] = useState(false);
  const [courseChapters, setCourseChapters] = useState([]);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [isCreateChapterModalOpen, setIsCreateChapterModalOpen] =
    useState(false);
  const [chapterForm] = Form.useForm();
  const [creatingChapter, setCreatingChapter] = useState(false);
  const [isUpdateChapterModalOpen, setIsUpdateChapterModalOpen] =
    useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [updateChapterForm] = Form.useForm();
  const [updatingChapter, setUpdatingChapter] = useState(false);
  const navigate = useNavigate();
  const [isViewQuizModalOpen, setIsViewQuizModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizForm] = Form.useForm();
  const [categoryNames, setCategoryNames] = useState({});
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] =
    useState(false);
  const [categoryForm] = Form.useForm();

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
        return;
      }

      console.warn("Invalid categories response structure:", response);
      setCourseCategories([]);
    } catch (err) {
      console.error("Error fetching course categories:", err);
      setCourseCategories([]); // Set mảng rỗng khi có lỗi
    }
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      // Sử dụng API mới để lấy danh sách khóa học theo master
      const response = await getAllCoursesByMaster();
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
        const mappedCourses = response.data.map((course) => {
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

          // Log để kiểm tra category Id
          console.log("Course category data:", {
            categoryName: course.categoryName,
            courseCategory: course.courseCategory,
            categoryId: course.categoryId,
          });

          return {
            id: course.courseId || course.id || "N/A",
            name: course.courseName || "N/A",
            categoryName: course.categoryName || "Chưa phân loại",
            categoryId: course.courseCategory || course.categoryId || null, // Thay đổi từ "N/A" thành null
            price: parseFloat(course.price) || 0,
            date: course.createAt || "N/A",
            createdAt: course.createAt || "N/A",
            status: course.status || "Đang hoạt động",
            description: course.description || "N/A",
            learningObjectives: course.learningObjectives || "N/A",
            videoUrl: course.videoUrl || "",
            image:
              course.image ||
              "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?q=80&w=2070&auto=format&fit=crop",
            creator: creator,
            certificate: course.certificateId ? true : false,
            quizId: course.quizId || "N/A",
          };
        });

        setCourses(mappedCourses);
        setError("");
      } else {
        console.error("API response structure is not as expected:", response);
        if (response && !response.isSuccess) {
          setError(
            response.message ||
              "Lỗi khi lấy danh sách khóa học. Vui lòng liên hệ quản trị viên."
          );
        } else {
          setError(
            "Định dạng dữ liệu không đúng. Vui lòng liên hệ quản trị viên."
          );
        }
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Không thể tải danh sách khóa học. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Thêm hàm để lấy tên category
  const fetchCategoryName = async (categoryId) => {
    try {
      const response = await getCategoryById(categoryId);
      if (response && response.isSuccess) {
        setCategoryNames((prev) => ({
          ...prev,
          [categoryId]: response.data.categoryName,
        }));
      }
    } catch (err) {
      console.error("Error fetching category name:", err);
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
      title: "Loại khóa học",
      dataIndex: "categoryName",
      key: "categoryName",
      render: (categoryName) => <Tag color="blue">{categoryName}</Tag>,
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
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
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
            Cập nhật
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

      // Tạo FormData để gửi dữ liệu và file
      const formData = new FormData();
      formData.append("CourseName", values.courseName.trim());
      formData.append("CourseCategory", values.courseCategory);
      formData.append("Description", values.description.trim());
      formData.append("Price", Number(values.price));

      // Xử lý file hình ảnh nếu có
      if (values.image && values.image.length > 0) {
        const imageFile = values.image[0].originFileObj;
        console.log("Đính kèm file hình ảnh:", imageFile.name);
        formData.append("ImageUrl", imageFile);
      }

      // Log FormData để debug
      console.log("Sending course data:");
      for (let [key, value] of formData.entries()) {
        console.log(
          key + ":",
          value instanceof File ? `File: ${value.name}` : value
        );
      }

      const response = await createCourse(formData);

      if (response && response.isSuccess) {
        message.success(response.message || "Tạo khóa học thành công!");
        setIsCreateModalOpen(false);
        form.resetFields();
        fetchCourses();
      } else {
        message.error(response?.message || "Có lỗi xảy ra khi tạo khóa học");
      }
    } catch (error) {
      console.error("Error saving course:", error);
      if (error.errorFields) {
        message.error("Vui lòng điền đầy đủ thông tin khóa học");
      } else {
        message.error("Có lỗi xảy ra: " + error.message);
      }
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
      reader.onerror = (error) => reject(error);
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

  const handleUpdateCourse = async (course) => {
    console.log("Updating course:", course);
    setSelectedCourse(course);

    // Đảm bảo danh sách category đã được tải
    if (courseCategories.length === 0) {
      message.info("Đang tải danh sách loại khóa học...");
      await fetchCourseCategories();
    }

    // Log chi tiết để kiểm tra
    console.log("Course category values:", {
      categoryId: course.categoryId,
      categoryName: course.categoryName,
    });

    // Kiểm tra nếu categoryId không hợp lệ
    if (
      !course.categoryId ||
      course.categoryId === "N/A" ||
      course.categoryId === "null" ||
      course.categoryId === null
    ) {
      console.warn(
        "Invalid categoryId detected. Finding categoryId from categories list"
      );

      // Tìm categoryId dựa trên categoryName
      const categoryFound = courseCategories.find(
        (cat) =>
          cat.categoryName.toLowerCase() === course.categoryName.toLowerCase()
      );

      if (categoryFound) {
        console.log("Found matching category:", categoryFound);
        console.log(
          "Setting form value with found categoryId:",
          categoryFound.categoryId
        );

        updateForm.setFieldsValue({
          courseName: course.name,
          courseCategory: categoryFound.categoryId,
          price: course.price,
          description: course.description,
        });
      } else {
        console.warn("No matching category found for:", course.categoryName);

        // Hiển thị message cho người dùng
        message.warning(
          "Không tìm thấy thông tin loại khóa học. Vui lòng chọn lại."
        );

        // Tạm thời focus vào dropdown để người dùng chú ý chọn lại
        setTimeout(() => {
          const categorySelect = document.querySelector(
            '[name="courseCategory"]'
          );
          if (categorySelect) categorySelect.focus();
        }, 500);

        updateForm.setFieldsValue({
          courseName: course.name,
          courseCategory: undefined, // để trống để người dùng chọn lại
          price: course.price,
          description: course.description,
        });
      }
    } else {
      console.log("Valid categoryId found:", course.categoryId);

      // Kiểm tra xem categoryId có tồn tại trong danh sách không
      const categoryExists = courseCategories.some(
        (cat) => cat.categoryId === course.categoryId
      );

      if (!categoryExists) {
        console.warn(
          "Category ID not found in current categories list:",
          course.categoryId
        );
        message.warning(
          "Loại khóa học của khóa học đã thay đổi. Vui lòng chọn lại loại khóa học."
        );
      }

      updateForm.setFieldsValue({
        courseName: course.name,
        courseCategory: course.categoryId,
        price: course.price,
        description: course.description,
      });
    }

    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedCourse(null);
    updateForm.resetFields();
  };

  const handleSaveUpdateCourse = async () => {
    try {
      const values = await updateForm.validateFields();
      setLoading(true);

      // Tạo FormData để gửi dữ liệu multipart/form-data
      const formData = new FormData();
      formData.append("CourseName", values.courseName.trim());
      formData.append("CourseCategory", values.courseCategory);
      formData.append("Description", values.description.trim());
      formData.append("Price", values.price);

      // Xử lý file hình ảnh nếu có
      if (values.image && values.image.length > 0) {
        const imageFile = values.image[0].originFileObj;
        console.log("Đính kèm file hình ảnh:", imageFile.name);
        formData.append("ImageUrl", imageFile);
      }

      // Log FormData để debug
      console.log("Sending updated course data:");
      for (let [key, value] of formData.entries()) {
        console.log(
          key + ":",
          value instanceof File ? `File: ${value.name}` : value
        );
      }

      const response = await updateCourse(selectedCourse.id, formData);

      if (response && response.isSuccess) {
        message.success("Cập nhật khóa học thành công!");
        setIsUpdateModalOpen(false);
        updateForm.resetFields();
        fetchCourses(); // Refresh course list
      } else {
        throw new Error(
          response?.message || "Có lỗi xảy ra khi cập nhật khóa học"
        );
      }
    } catch (error) {
      console.error("Error updating course:", error);
      message.error(error.message || "Có lỗi xảy ra khi cập nhật khóa học");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (course) => {
    try {
      console.log("Bắt đầu xử lý xóa khóa học ID:", course.id);

      // Sử dụng Modal.confirm thay vì window.confirm
      Modal.confirm({
        title: "Xác nhận xóa",
        content: "Bạn có chắc chắn muốn xóa khóa học này?",
        okText: "Xóa",
        okType: "danger",
        cancelText: "Hủy",
        onOk: async () => {
          try {
            setLoading(true);
            console.log("Đang xóa khóa học với ID:", course.id);

            // Gọi API xóa khóa học
            const result = await deleteCourse(course.id);
            console.log("Kết quả API xóa:", result);

            if (result && result.isSuccess) {
              // Cập nhật state sau khi xóa thành công
              const updatedCourses = courses.filter((c) => c.id !== course.id);
              setCourses(updatedCourses);
              message.success("Đã xóa khóa học thành công");
            } else {
              message.error(result?.message || "Không thể xóa khóa học");

              // Nếu lỗi liên quan đến ràng buộc dữ liệu, hiển thị thông báo chi tiết hơn
              if (result?.message?.includes("tham chiếu")) {
                Modal.error({
                  title: "Không thể xóa khóa học",
                  content:
                    "Khóa học này đang được sử dụng bởi dữ liệu khác trong hệ thống. Vui lòng xóa các dữ liệu liên quan trước khi xóa khóa học này.",
                });
              }
            }
          } catch (error) {
            console.error("Lỗi khi xóa khóa học:", error);

            let errorMessage = "Lỗi khi xóa khóa học";

            if (error.response) {
              console.error("API error response:", error.response.data);

              // Xử lý lỗi 500 từ server
              if (error.response.status === 500) {
                errorMessage =
                  "Lỗi server: Không thể xóa khóa học. Có thể khóa học đang được sử dụng bởi dữ liệu khác.";

                Modal.error({
                  title: "Lỗi Server",
                  content:
                    "Không thể xóa khóa học. Vui lòng liên hệ quản trị viên hoặc thử lại sau.",
                });
              } else {
                errorMessage = error.response.data?.message || errorMessage;
              }
            }

            message.error(errorMessage);
          } finally {
            setLoading(false);
          }
        },
        onCancel() {
          console.log("Hủy xóa khóa học");
        },
      });
    } catch (error) {
      console.error("Lỗi trong hàm handleDeleteCourse:", error);
      message.error("Đã xảy ra lỗi khi xử lý yêu cầu xóa khóa học");
    }
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
  const filteredCourses = courses.filter((course) => {
    return (
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.description &&
        course.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (course.id &&
        course.id.toString().toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // Phân trang dữ liệu
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Cập nhật hàm fetchCourseChapters để sử dụng API thực tế
  const fetchCourseChapters = async (courseId) => {
    try {
      setLoadingChapters(true);
      console.log("Đang lấy danh sách chương cho khóa học:", courseId);

      const response = await getChaptersByCourseId(courseId);

      if (response && response.isSuccess && Array.isArray(response.data)) {
        // Ánh xạ dữ liệu từ API vào state
        const mappedChapters = response.data.map((chapter) => {
          return {
            id: chapter.chapterId || chapter.id || "N/A",
            title: chapter.chapterName || chapter.title || "N/A",
            description: chapter.description || "N/A",
            duration: chapter.duration || 0,
            order: chapter.order || chapter.orderNumber || 0,
            content: chapter.content || "",
            resourceUrl: chapter.resourceUrl || chapter.url || "",
            // Thêm các trường khác nếu cần
          };
        });

        // Sắp xếp theo thứ tự nếu có
        mappedChapters.sort((a, b) => a.order - b.order);

        setCourseChapters(mappedChapters);
      } else {
        // Trường hợp không có dữ liệu hoặc API trả về lỗi
        console.error(
          "API không trả về dữ liệu chương theo định dạng mong đợi:",
          response
        );
        setCourseChapters([]);

        if (response && !response.isSuccess) {
          message.error(response.message || "Không thể lấy danh sách chương");
        }
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách chương:", error);
      message.error("Không thể tải danh sách chương. Vui lòng thử lại sau.");
      setCourseChapters([]);
    } finally {
      setLoadingChapters(false);
    }
  };

  const handleViewQuiz = (courseId) => {
    console.log("Xem quiz của khóa học:", courseId);
    navigate(`/master/course-quiz/${courseId}`);
  };

  const handleViewChapters = (courseId) => {
    console.log("Xem chương của khóa học:", courseId);
    setIsNavigatingToChapters(true);

    // Chuyển hướng đến trang Chapter.jsx thay vì mở modal
    navigate(`/master/course-chapters/${courseId}`);
    setIsNavigatingToChapters(false);
  };

  const handleCloseChaptersModal = () => {
    setIsChaptersModalOpen(false);
    setCourseChapters([]);
  };

  // Hàm mở modal tạo chương mới
  const handleOpenCreateChapterModal = () => {
    // Thiết lập giá trị mặc định cho thứ tự
    const nextOrder =
      courseChapters.length > 0
        ? Math.max(...courseChapters.map((c) => c.order || 0)) + 1
        : 1;

    chapterForm.setFieldsValue({
      order: nextOrder,
      duration: 30, // Giá trị mặc định 30 phút
    });

    setIsCreateChapterModalOpen(true);
  };

  // Hàm đóng modal tạo chương
  const handleCloseCreateChapterModal = () => {
    setIsCreateChapterModalOpen(false);
    chapterForm.resetFields();
  };

  // Hàm xử lý lưu chương mới
  const handleSaveChapter = async () => {
    try {
      const values = await chapterForm.validateFields();
      setCreatingChapter(true);

      // Chuẩn bị dữ liệu gửi lên API
      const chapterData = {
        courseId: selectedCourse.id,
        chapterName: values.chapterName.trim(),
        description: values.description.trim(),
        duration: Number(values.duration),
        order: Number(values.order),
        videoUrl: values.videoUrl ? values.videoUrl.trim() : "",
        content: values.content ? values.content.trim() : "",
        resourceUrl: values.resourceUrl ? values.resourceUrl.trim() : "",
      };

      console.log("Đang tạo chương mới với dữ liệu:", chapterData);

      // Gọi API tạo chương
      const response = await createChapter(chapterData);

      if (response && response.isSuccess) {
        message.success(response.message || "Tạo mới chương thành công!");

        // Cập nhật lại danh sách chương
        const newChapter = {
          id: response.data.chapterId || response.data.id,
          title: response.data.chapterName,
          description: response.data.description,
          duration: response.data.duration,
          order: response.data.order,
          videoUrl: response.data.videoUrl,
          content: response.data.content,
          resourceUrl: response.data.resourceUrl,
        };

        // Thêm chương mới vào danh sách và sắp xếp lại theo thứ tự
        const updatedChapters = [...courseChapters, newChapter].sort(
          (a, b) => a.order - b.order
        );

        setCourseChapters(updatedChapters);

        // Đóng modal và reset form
        setIsCreateChapterModalOpen(false);
        chapterForm.resetFields();
      } else {
        message.error(response?.message || "Không thể tạo chương mới");
      }
    } catch (error) {
      console.error("Lỗi khi tạo chương mới:", error);
      message.error("Vui lòng điền đầy đủ thông tin chương");
    } finally {
      setCreatingChapter(false);
    }
  };

  // Hàm mở modal chỉnh sửa chương
  const handleUpdateChapter = (chapter) => {
    console.log("Đang chỉnh sửa chương:", chapter);
    setSelectedChapter(chapter);

    // Set giá trị ban đầu cho form
    updateChapterForm.setFieldsValue({
      chapterName: chapter.title,
      description: chapter.description,
      duration: chapter.duration,
      order: chapter.order,
      videoUrl: chapter.videoUrl,
      content: chapter.content,
      resourceUrl: chapter.resourceUrl,
    });

    setIsUpdateChapterModalOpen(true);
  };

  // Hàm đóng modal chỉnh sửa chương
  const handleCloseUpdateChapterModal = () => {
    setIsUpdateChapterModalOpen(false);
    setSelectedChapter(null);
    updateChapterForm.resetFields();
  };

  // Hàm lưu chỉnh sửa chương
  const handleSaveUpdateChapter = async () => {
    try {
      const values = await updateChapterForm.validateFields();
      setUpdatingChapter(true);

      // Chuẩn bị dữ liệu cập nhật
      const chapterData = {
        chapterId: selectedChapter.id,
        courseId: selectedCourse.id,
        chapterName: values.chapterName.trim(),
        description: values.description.trim(),
        duration: Number(values.duration),
        order: Number(values.order),
        videoUrl: values.videoUrl ? values.videoUrl.trim() : "",
        content: values.content ? values.content.trim() : "",
        resourceUrl: values.resourceUrl ? values.resourceUrl.trim() : "",
      };

      console.log("Đang cập nhật chương với dữ liệu:", chapterData);

      // Tạm thời mô phỏng API call cho việc cập nhật
      // const response = await updateChapter(chapterData);

      // Giả lập response thành công
      const response = {
        isSuccess: true,
        message: "Cập nhật chương thành công",
        data: {
          ...chapterData,
          id: selectedChapter.id,
          title: chapterData.chapterName,
        },
      };

      if (response && response.isSuccess) {
        message.success(response.message || "Cập nhật chương thành công!");

        // Cập nhật lại danh sách chương
        const updatedChapters = courseChapters.map((chapter) =>
          chapter.id === selectedChapter.id
            ? {
                ...chapter,
                title: chapterData.chapterName,
                description: chapterData.description,
                duration: chapterData.duration,
                order: chapterData.order,
                videoUrl: chapterData.videoUrl,
                content: chapterData.content,
                resourceUrl: chapterData.resourceUrl,
              }
            : chapter
        );

        // Sắp xếp lại theo thứ tự
        updatedChapters.sort((a, b) => a.order - b.order);
        setCourseChapters(updatedChapters);

        // Đóng modal và reset form
        setIsUpdateChapterModalOpen(false);
        updateChapterForm.resetFields();
      } else {
        message.error(response?.message || "Không thể cập nhật chương");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật chương:", error);
      message.error("Vui lòng điền đầy đủ thông tin chương");
    } finally {
      setUpdatingChapter(false);
    }
  };

  // Hàm xóa chương
  const handleDeleteChapter = (chapter) => {
    console.log("Đang xóa chương:", chapter);

    // Sử dụng Modal.confirm để xác nhận xóa
    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc chắn muốn xóa chương "${chapter.title}"?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          setLoadingChapters(true);

          // Tạm thời mô phỏng API call cho việc xóa
          // const result = await deleteChapter(chapter.id);

          // Giả lập response thành công
          const result = {
            isSuccess: true,
            message: "Xóa chương thành công",
          };

          if (result && result.isSuccess) {
            // Cập nhật state sau khi xóa thành công
            const updatedChapters = courseChapters.filter(
              (c) => c.id !== chapter.id
            );
            setCourseChapters(updatedChapters);
            message.success("Đã xóa chương thành công");
          } else {
            message.error(result?.message || "Không thể xóa chương");
          }
        } catch (error) {
          console.error("Lỗi khi xóa chương:", error);
          message.error("Có lỗi xảy ra khi xóa chương");
        } finally {
          setLoadingChapters(false);
        }
      },
    });
  };

  // Hàm xử lý mở modal xem quiz
  const handleViewQuizModal = (courseId) => {
    console.log("Xem quiz của khóa học:", courseId);
    setSelectedQuiz({
      id: courseId,
      title: "Kiểm tra kiến thức Phong thủy cơ bản",
      masterName: "Nguyễn Văn A",
      createdDate: "2024-03-20",
      score: 85,
      questions: [
        {
          id: 1,
          question: "Câu hỏi 1: Phong thủy là gì?",
          options: [
            "A. Nghệ thuật",
            "B. Khoa học",
            "C. Cả A và B",
            "D. Không phải cả A và B",
          ],
          correctAnswer: "C",
          score: 2,
        },
        {
          id: 2,
          question: "Câu hỏi 2: Yếu tố nào quan trọng nhất trong phong thủy?",
          options: ["A. Nước", "B. Gió", "C. Đất", "D. Tất cả đều quan trọng"],
          correctAnswer: "D",
          score: 2,
        },
      ],
    });
    setIsViewQuizModalOpen(true);
  };

  // Hàm đóng modal quiz
  const handleCloseQuizModal = () => {
    setIsViewQuizModalOpen(false);
    setSelectedQuiz(null);
  };

  const handleOpenCreateCategoryModal = () => {
    setIsCreateCategoryModalOpen(true);
  };

  const handleCloseCreateCategoryModal = () => {
    setIsCreateCategoryModalOpen(false);
    categoryForm.resetFields();
  };

  const handleCreateCategory = async () => {
    try {
      setLoading(true);

      const values = await categoryForm.validateFields();
      const categoryData = {
        categoryName: values.categoryName.trim(),
      };

      // Xử lý hình ảnh nếu có
      if (values.image && values.image.length > 0) {
        const file = values.image[0].originFileObj;
        const reader = new FileReader();

        const imageBase64 = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(file);
        });

        categoryData.image = imageBase64;
      }

      console.log("Category data:", categoryData);

      const response = await createCategory(categoryData);
      if (response.isSuccess) {
        message.success("Tạo loại khóa học mới thành công!");
        handleCloseCreateCategoryModal();
        fetchCourseCategories();
      } else {
        message.error(
          response.message || "Có lỗi xảy ra khi tạo loại khóa học"
        );
      }
    } catch (error) {
      if (error.errorFields) {
        message.error("Vui lòng điền đầy đủ thông tin");
      } else {
        message.error("Có lỗi xảy ra khi tạo loại khóa học");
        console.error("Error creating category:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Quản lý khóa học của tôi"
        description="Báo cáo và tổng quan về khóa học mà bạn làm master"
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
              type="default"
              icon={<FaPlus />}
              onClick={handleOpenCreateCategoryModal}
            >
              Thêm loại khóa học
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
              <CustomButton
                type="primary"
                onClick={fetchCourses}
                loading={loading}
              >
                Thử lại
              </CustomButton>
            }
          />
        )}

        {courses.length === 0 && !loading && !error && (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-500 mb-4">Không có dữ liệu khóa học nào</p>
            <CustomButton
              type="primary"
              onClick={fetchCourses}
              loading={loading}
            >
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
        title={<div className="text-xl font-semibold">Tạo mới khóa học</div>}
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
            <CustomButton onClick={handleCloseCreateModal}>Hủy bỏ</CustomButton>
            <CustomButton
              type="primary"
              onClick={handleSaveCourse}
              loading={loading}
            >
              Tạo mới
            </CustomButton>
          </div>
        </div>
      </Modal>

      {/* Modal xem chi tiết khóa học */}
      <Modal
        title={<div className="text-xl font-semibold">Chi tiết khóa học</div>}
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
                      e.target.src =
                        "https://via.placeholder.com/640x360?text=Không+có+hình+ảnh";
                    }}
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Thông tin chung
                  </h3>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <Book className="text-gray-500 w-5 h-5" />
                      <span className="text-gray-700">
                        Mã khóa học: {selectedCourse.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="text-gray-500 w-5 h-5" />
                      <span className="text-gray-700">
                        Ngày tạo: {formatDate(selectedCourse.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="text-gray-500 w-5 h-5" />
                      <span className="text-gray-700">
                        Giá: {formatPrice(selectedCourse.price)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="text-gray-500 w-5 h-5" />
                      <span className="text-gray-700">
                        Chứng chỉ: {selectedCourse.certificate ? "Có" : "Không"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="text-gray-500 w-5 h-5" />
                      <span className="text-gray-700">
                        Người tạo: {selectedCourse.creator}
                      </span>
                    </div>
                  </div>
                </div>
              </Col>

              <Col xs={24} md={12}>
                <div className="mb-4">
                  <h2 className="text-xl font-bold mb-1">
                    {selectedCourse.name}
                  </h2>
                  <Tag
                    color={getStatusColor(selectedCourse.status)}
                    className="mb-4"
                  >
                    {selectedCourse.status}
                  </Tag>
                </div>

                <Divider orientation="left">Mô tả</Divider>
                <p className="text-gray-700 mb-6">
                  {selectedCourse.description}
                </p>

                <Divider orientation="left">Mục tiêu học tập</Divider>
                <p className="text-gray-700 mb-6">
                  {selectedCourse.learningObjectives}
                </p>

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
              <CustomButton
                type="default"
                onClick={() => handleViewChapters(selectedCourse.id)}
                loading={isNavigatingToChapters}
                icon={<Book className="h-4 w-4" />}
              >
                Xem chương
              </CustomButton>
              <CustomButton
                type="default"
                onClick={() => handleViewQuiz(selectedCourse.id)}
                icon={<ClipboardList className="h-4 w-4" />}
              >
                Xem quiz
              </CustomButton>
              <CustomButton onClick={handleCloseViewModal}>Đóng</CustomButton>
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

      {/* Modal cập nhật khóa học */}
      <Modal
        title={<div className="text-xl font-semibold">Cập nhật khóa học</div>}
        open={isUpdateModalOpen}
        onCancel={handleCloseUpdateModal}
        footer={null}
        width={700}
        className="course-modal"
      >
        <div className="p-4">
          <CourseForm
            form={updateForm}
            initialData={{}}
            loading={loading}
            courseCategories={courseCategories}
          />

          <div className="flex justify-end gap-3 mt-6">
            <CustomButton onClick={handleCloseUpdateModal}>Hủy bỏ</CustomButton>
            <CustomButton
              type="primary"
              onClick={handleSaveUpdateCourse}
              loading={loading}
            >
              Cập nhật
            </CustomButton>
          </div>
        </div>
      </Modal>

      {/* Modal xem danh sách chương - cập nhật để thêm cột hành động */}
      <Modal
        title={
          <div className="text-xl font-semibold">
            Danh sách chương {selectedCourse ? `- ${selectedCourse.name}` : ""}
          </div>
        }
        open={isChaptersModalOpen}
        onCancel={handleCloseChaptersModal}
        footer={null}
        width={1000}
        className="course-modal"
      >
        <div className="p-4">
          {loadingChapters ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Đang tải danh sách chương...</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-700">
                  {courseChapters.length > 0
                    ? `Tổng cộng: ${courseChapters.length} chương`
                    : "Chưa có chương nào"}
                </h3>
                <CustomButton
                  type="primary"
                  icon={<FaPlus size={14} />}
                  onClick={handleOpenCreateChapterModal}
                >
                  Thêm chương mới
                </CustomButton>
              </div>

              {courseChapters.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 mb-4">
                    Khóa học này chưa có chương nào
                  </p>
                  <CustomButton
                    type="primary"
                    icon={<FaPlus size={14} />}
                    onClick={handleOpenCreateChapterModal}
                  >
                    Tạo chương đầu tiên
                  </CustomButton>
                </div>
              ) : (
                <>
                  <div className="mb-4 bg-gray-50 p-3 rounded-lg">
                    <div className="grid grid-cols-12 gap-4 font-medium text-gray-700">
                      <div className="col-span-1">Mã</div>
                      <div className="col-span-2">Tiêu đề</div>
                      <div className="col-span-2">Mô tả</div>
                      <div className="col-span-2">Video</div>
                      <div className="col-span-2">Thời lượng</div>
                      <div className="col-span-1">Thứ tự</div>
                      <div className="col-span-2">Hành động</div>
                    </div>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {courseChapters.map((chapter) => (
                      <div
                        key={chapter.id}
                        className="grid grid-cols-12 gap-4 border-b border-gray-100 pb-3"
                      >
                        <div className="col-span-1 font-medium text-gray-700">
                          {chapter.id}
                        </div>
                        <div className="col-span-2 text-gray-800">
                          {chapter.title}
                        </div>
                        <div className="col-span-2 text-gray-600 text-sm">
                          {chapter.description}
                        </div>
                        <div className="col-span-2 text-gray-600 text-sm">
                          {chapter.videoUrl ? (
                            <Tag color="blue">
                              <a
                                href={chapter.videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1"
                              >
                                <FaEye size={12} />
                                Xem video
                              </a>
                            </Tag>
                          ) : (
                            <Tag color="default">Không có</Tag>
                          )}
                        </div>
                        <div className="col-span-2 text-gray-600">
                          {formatDuration(chapter.duration)}
                        </div>
                        <div className="col-span-1 text-gray-600">
                          {chapter.order || "N/A"}
                        </div>
                        <div className="col-span-2">
                          <div className="flex gap-2">
                            <CustomButton
                              type="default"
                              size="small"
                              onClick={() => handleUpdateChapter(chapter)}
                              icon={<FaEdit size={14} />}
                            >
                              Sửa
                            </CustomButton>
                            <CustomButton
                              type="text"
                              danger
                              size="small"
                              onClick={() => handleDeleteChapter(chapter)}
                              icon={<FaTrash size={14} />}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 text-right">
                    <p className="text-sm text-gray-500 mb-4">
                      Tổng thời lượng:{" "}
                      {formatDuration(
                        courseChapters.reduce(
                          (total, chapter) => total + (chapter.duration || 0),
                          0
                        )
                      )}
                    </p>

                    <CustomButton onClick={handleCloseChaptersModal}>
                      Đóng
                    </CustomButton>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </Modal>

      {/* Modal tạo chương mới */}
      <Modal
        title={
          <div className="text-xl font-semibold">
            Tạo chương mới cho khóa học{" "}
            {selectedCourse ? `"${selectedCourse.name}"` : ""}
          </div>
        }
        open={isCreateChapterModalOpen}
        onCancel={handleCloseCreateChapterModal}
        footer={null}
        width={700}
        className="course-modal"
      >
        <div className="p-4">
          <ChapterForm form={chapterForm} loading={creatingChapter} />

          <div className="flex justify-end gap-3 mt-6">
            <CustomButton onClick={handleCloseCreateChapterModal}>
              Hủy bỏ
            </CustomButton>
            <CustomButton
              type="primary"
              onClick={handleSaveChapter}
              loading={creatingChapter}
            >
              Tạo mới chương
            </CustomButton>
          </div>
        </div>
      </Modal>

      {/* Modal cập nhật chương */}
      <Modal
        title={
          <div className="text-xl font-semibold">
            Cập nhật chương{" "}
            {selectedChapter ? `"${selectedChapter.title}"` : ""}
          </div>
        }
        open={isUpdateChapterModalOpen}
        onCancel={handleCloseUpdateChapterModal}
        footer={null}
        width={700}
        className="course-modal"
      >
        <div className="p-4">
          <ChapterForm form={updateChapterForm} loading={updatingChapter} />

          <div className="flex justify-end gap-3 mt-6">
            <CustomButton onClick={handleCloseUpdateChapterModal}>
              Hủy bỏ
            </CustomButton>
            <CustomButton
              type="primary"
              onClick={handleSaveUpdateChapter}
              loading={updatingChapter}
            >
              Cập nhật
            </CustomButton>
          </div>
        </div>
      </Modal>

      {/* Modal xem quiz */}
      <Modal
        title={
          <div className="text-xl font-semibold">Chi tiết bài kiểm tra</div>
        }
        open={isViewQuizModalOpen}
        onCancel={handleCloseQuizModal}
        footer={null}
        width={800}
        className="course-modal"
      >
        {selectedQuiz && (
          <div className="p-4">
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Thông tin chung
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-gray-600 block mb-1">
                            Mã bài kiểm tra
                          </label>
                          <input
                            type="text"
                            value={selectedQuiz.id}
                            readOnly
                            className="w-full p-2 bg-white border rounded-md"
                          />
                        </div>
                        <div>
                          <label className="text-gray-600 block mb-1">
                            Tiêu đề
                          </label>
                          <input
                            type="text"
                            value={selectedQuiz.title}
                            readOnly
                            className="w-full p-2 bg-white border rounded-md"
                          />
                        </div>
                        <div>
                          <label className="text-gray-600 block mb-1">
                            Master phụ trách
                          </label>
                          <input
                            type="text"
                            value={selectedQuiz.masterName}
                            readOnly
                            className="w-full p-2 bg-white border rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Thông tin chi tiết
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-gray-600 block mb-1">
                            Ngày tạo
                          </label>
                          <input
                            type="text"
                            value={selectedQuiz.createdDate}
                            readOnly
                            className="w-full p-2 bg-white border rounded-md"
                          />
                        </div>
                        <div>
                          <label className="text-gray-600 block mb-1">
                            Điểm số
                          </label>
                          <input
                            type="text"
                            value={selectedQuiz.score}
                            readOnly
                            className="w-full p-2 bg-white border rounded-md"
                          />
                        </div>
                        <div>
                          <label className="text-gray-600 block mb-1">
                            Trạng thái
                          </label>
                          <Tag
                            color={
                              selectedQuiz.score >= 80 ? "success" : "error"
                            }
                            className="text-sm px-3 py-1"
                          >
                            {selectedQuiz.score >= 80 ? "Đạt" : "Chưa đạt"}
                          </Tag>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>

              <Col span={24}>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">
                    Danh sách câu hỏi
                  </h3>
                  <div className="space-y-6">
                    {selectedQuiz.questions.map((question, index) => (
                      <div
                        key={question.id}
                        className="bg-white p-4 rounded-lg border"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-medium text-gray-800">
                            Câu {index + 1}: {question.question}
                          </h4>
                          <Tag color="blue">Điểm: {question.score}</Tag>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {question.options.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className={`p-2 rounded-md border ${
                                option.startsWith(question.correctAnswer)
                                  ? "border-green-500 bg-green-50"
                                  : "border-gray-200"
                              }`}
                            >
                              {option}
                              {option.startsWith(question.correctAnswer) && (
                                <span className="ml-2 text-green-600">
                                  (Đáp án đúng)
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Col>
            </Row>

            <div className="flex justify-end gap-3 mt-6">
              <CustomButton onClick={handleCloseQuizModal}>Đóng</CustomButton>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal tạo loại khóa học mới */}
      <Modal
        title={
          <div className="text-xl font-semibold">Tạo loại khóa học mới</div>
        }
        open={isCreateCategoryModalOpen}
        onCancel={handleCloseCreateCategoryModal}
        footer={null}
        width={500}
      >
        <div className="p-4">
          <Form form={categoryForm} layout="vertical">
            <Form.Item
              label="Tên loại khóa học"
              name="categoryName"
              rules={[
                { required: true, message: "Vui lòng nhập tên loại khóa học" },
                {
                  whitespace: true,
                  message: "Tên loại khóa học không được chỉ chứa khoảng trắng",
                },
                {
                  min: 2,
                  message: "Tên loại khóa học phải có ít nhất 2 ký tự",
                },
              ]}
            >
              <Input placeholder="Nhập tên loại khóa học" maxLength={100} />
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
                accept="image/*"
              >
                <div className="flex flex-col items-center">
                  <UploadCloud className="w-6 h-6 text-gray-400" />
                  <div className="mt-2">Tải lên</div>
                </div>
              </Upload>
            </Form.Item>
          </Form>

          <div className="flex justify-end gap-3 mt-6">
            <CustomButton onClick={handleCloseCreateCategoryModal}>
              Hủy bỏ
            </CustomButton>
            <CustomButton
              type="primary"
              onClick={handleCreateCategory}
              loading={loading}
            >
              Tạo mới
            </CustomButton>
          </div>
        </div>
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
