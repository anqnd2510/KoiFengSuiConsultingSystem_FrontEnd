import React, { useState, useEffect } from "react";
import { Row, Col, Tag, message, Form, Input, Modal, Radio } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPlus, FaEdit, FaEye } from "react-icons/fa";
import { Trash2 } from "lucide-react";
import Header from "../../components/Common/Header";
import CustomButton from "../../components/Common/CustomButton";
import CustomTable from "../../components/Common/CustomTable";
import Pagination from "../../components/Common/Pagination";
import Error from "../../components/Common/Error";
import {
  getQuestionsByQuizId,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestionById,
} from "../../services/question.service";
import { getAnswerById } from "../../services/answer.service";
import { getAllCourses } from "../../services/course.service";
import { getQuizById } from "../../services/quiz.service";

const Question = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm] = Form.useForm();
  const [creatingQuestion, setCreatingQuestion] = useState(false);
  const pageSize = 10;
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm] = Form.useForm();
  const [editingQuestion, setEditingQuestion] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingQuestion, setDeletingQuestion] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [answerDetails, setAnswerDetails] = useState(null);
  const [loadingAnswer, setLoadingAnswer] = useState(false);
  const [courseInfo, setCourseInfo] = useState(null);

  useEffect(() => {
    if (quizId) {
      fetchQuestions();
      fetchCourseInfo();
    }
  }, [quizId]);

  const fetchCourseInfo = async () => {
    try {
      setLoading(true);
      setError("");

      // 1. Lấy thông tin quiz từ quizId
      console.log("Getting quiz info for quizId:", quizId);
      const quizResponse = await getQuizById(quizId);
      console.log("Quiz Response full:", quizResponse);

      // Kiểm tra response của quiz và lấy data
      let quizData;
      if (quizResponse?.data) {
        quizData = quizResponse.data;
      } else if (quizResponse) {
        quizData = quizResponse;
      } else {
        console.error("Quiz Response không hợp lệ:", quizResponse);
        setError("Không thể lấy thông tin bài kiểm tra");
        message.error("Không thể lấy thông tin bài kiểm tra");
        return;
      }

      console.log("Quiz Data after processing:", quizData);

      // 2. Lấy courseId từ quiz data
      const courseId = quizData.courseId || quizData.CourseId;
      console.log("Found courseId:", courseId);

      if (!courseId) {
        console.error("Không tìm thấy courseId trong quiz data:", quizData);
        setError("Không tìm thấy courseId");
        message.error("Không tìm thấy courseId");
        return;
      }

      // 3. Lấy danh sách khóa học
      console.log("Getting courses for courseId:", courseId);
      const courseResponse = await getAllCourses();
      console.log("Course Response full:", courseResponse);

      // Kiểm tra và xử lý response của courses
      let coursesData = [];
      if (courseResponse?.data?.data) {
        coursesData = courseResponse.data.data;
      } else if (courseResponse?.data) {
        coursesData = courseResponse.data;
      } else if (Array.isArray(courseResponse)) {
        coursesData = courseResponse;
      }

      console.log("Courses data after processing:", coursesData);

      // Tìm khóa học phù hợp
      const course = coursesData.find(c => 
        c.courseId === courseId || 
        c.id === courseId || 
        c.CourseId === courseId
      );
      console.log("Found course:", course);

      if (!course) {
        console.error("Không tìm thấy khóa học với ID:", courseId);
        setError(`Không tìm thấy khóa học với ID: ${courseId}`);
        message.error(`Không tìm thấy khóa học với ID: ${courseId}`);
        return;
      }

      // 5. Lưu thông tin khóa học vào state
      const courseInfo = {
        id: course.courseId || course.CourseId || course.id,
        name: course.courseName || course.name || course.Name,
        description: course.description || course.Description || "",
        status: course.status || course.Status || "Inactive"
      };

      console.log("Setting courseInfo:", courseInfo);
      console.log("Course status:", courseInfo.status);
      setCourseInfo(courseInfo);

    } catch (error) {
      console.error("Chi tiết lỗi:", error);
      setError("Không thể tải thông tin khóa học");
      message.error("Không thể tải thông tin khóa học");
    } finally {
      setLoading(false);
    }
  };

  // Thêm useEffect để log mỗi khi courseInfo thay đổi
  useEffect(() => {
    if (courseInfo) {
      console.log("CourseInfo updated:", courseInfo);
      console.log("Course status:", courseInfo.status);
    }
  }, [courseInfo]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("Vui lòng đăng nhập lại");
        message.error("Vui lòng đăng nhập lại");
        navigate("/login");
        return;
      }

      const response = await getQuestionsByQuizId(quizId);
      console.log("API Response:", response);

      if (response?.data?.data) {
        setQuestions(response.data.data);
      } else if (response?.data) {
        setQuestions(response.data);
      } else {
        setQuestions([]);
        console.warn("Không có dữ liệu câu hỏi");
      }
    } catch (err) {
      console.error("Error fetching questions:", err);
      if (err.response?.status === 401) {
        setError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại");
        navigate("/login");
      } else {
        setError("Không thể tải danh sách câu hỏi");
      }
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    createForm.resetFields();
  };

  const handleCreateQuestion = async (values) => {
    try {
      setCreatingQuestion(true);

      const questionRequest = {
        questionText: values.questionText.trim(),
        questionType: values.questionType || "Multiple Choice",
        point: Number(values.point) || 1,
        quizId: quizId,
        answers: values.answers.map((answer, index) => ({
          optionText: answer.optionText.trim(),
          optionType: answer.optionType || "Text",
          //isCorrect: index === values.correctAnswer,
          isCorrect: answer.isCorrect,
          createAt: new Date().toISOString(),
        })),
      };

      // Log để kiểm tra dữ liệu gửi đi
      console.log("Request data:", JSON.stringify(questionRequest, null, 2));

      const response = await createQuestion(quizId, questionRequest);
      console.log("Response:", response);

      if (response?.data?.isSuccess) {
        handleCloseCreateModal();
        await fetchQuestions();
        message.success("Tạo câu hỏi và đáp án thành công!");
      } else {
        throw new Error(response?.data?.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Error creating question:", error);
      console.error("Error details:", error.response?.data);
      message.error(error.message || "Có lỗi xảy ra khi tạo câu hỏi");
    } finally {
      setCreatingQuestion(false);
    }
  };

  const handleEditQuestion = async (question) => {
    try {
      setLoading(true);

      // Sử dụng API getQuestionById để lấy thông tin mới nhất
      const questionData = await getQuestionById(question.questionId);
      console.log("Question details for edit:", questionData);

      if (questionData) {
        // Format lại dữ liệu câu hỏi và đáp án
        const formattedQuestion = {
          ...questionData,
          answers: questionData.answers.map((answer) => ({
            ...answer,
            optionText: answer.optionText || "",
            isCorrect: answer.isCorrect || false,
          })),
        };

        setSelectedQuestion(formattedQuestion);

        // Set giá trị form với dữ liệu mới nhất
        editForm.setFieldsValue({
          questionText: formattedQuestion.questionText,
          questionType: formattedQuestion.questionType,
          point: formattedQuestion.point,
          answerUpdateRequests: formattedQuestion.answers.map((answer) => ({
            ...answer,
            optionText: answer.optionText || "",
            isCorrect: answer.isCorrect || false,
          })),
        });

        setIsEditModalOpen(true);
      } else {
        message.error("Không thể tải thông tin chi tiết câu hỏi");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật câu hỏi:", error);
      message.error("Không thể tải thông tin chi tiết câu hỏi");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedQuestion(null);
    editForm.resetFields();
  };

  const handleUpdateQuestion = async (values) => {
    try {
      setEditingQuestion(true);

      // Validate dữ liệu đầu vào
      if (!values.questionText?.trim()) {
        throw new Error("Vui lòng nhập nội dung câu hỏi");
      }

      // Cập nhật câu hỏi với answerUpdateRequests
      const questionRequest = {
        questionText: values.questionText.trim(),
        answerUpdateRequests: values.answerUpdateRequests.map(
          (answer, index) => ({
            answerId: selectedQuestion.answers[index].answerId,
            optionText: answer.optionText.trim(),
            optionType: "Text",
            isCorrect: answer.isCorrect,
          })
        ),
      };

      console.log("Update request:", questionRequest);

      await updateQuestion(selectedQuestion.questionId, questionRequest);

      message.success("Cập nhật câu hỏi thành công!");
      handleCloseEditModal();
      fetchQuestions();
    } catch (error) {
      console.error("Error updating question:", error);
      message.error(error.message || "Có lỗi xảy ra khi cập nhật câu hỏi");
    } finally {
      setEditingQuestion(false);
    }
  };

  const handleDeleteQuestion = (question) => {
    setDeletingQuestion(question);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteQuestion(deletingQuestion.questionId);
      message.success("Xóa câu hỏi thành công!");
      setIsDeleteModalOpen(false);
      setDeletingQuestion(null);
      fetchQuestions();
    } catch (error) {
      console.error("Error deleting question:", error);
      message.error(error.toString());
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeletingQuestion(null);
  };

  const fetchAnswerDetails = async (answerId) => {
    try {
      setLoadingAnswer(true);
      // Bỏ qua việc fetch chi tiết đáp án vì không cần thiết
      // const data = await getAnswerById(answerId);
      // setAnswerDetails(data);
    } catch (error) {
      console.error("Error fetching answer details:", error);
      message.error("Không thể tải thông tin đáp án");
    } finally {
      setLoadingAnswer(false);
    }
  };

  const handleViewQuestion = async (question) => {
    try {
      setLoading(true);

      // Sử dụng API getQuestionById để lấy chi tiết câu hỏi
      const questionData = await getQuestionById(question.questionId);
      console.log("Question details:", questionData);

      if (questionData) {
        // Format lại dữ liệu câu hỏi và đáp án
        const formattedQuestion = {
          ...questionData,
          answers: questionData.answers.map((answer) => ({
            ...answer,
            optionText: answer.optionText || "",
            isCorrect: answer.isCorrect || false,
          })),
        };

        setSelectedQuestion(formattedQuestion);
        setIsViewModalOpen(true);
      } else {
        message.error("Không thể tải thông tin chi tiết câu hỏi");
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      message.error("Không thể tải thông tin chi tiết câu hỏi");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedQuestion(null);
  };

  const columns = [
    {
      title: "Mã câu hỏi",
      dataIndex: "questionId",
      key: "questionId",
      width: "20%",
    },
    {
      title: "Nội dung câu hỏi",
      dataIndex: "questionText",
      key: "questionText",
      width: "45%",
    },
    {
      title: "Điểm",
      dataIndex: "point",
      key: "point",
      width: "15%",
      render: (point) => <Tag color="blue">{point}</Tag>,
    },
    {
      title: "Hành động",
      key: "action",
      width: "20%",
      render: (_, record) => (
        <div className="flex gap-2">
          <CustomButton
            type="primary"
            size="small"
            onClick={() => handleViewQuestion(record)}
            icon={<FaEye size={14} />}
          >
            Xem
          </CustomButton>
          <CustomButton
            type="default"
            size="small"
            onClick={() => handleEditQuestion(record)}
            icon={<FaEdit size={14} />}
            disabled={courseInfo?.status === "Active"}
            className={`${courseInfo?.status === "Active" ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
          >
            Cập nhật
          </CustomButton>
          <CustomButton
            type="text"
            danger
            size="small"
            onClick={() => handleDeleteQuestion(record)}
            icon={<Trash2 size={16} />}
            disabled={courseInfo?.status === "Active"}
            className={`${courseInfo?.status === "Active" ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
          >
          
          </CustomButton>
        </div>
      ),
    },
  ];

  // Phân trang dữ liệu
  const paginatedQuestions = questions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Thêm styles mới
  const answerStyles = {
    correct: {
      backgroundColor: "#4CAF50",
      color: "white",
      border: "2px solid #45a049",
    },
    incorrect: {
      backgroundColor: "#ff4444",
      color: "white",
      border: "2px solid #cc0000",
    },
    default: {
      backgroundColor: "#f0f0f0",
      border: "2px solid #d9d9d9",
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Quản lý câu hỏi"
        description={`Danh sách câu hỏi của bài kiểm tra`}
      />

      <div className="p-4 md:p-6">
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <CustomButton
              type="default"
              icon={<FaArrowLeft size={14} />}
              onClick={handleGoBack}
            >
              Quay lại
            </CustomButton>
            <h2 className="text-xl font-semibold text-gray-800">
              Danh sách câu hỏi
            </h2>
          </div>
          <div className="flex gap-2">
            <CustomButton
              type="primary"
              icon={<FaPlus size={14} />}
              onClick={handleOpenCreateModal}
              disabled={courseInfo?.status === "Active"}
              className={`${courseInfo?.status === "Active" ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
            >
              Thêm câu hỏi mới
            </CustomButton>
          </div>
        </div>

        {loading ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải danh sách câu hỏi...</p>
          </div>
        ) : (
          <>
            {questions.length === 0 ? (
              <div className="text-center p-8">
                <p className="text-gray-500 mb-4">
                  Khóa học này chưa có câu hỏi nào
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow">
                <CustomTable
                  columns={columns}
                  dataSource={paginatedQuestions}
                  loading={loading}
                  pagination={false}
                  rowKey="questionId"
                />
                <div className="p-4">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(questions.length / pageSize)}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal tạo câu hỏi mới */}
      <Modal
        title={<div className="text-xl font-semibold">Thêm câu hỏi mới</div>}
        open={isCreateModalOpen}
        onCancel={handleCloseCreateModal}
        footer={null}
        width={800}
        className="question-modal"
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreateQuestion}
          initialValues={{
            questionType: "Multiple Choice",
            point: 1,
            answers: [
              { optionText: "", isCorrect: true },
              { optionText: "", isCorrect: false },
              { optionText: "", isCorrect: false },
              { optionText: "", isCorrect: false },
            ],
            correctAnswer: 0,
          }}
        >
          <div className="p-4">
            <div className="mb-8">
              <Form.Item
                name="questionText"
                rules={[
                  { required: true, message: "Vui lòng nhập nội dung câu hỏi" },
                  { whitespace: true, message: "Nội dung không được chỉ chứa khoảng trắng" },
                  { max: 1000, message: "Nội dung không được vượt quá 1000 ký tự" },
                  {
                    validator: async (_, value) => {
                      if (value) {
                        const trimmedValue = value.trim();
                        
                        if (/^\d+$/.test(trimmedValue)) {
                          return Promise.reject('Nội dung không được chỉ chứa số');
                        }
                      }
                      return Promise.resolve();
                    }
                  }
                ]}
              >
                <Input.TextArea
                  rows={3}
                  placeholder="Nhập câu hỏi của bạn ở đây..."
                  className="text-lg"
                  style={{ fontSize: "1.2rem", padding: "15px" }}
                  maxLength={1000}
                />
              </Form.Item>
            </div>

            {/* Thêm phần đáp án */}
            <div className="mb-8">
              <div className="text-base font-medium mb-4">Đáp án</div>
              <Form.List name="answers">
                {(fields) => (
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <div
                        key={field.key}
                        className="p-4 border rounded-lg hover:border-blue-500 transition-all"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full text-blue-600 font-medium">
                            {String.fromCharCode(65 + index)}
                          </div>
                          <Form.Item
                            name="correctAnswer"
                            initialValue={0}
                            noStyle
                          >
                            <Radio
                              value={index}
                              checked={
                                createForm.getFieldValue("correctAnswer") ===
                                index
                              }
                              onChange={() => {
                                // Cập nhật correctAnswer khi radio thay đổi
                                createForm.setFieldsValue({
                                  correctAnswer: index,
                                });

                                // Cập nhật lại isCorrect cho tất cả answers
                                const currentAnswers =
                                  createForm.getFieldValue("answers");
                                const updatedAnswers = currentAnswers.map(
                                  (ans, idx) => ({
                                    ...ans,
                                    isCorrect: idx === index,
                                  })
                                );
                                createForm.setFieldsValue({
                                  answers: updatedAnswers,
                                });
                              }}
                            >
                              Đáp án đúng
                            </Radio>
                          </Form.Item>
                        </div>

                        <Form.Item
                          {...field}
                          name={[field.name, "optionText"]}
                          rules={[
                            { required: true, message: "Vui lòng nhập đáp án" },
                            { whitespace: true, message: "Đáp án không được chỉ chứa khoảng trắng" },
                            { min: 1, message: "Đáp án phải có ít nhất 1 ký tự" },
                            { max: 500, message: "Đáp án không được vượt quá 500 ký tự" },
                            {
                              validator: async (_, value) => {
                                if (value) {
                                  const trimmedValue = value.trim();
                                  if (trimmedValue.length < 1) {
                                    return Promise.reject('Đáp án không được để trống');
                                  }
                                }
                                return Promise.resolve();
                              }
                            }
                          ]}
                        >
                          <Input.TextArea
                            rows={2}
                            placeholder={`Nhập đáp án ${String.fromCharCode(
                              65 + index
                            )}`}
                            className="answer-input"
                            style={{
                              resize: "none",
                              backgroundColor:
                                createForm.getFieldValue("correctAnswer") ===
                                index
                                  ? "#e8f5e9"
                                  : "#ffffff",
                            }}
                            maxLength={500}
                          />
                        </Form.Item>
                      </div>
                    ))}
                  </div>
                )}
              </Form.List>
            </div>

            <div className="flex justify-between items-center mt-8">
              <div>{/* Đã xóa phần điểm và loại câu hỏi */}</div>

              <div className="flex gap-3">
                <CustomButton onClick={handleCloseCreateModal}>
                  Hủy
                </CustomButton>
                <CustomButton
                  type="primary"
                  htmlType="submit"
                  loading={creatingQuestion}
                >
                  Tạo mới
                </CustomButton>
              </div>
            </div>
          </div>
        </Form>
      </Modal>

      {/* Modal xem chi tiết câu hỏi */}
      <Modal
        title={<div className="text-xl font-semibold">Chi tiết câu hỏi</div>}
        open={isViewModalOpen}
        onCancel={handleCloseViewModal}
        footer={null}
        width={800}
        className="question-modal"
      >
        {selectedQuestion && (
          <div className="p-4">
            <div className="mb-8">
              <div className="text-lg font-medium mb-4">
                {selectedQuestion.questionText}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {selectedQuestion.answers?.map((answer, index) => (
                  <div
                    key={answer.answerId || index}
                    className={`p-4 rounded-lg border-2 ${
                      answer.isCorrect
                        ? "border-green-500 bg-green-50"
                        : "border-red-500 bg-red-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full ${
                          answer.isCorrect
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {String.fromCharCode(65 + index)}
                      </div>
                      <div className="flex-1">
                        <div className="text-base">{answer.optionText}</div>
                        {loadingAnswer ? (
                          <div className="text-sm mt-1 text-gray-500">
                            Đang tải...
                          </div>
                        ) : (
                          <>
                            <div
                              className={`text-sm mt-1 ${
                                answer.isCorrect
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {answer.isCorrect ? "Đáp án đúng" : "Đáp án sai"}
                            </div>
                            {answerDetails && (
                              <div className="text-sm mt-1 text-gray-500">
                                ID: {answer.answerId}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-gray-500 text-sm mb-1">Mã câu hỏi</div>
                <div className="font-medium">{selectedQuestion.questionId}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-gray-500 text-sm mb-1">Điểm số</div>
                <Tag color="blue" className="text-lg px-4 py-1">
                  {selectedQuestion.point || 0}
                </Tag>
              </div>
            </div>

            <div className="flex justify-end">
              <CustomButton onClick={handleCloseViewModal}>Đóng</CustomButton>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal cập nhật câu hỏi */}
      <Modal
        title={<div className="text-xl font-semibold">Cập nhật câu hỏi</div>}
        open={isEditModalOpen}
        onCancel={handleCloseEditModal}
        footer={null}
        width={800}
        className="question-modal"
      >
        <Form form={editForm} layout="vertical" onFinish={handleUpdateQuestion}>
          <div className="p-4">
            <div className="mb-8">
              <Form.Item
                name="questionText"
                rules={[
                  { required: true, message: "Vui lòng nhập nội dung câu hỏi" },
                  { whitespace: true, message: "Nội dung không được chỉ chứa khoảng trắng" },
                  { min: 10, message: "Nội dung phải có ít nhất 10 ký tự" },
                  { max: 1000, message: "Nội dung không được vượt quá 1000 ký tự" },
                  {
                    validator: async (_, value) => {
                      if (value) {
                        const trimmedValue = value.trim();
                     
                        if (/^\d+$/.test(trimmedValue)) {
                          return Promise.reject('Nội dung không được chỉ chứa số');
                        }
                      }
                      return Promise.resolve();
                    }
                  }
                ]}
              >
                <Input.TextArea
                  rows={3}
                  placeholder="Nhập câu hỏi của bạn ở đây..."
                  className="text-lg"
                  style={{ fontSize: "1.2rem", padding: "15px" }}
                  maxLength={1000}
                />
              </Form.Item>
            </div>

            <Form.List name="answerUpdateRequests">
              {(fields) => (
                <div className="grid grid-cols-2 gap-4">
                  {fields.map((field, index) => (
                    <div key={field.key}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 flex items-center justify-center">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <Form.Item
                          {...field}
                          name={[field.name, "isCorrect"]}
                          valuePropName="checked"
                        >
                          <Radio
                            onChange={(e) => {
                              // Cập nhật lại isCorrect cho tất cả các đáp án
                              const currentAnswers = editForm.getFieldValue(
                                "answerUpdateRequests"
                              );
                              const updatedAnswers = currentAnswers.map(
                                (ans, idx) => ({
                                  ...ans,
                                  isCorrect: idx === index,
                                })
                              );
                              editForm.setFieldsValue({
                                answerUpdateRequests: updatedAnswers,
                              });
                            }}
                          >
                            Đáp án đúng
                          </Radio>
                        </Form.Item>
                      </div>

                      <Form.Item
                        {...field}
                        name={[field.name, "optionText"]}
                        rules={[
                          { required: true, message: "Vui lòng nhập đáp án" },
                          { whitespace: true, message: "Đáp án không được chỉ chứa khoảng trắng" },
                          { min: 1, message: "Đáp án phải có ít nhất 1 ký tự" },
                          { max: 500, message: "Đáp án không được vượt quá 500 ký tự" },
                          {
                            validator: async (_, value) => {
                              if (value) {
                                const trimmedValue = value.trim();
                                if (trimmedValue.length < 1) {
                                  return Promise.reject('Đáp án không được để trống');
                                }
                              }
                              return Promise.resolve();
                            }
                          }
                        ]}
                      >
                        <Input.TextArea
                          rows={2}
                          placeholder={`Đáp án ${String.fromCharCode(65 + index)}`}
                          className="answer-input"
                          style={{
                            resize: "none",
                            backgroundColor: editForm.getFieldValue(["answerUpdateRequests", index, "isCorrect"]) ? "#e8f5e9" : "#f5f5f5",
                          }}
                          maxLength={500}
                        />
                      </Form.Item>
                    </div>
                  ))}
                </div>
              )}
            </Form.List>

            <div className="flex justify-between items-center mt-8">
              <div>{/* Đã xóa phần điểm và loại câu hỏi */}</div>

              <div className="flex gap-3">
                <CustomButton onClick={handleCloseEditModal}>Hủy</CustomButton>
                <CustomButton
                  type="primary"
                  htmlType="submit"
                  loading={editingQuestion}
                >
                  Cập nhật
                </CustomButton>
              </div>
            </div>
          </div>
        </Form>
      </Modal>

      {/* Modal xác nhận xóa */}
      <Modal
        title={
          <div className="text-xl font-semibold text-red-600">
            Xác nhận xóa câu hỏi
          </div>
        }
        open={isDeleteModalOpen}
        onCancel={handleCancelDelete}
        footer={null}
        width={500}
        className="question-modal"
      >
        <div className="p-4">
          <div className="mb-6">
            <p className="text-gray-600">
              Bạn có chắc chắn muốn xóa câu hỏi này?
            </p>
            {deletingQuestion && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-800">
                  {deletingQuestion.questionText}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Tag color="blue">{deletingQuestion.questionType}</Tag>
                  <Tag color="orange">Điểm: {deletingQuestion.point}</Tag>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Mã câu hỏi: {deletingQuestion.questionId}
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
              Xóa
            </CustomButton>
          </div>
        </div>
      </Modal>

      {/* Thêm styles mới */}
      <style jsx>{`
        .question-modal .ant-modal-content {
          border-radius: 12px;
          overflow: hidden;
        }

        .question-modal .ant-modal-body {
          padding: 20px;
        }

        .question-modal .answer-option {
          transition: all 0.3s ease;
        }

        .question-modal .answer-option:hover {
          transform: translateY(-2px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .answer-modal .ant-modal-content {
          border-radius: 12px;
          overflow: hidden;
        }

        .answer-modal .ant-modal-body {
          padding: 20px;
        }

        .answer-input {
          border-radius: 8px;
          border: 1px solid #d9d9d9;
          transition: all 0.3s ease;
        }

        .answer-input:hover {
          border-color: #40a9ff;
        }

        .answer-input:focus {
          border-color: #40a9ff;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        }
      `}</style>

      {/* Thêm styles cho các nút disabled */}
      <style jsx global>{`
        .ant-btn[disabled] {
          opacity: 0.5 !important;
          cursor: not-allowed !important;
          pointer-events: none !important;
          background-color: #f5f5f5 !important;
          border-color: #d9d9d9 !important;
          color: rgba(0, 0, 0, 0.25) !important;
          box-shadow: none !important;
        }

        .ant-btn[disabled]:hover,
        .ant-btn[disabled]:focus,
        .ant-btn[disabled]:active {
          opacity: 0.5 !important;
          cursor: not-allowed !important;
          pointer-events: none !important;
          background-color: #f5f5f5 !important;
          border-color: #d9d9d9 !important;
          color: rgba(0, 0, 0, 0.25) !important;
          box-shadow: none !important;
        }

        .ant-btn-dangerous[disabled] {
          background-color: #fff !important;
          border-color: #ff4d4f !important;
          color: #ff4d4f !important;
          opacity: 0.5 !important;
        }

        .ant-btn-primary[disabled] {
          background-color: #1890ff !important;
          border-color: #1890ff !important;
          color: #fff !important;
          opacity: 0.5 !important;
        }
      `}</style>
    </div>
  );
};

export default Question;
