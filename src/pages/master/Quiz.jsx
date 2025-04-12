import React, { useState, useEffect } from "react";
import { Row, Col, Tag, message, Form, Input, Modal } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaArrowLeft,
} from "react-icons/fa";
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
} from "../../services/quiz.service";
import { getAllCourses } from "../../services/course.service";

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
      } else {
        console.warn("Received non-array data:", data);
        setQuizzes([]);
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      setError(error.toString());
      message.error(error.toString());
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

      const score = Number(values.score);
      if (isNaN(score) || score < 0 || score > 100) {
        throw new Error("Điểm số phải từ 0-100");
      }

      const quizRequest = {
        title: values.title.trim(),
        score: score,
        quizId: selectedQuiz.quizId,
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
            type="primary"
            danger
            size="small"
            onClick={() => handleDeleteQuiz(record)}
            icon={<FaTrash size={14} />}
          >
            Xóa
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
        description={`Danh sách các bài kiểm tra của khóa học ${courseId}`}
      />

      <div className="p-4 md:p-6">
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <BackButton to="/master/course-master" />
            <h2 className="text-xl font-semibold text-gray-800">
              {courseInfo ? courseInfo.name : "Đang tải..."}
            </h2>
          </div>
          <CustomButton
            type="primary"
            icon={<FaPlus size={14} />}
            onClick={handleOpenCreateModal}
          >
            Thêm bài kiểm tra mới
          </CustomButton>
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
              <div className="text-center p-8">
                <p className="text-gray-500 mb-4">
                  Khóa học này chưa có bài kiểm tra nào
                </p>
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
              rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
            >
              <Input placeholder="Nhập tiêu đề bài kiểm tra" />
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
              rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
            >
              <Input placeholder="Nhập tiêu đề bài kiểm tra" />
            </Form.Item>

            <Form.Item
              name="score"
              label="Điểm số"
              rules={[
                { required: true, message: "Vui lòng nhập điểm số" },
                {
                  type: "number",
                  transform: (value) => Number(value),
                  min: 0,
                  max: 100,
                  message: "Điểm phải từ 0-100",
                },
              ]}
            >
              <Input
                type="number"
                min={0}
                max={100}
                placeholder="Nhập điểm số (0-100)"
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (!isNaN(value)) {
                    editForm.setFieldsValue({ score: value });
                  }
                }}
              />
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
