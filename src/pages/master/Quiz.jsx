import React, { useState, useEffect } from "react";
import { Row, Col, Tag, message, Form, Input, Modal, Upload } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaQuestion,
  FaFileExcel,
} from "react-icons/fa";
import { UploadOutlined, InboxOutlined } from "@ant-design/icons";
import Header from "../../components/Common/Header";
import CustomButton from "../../components/Common/CustomButton";
import SearchBar from "../../components/Common/SearchBar";
import Pagination from "../../components/Common/Pagination";
import CustomTable from "../../components/Common/CustomTable";
import Error from "../../components/Common/Error";
import BackButton from "../../components/Common/BackButton";
import {
  getQuizzesByCourseId,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  importQuiz,
} from "../../services/quiz.service";
import { getAllCourses } from "../../services/course.service";
import { Trash2 } from "lucide-react";
import { Book } from "lucide-react";

const Quiz = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm] = Form.useForm();
  const [creatingQuiz, setCreatingQuiz] = useState(false);
  const [courseInfo, setCourseInfo] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm] = Form.useForm();
  const [editingQuiz, setEditingQuiz] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingQuiz, setDeletingQuiz] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const pageSize = 10;
  const [hasExistingQuiz, setHasExistingQuiz] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (courseId) {
      console.log("CourseId from params:", courseId);
      fetchCourseInfo();
      fetchQuizzes();
    } else {
      setError("Không tìm thấy mã khóa học");
      message.error("Không tìm thấy mã khóa học");
    }
  }, [courseId]);

  // Hàm lấy thông tin khóa học
  const fetchCourseInfo = async () => {
    try {
      setLoading(true);
      const response = await getAllCourses();

      if (response && response.isSuccess && Array.isArray(response.data)) {
        const course = response.data.find(
          (c) => c.courseId === courseId || c.id === courseId
        );
        if (course) {
          setCourseInfo({
            id: course.courseId || course.id,
            name: course.courseName || course.name,
            description: course.description,
          });
        } else {
          setError("Không tìm thấy thông tin khóa học");
          message.error("Không tìm thấy thông tin khóa học");
        }
      } else {
        setError("Không thể tải thông tin khóa học");
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin khóa học:", error);
      setError("Không thể tải thông tin khóa học. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("Fetching quizzes for courseId:", courseId);
      const data = await getQuizzesByCourseId(courseId);
      console.log("Received quiz data:", data);

      if (Array.isArray(data)) {
        setQuizzes(data);
        setHasExistingQuiz(data.length > 0);
      } else {
        console.warn("Received non-array data:", data);
        setQuizzes([]);
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      setError(error.toString());
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleViewQuiz = async (quiz) => {
    try {
      setLoadingQuiz(true);
      console.log("Fetching quiz details for:", quiz.quizId);
      const quizDetails = await getQuizById(quiz.quizId);
      console.log("Received quiz details:", quizDetails);

      if (quizDetails) {
        setSelectedQuiz(quizDetails);
        setIsViewModalOpen(true);
      } else {
        message.error("Không thể tải thông tin chi tiết bài kiểm tra");
      }
    } catch (error) {
      console.error("Error fetching quiz details:", error);
      message.error(error.toString());
    } finally {
      setLoadingQuiz(false);
    }
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedQuiz(null);
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    createForm.resetFields();
  };

  const handleCreateQuiz = async (values) => {
    console.log("handleCreateQuiz called");
    try {
      setCreatingQuiz(true);
      console.log("Creating quiz with values:", values);
      console.log("CourseId:", courseId);

      // Validate dữ liệu
      if (!values.title?.trim()) {
        throw new Error("Tiêu đề không được để trống");
      }

      if (!courseId) {
        throw new Error("Không tìm thấy mã khóa học");
      }

      // Tạo request object
      const quizRequest = {
        title: values.title.trim(),
        score: 0, // Mặc định là 0
      };

      console.log("Sending quiz request:", quizRequest);

      const result = await createQuiz(courseId, quizRequest);
      console.log("Create quiz result:", result);

      message.success("Tạo bài kiểm tra mới thành công!");
      handleCloseCreateModal();
      fetchQuizzes(); // Refresh danh sách
    } catch (error) {
      console.error("Error creating quiz:", error);
      message.error(error.toString());
    } finally {
      setCreatingQuiz(false);
    }
  };

  const handleEditQuiz = (quiz) => {
    editForm.setFieldsValue({
      title: quiz.title,
      score: quiz.score,
    });
    setSelectedQuiz(quiz);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedQuiz(null);
    editForm.resetFields();
  };

  const handleUpdateQuiz = async (values) => {
    try {
      setEditingQuiz(true);

      // Validate dữ liệu
      if (!values.title?.trim()) {
        throw new Error("Tiêu đề không được để trống");
      }

      const quizRequest = {
        title: values.title.trim(),
        quizId: selectedQuiz.quizId,
        score: selectedQuiz.score, // Giữ nguyên điểm số cũ
      };

      await updateQuiz(courseId, quizRequest);

      message.success("Cập nhật bài kiểm tra thành công!");
      handleCloseEditModal();
      fetchQuizzes();
    } catch (error) {
      console.error("Error updating quiz:", error);
      message.error(error.toString());
    } finally {
      setEditingQuiz(false);
    }
  };

  const handleDeleteQuiz = (quiz) => {
    setDeletingQuiz(quiz);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteQuiz(deletingQuiz.quizId);
      message.success("Xóa bài kiểm tra thành công!");
      setIsDeleteModalOpen(false);
      setDeletingQuiz(null);
      fetchQuizzes();
    } catch (error) {
      console.error("Error deleting quiz:", error);
      message.error(error.toString());
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeletingQuiz(null);
  };

  const handleOpenImportModal = () => {
    setIsImportModalOpen(true);
  };

  const handleCloseImportModal = () => {
    setIsImportModalOpen(false);
    setImportFile(null);
  };

  const handleFileChange = (info) => {
    console.log("File change event:", info);

    // Luôn lấy file mới nhất từ info (dù ở bất kỳ trạng thái nào)
    const fileObj =
      info.fileList.length > 0
        ? info.fileList[info.fileList.length - 1].originFileObj ||
          info.file.originFileObj
        : null;

    if (fileObj) {
      console.log("Setting file to state:", fileObj.name);
      setImportFile(fileObj);
    }

    // Thông báo dựa trên status
    if (info.file.status === "done") {
      message.success(`${info.file.name} đã sẵn sàng để import`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} tải lên thất bại.`);
    }
  };

  const handleImportExcel = async () => {
    // Lấy file từ DOM nếu state chưa có
    const uploadInput = document.querySelector(
      '.ant-upload input[type="file"]'
    );
    const selectedFile =
      uploadInput && uploadInput.files && uploadInput.files[0];

    // Sử dụng file từ state nếu có, nếu không thì dùng file từ DOM
    const fileToUse = importFile || selectedFile;

    console.log("Import file state:", importFile);
    console.log("Selected DOM file:", selectedFile);
    console.log("File to use:", fileToUse);

    if (!fileToUse) {
      message.error("Vui lòng chọn file Excel để import");
      return;
    }

    try {
      setUploading(true);

      // Tạo FormData
      const formData = new FormData();
      formData.append("file", fileToUse);

      // Nếu đang trong trang quiz, lấy quizId, nếu không thì lấy courseId
      const quizId = selectedQuiz?.quizId;
      if (quizId) {
        formData.append("quizId", quizId);
      } else {
        formData.append("courseId", courseId);
      }

      // Kiểm tra FormData
      console.log("FormData entries:");
      for (let pair of formData.entries()) {
        console.log(
          `- ${pair[0]}: ${
            typeof pair[1] === "object" ? "File: " + pair[1].name : pair[1]
          }`
        );
      }

      // Gọi API import
      const response = await importQuiz(formData);
      console.log("Import response:", response);

      if (response && response.isSuccess) {
        // Xử lý kết quả import thành công
        const importedData = response.data;

        if (Array.isArray(importedData) && importedData.length > 0) {
          // Hiển thị chi tiết
          let totalQuestions = 0;
          importedData.forEach((quiz) => {
            if (quiz.questions && Array.isArray(quiz.questions)) {
              totalQuestions += quiz.questions.length;
            }
          });

          Modal.success({
            title: "Import bài kiểm tra thành công!",
            content: (
              <div className="py-2">
                <p>
                  Đã import thành công {totalQuestions} câu hỏi từ file Excel.
                </p>
                <div className="mt-4 border-t pt-4">
                  <h4 className="font-medium mb-2">Chi tiết:</h4>
                  <ul className="list-disc pl-5 text-sm">
                    {importedData.map((quiz, index) => (
                      <li key={index} className="mb-2">
                        <strong>{quiz.title}</strong>:{" "}
                        {quiz.questions?.length || 0} câu hỏi
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ),
            okText: "Xác nhận",
            onOk: () => {
              handleCloseImportModal();
              fetchQuizzes();
            },
          });
        } else {
          message.success("Import bài kiểm tra thành công!");
          handleCloseImportModal();
          await fetchQuizzes();
        }
      } else {
        message.error(
          "Import bài kiểm tra thất bại. Vui lòng kiểm tra lại file của bạn."
        );
      }
    } catch (error) {
      console.error("Error importing quiz:", error);
      message.error(
        "Có lỗi xảy ra khi import bài kiểm tra: " +
          (error.message || "Lỗi không xác định")
      );
    } finally {
      setUploading(false);
    }
  };

  const columns = [
    {
      title: "Mã bài kiểm tra",
      dataIndex: "quizId",
      key: "quizId",
      width: "20%",
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      width: "35%",
    },
    {
      title: "Master phụ trách",
      dataIndex: "masterName",
      key: "masterName",
      width: "20%",
    },
    {
      title: "Điểm số",
      dataIndex: "score",
      key: "score",
      width: "10%",
      render: (score) => (
        <Tag color={score >= 80 ? "success" : "error"}>{score || 0}</Tag>
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
            onClick={() => handleViewQuiz(record)}
            icon={<FaEye size={14} />}
            loading={loadingQuiz && selectedQuiz?.quizId === record.quizId}
          >
            Xem
          </CustomButton>
          <CustomButton
            type="default"
            size="small"
            onClick={() => handleEditQuiz(record)}
            icon={<FaEdit size={14} />}
          >
            Cập nhật
          </CustomButton>
          <CustomButton
            type="text"
            danger
            size="small"
            onClick={() => handleDeleteQuiz(record)}
            icon={<Trash2 size={16} />}
          >
          </CustomButton>
        </div>
      ),
    },
  ];

  // Lọc dữ liệu theo từ khóa tìm kiếm
  const filteredQuizzes = (quizzes || []).filter(
    (quiz) =>
      (quiz?.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (quiz?.quizId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (quiz?.masterName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Phân trang dữ liệu
  const paginatedQuizzes = filteredQuizzes.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Quản lý bài kiểm tra"
        description={`Danh sách các bài kiểm tra của khóa học`}
      />

      <div className="p-4 md:p-6">
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <BackButton to="/master/course-master" />
            <h2 className="text-xl font-semibold text-gray-800">
              {courseInfo ? courseInfo.name : "Đang tải..."}
            </h2>
          </div>
          <div className="flex gap-2">
            <CustomButton
              type="default"
              onClick={() => navigate(`/master/course-chapters/${courseId}`)}
              icon={<Book size={14} />}
              className="mr-2"
            >
              Xem chương
            </CustomButton>
            <CustomButton
              type="default"
              onClick={handleOpenImportModal}
              icon={<FaFileExcel size={14} />}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              Import từ Excel
            </CustomButton>
            {!hasExistingQuiz && (
              <CustomButton
                type="primary"
                icon={<FaPlus size={14} />}
                onClick={handleOpenCreateModal}
              >
                Thêm bài kiểm tra mới
              </CustomButton>
            )}
          </div>
        </div>

        {loading ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">
              Đang tải danh sách bài kiểm tra...
            </p>
          </div>
        ) : (
          <>
            {quizzes.length === 0 ? (
              <div className="bg-white rounded-lg shadow">
                <div className="text-center p-8">
                  <p className="text-gray-500">
                    Khóa học này chưa có bài kiểm tra nào
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow">
                <CustomTable
                  columns={columns}
                  dataSource={paginatedQuizzes}
                  loading={loading}
                  pagination={false}
                  rowKey="quizId"
                />
                <div className="p-4">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(filteredQuizzes.length / pageSize)}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal xem chi tiết quiz */}
      <Modal
        title={
          <div className="text-xl font-semibold">Chi tiết bài kiểm tra</div>
        }
        open={isViewModalOpen}
        onCancel={handleCloseViewModal}
        footer={null}
        width={800}
        className="quiz-modal"
      >
        {selectedQuiz && (
          <div className="p-4">
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <div className="bg-gray-50 p-6 rounded-lg">
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
                            value={selectedQuiz.quizId || ""}
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
                            value={selectedQuiz.title || ""}
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
                            value={selectedQuiz.masterName || ""}
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
                            Điểm số
                          </label>
                          <input
                            type="text"
                            value={selectedQuiz.score || 0}
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
            </Row>

            <div className="flex justify-end gap-3 mt-6">
              <CustomButton
                type="primary"
                onClick={() =>
                  navigate(`/master/quiz/${selectedQuiz.quizId}/questions`)
                }
              >
                Câu hỏi
              </CustomButton>
              <CustomButton onClick={handleCloseViewModal}>Đóng</CustomButton>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal tạo quiz mới */}
      <Modal
        title={
          <div className="text-xl font-semibold">Tạo bài kiểm tra mới</div>
        }
        open={isCreateModalOpen}
        onCancel={handleCloseCreateModal}
        footer={null}
        width={600}
        className="quiz-modal"
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={(values) => {
            console.log("Form submitted with values:", values);
            handleCreateQuiz(values);
          }}
          onFinishFailed={(errorInfo) => {
            console.log("Form validation failed:", errorInfo);
          }}
          initialValues={{
            title: "",
          }}
        >
          <div className="p-4">
            <Form.Item
              name="title"
              label="Tiêu đề bài kiểm tra"
              rules={[
                { required: true, message: "Vui lòng nhập tiêu đề bài kiểm tra" },
                { whitespace: true, message: "Tiêu đề không được chỉ chứa khoảng trắng" },
                { min: 5, message: "Tiêu đề phải có ít nhất 5 ký tự" },
                { max: 200, message: "Tiêu đề không được vượt quá 200 ký tự" },
                {
                  validator: async (_, value) => {
                    if (value) {
                      const specialChars = /[!@#$%^&*()_+\=\[\]{};':"\\|,.<>?~]/;
                      if (specialChars.test(value)) {
                        return Promise.reject('Tiêu đề không được chứa ký tự đặc biệt');
                      }
                      if (/^\d+$/.test(value.trim())) {
                        return Promise.reject('Tiêu đề không được chỉ chứa số');
                      }
                    }
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <Input placeholder="Nhập tiêu đề bài kiểm tra" maxLength={200} />
            </Form.Item>

            <div className="flex justify-end gap-3 mt-6">
              <CustomButton onClick={handleCloseCreateModal}>Hủy</CustomButton>
              <CustomButton
                type="primary"
                htmlType="submit"
                loading={creatingQuiz}
              >
                Tạo mới
              </CustomButton>
            </div>
          </div>
        </Form>
      </Modal>

      {/* Modal chỉnh sửa quiz */}
      <Modal
        title={
          <div className="text-xl font-semibold">Chỉnh sửa bài kiểm tra</div>
        }
        open={isEditModalOpen}
        onCancel={handleCloseEditModal}
        footer={null}
        width={600}
        className="quiz-modal"
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleUpdateQuiz}
          onFinishFailed={(errorInfo) => {
            console.log("Form validation failed:", errorInfo);
          }}
        >
          <div className="p-4">
            <Form.Item
              name="title"
              label="Tiêu đề bài kiểm tra"
              rules={[
                { required: true, message: "Vui lòng nhập tiêu đề" },
                { whitespace: true, message: "Tiêu đề không được chỉ chứa khoảng trắng" },
                { min: 5, message: "Tiêu đề phải có ít nhất 5 ký tự" },
                { max: 200, message: "Tiêu đề không được vượt quá 200 ký tự" },
                {
                  validator: async (_, value) => {
                    if (value) {
                      const specialChars = /[!@#$%^&*()_+\=\[\]{};':"\\|,.<>?~]/;
                      if (specialChars.test(value)) {
                        return Promise.reject('Tiêu đề không được chứa ký tự đặc biệt');
                      }
                      if (/^\d+$/.test(value.trim())) {
                        return Promise.reject('Tiêu đề không được chỉ chứa số');
                      }
                    }
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <Input placeholder="Nhập tiêu đề bài kiểm tra" maxLength={200} />
            </Form.Item>

            <div className="flex justify-end gap-3 mt-6">
              <CustomButton onClick={handleCloseEditModal}>Hủy</CustomButton>
              <CustomButton
                type="primary"
                htmlType="submit"
                loading={editingQuiz}
              >
                Cập nhật
              </CustomButton>
            </div>
          </div>
        </Form>
      </Modal>

      {/* Modal xác nhận xóa */}
      <Modal
        title={
          <div className="text-xl font-semibold text-red-600">
            Xác nhận xóa bài kiểm tra
          </div>
        }
        open={isDeleteModalOpen}
        onCancel={handleCancelDelete}
        footer={null}
        width={500}
        className="quiz-modal"
      >
        <div className="p-4">
          <div className="mb-6">
            <p className="text-gray-600">
              Bạn có chắc chắn muốn xóa bài kiểm tra này?
            </p>
            {deletingQuiz && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="font-medium">{deletingQuiz.title}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Mã bài kiểm tra: {deletingQuiz.quizId}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <CustomButton onClick={handleCancelDelete}>Hủy</CustomButton>
            <CustomButton
              type="primary"
              danger
              onClick={handleConfirmDelete}
              loading={isDeleting}
            >
              Xác nhận xóa
            </CustomButton>
          </div>
        </div>
      </Modal>

      {/* Modal import quiz từ Excel */}
      <Modal
        title={
          <div className="text-xl font-semibold">
            Import bài kiểm tra từ Excel
          </div>
        }
        open={isImportModalOpen}
        onCancel={handleCloseImportModal}
        footer={null}
        width={600}
        className="quiz-modal"
      >
        <div className="p-4">
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Sử dụng tính năng này để import bài kiểm tra và câu hỏi từ file
              Excel. Vui lòng đảm bảo file Excel của bạn tuân theo định dạng
              mẫu.
            </p>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4">
              <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                Lưu ý quan trọng
              </h4>
              <ul className="list-disc pl-5 text-sm text-yellow-700">
                <li>File Excel phải đúng định dạng mẫu</li>
                <li>Mỗi bài kiểm tra cần có ít nhất 1 câu hỏi</li>
                <li>Mỗi câu hỏi phải có đúng 1 đáp án đúng</li>
                <li>Kích thước file tối đa 5MB</li>
              </ul>
            </div>

            <Upload.Dragger
              name="file"
              multiple={false}
              maxCount={1}
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              beforeUpload={(file) => {
                // Lưu ngay file vào state khi chọn
                setImportFile(file);
                console.log("Set file in beforeUpload:", file.name);

                const isExcel =
                  file.type ===
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
                  file.type === "application/vnd.ms-excel";
                if (!isExcel) {
                  message.error("Chỉ chấp nhận file Excel (.xlsx, .xls)");
                }

                const isLt5M = file.size / 1024 / 1024 < 5;
                if (!isLt5M) {
                  message.error("File phải nhỏ hơn 5MB!");
                }

                // Return false để tránh auto upload, nhưng vẫn hiện file trong list
                return false;
              }}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined style={{ fontSize: "48px", color: "#1890ff" }} />
              </p>
              <p className="ant-upload-text font-medium">
                Nhấp hoặc kéo thả file Excel vào đây
              </p>
              <p className="ant-upload-hint text-sm text-gray-500">
                Hỗ trợ tải lên file Excel (.xlsx, .xls)
              </p>
            </Upload.Dragger>

            {importFile && (
              <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200 flex items-center">
                <div className="text-blue-600 mr-2">
                  <FaFileExcel size={20} />
                </div>
                <div className="flex-1 text-sm">
                  <div className="font-medium">{importFile.name}</div>
                  <div className="text-xs text-gray-500">
                    {(importFile.size / 1024).toFixed(2)} KB
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 text-center">
              <CustomButton
                type="default"
                className="bg-blue-500 hover:bg-blue-600 text-white mr-2"
                onClick={() => {
                  const a = document.createElement("a");
                  a.href = "/templates/quiz_template.xlsx";
                  a.download = "quiz_template.xlsx";
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  message.info("Đang tải xuống file mẫu...");
                }}
              >
                Tải xuống file mẫu
              </CustomButton>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <CustomButton onClick={handleCloseImportModal}>Hủy</CustomButton>
            <CustomButton
              type="primary"
              onClick={handleImportExcel}
              loading={uploading}
              icon={<UploadOutlined />}
              disabled={!importFile}
            >
              Import
            </CustomButton>
          </div>
        </div>
      </Modal>

      <style jsx>{`
        .quiz-modal .ant-modal-content {
          border-radius: 12px;
          overflow: hidden;
        }
        .quiz-modal .ant-modal-header {
          border-bottom: 1px solid #f0f0f0;
          padding: 16px 24px;
        }
        .quiz-modal .ant-modal-body {
          padding: 12px;
        }
        .quiz-modal .ant-modal-footer {
          border-top: 1px solid #f0f0f0;
        }
      `}</style>
    </div>
  );
};

export default Quiz;
