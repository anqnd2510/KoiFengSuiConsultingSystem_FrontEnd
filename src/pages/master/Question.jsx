import React, { useState, useEffect } from "react";
import { Row, Col, Tag, message, Form, Input, Modal, Radio } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";
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
} from "../../services/question.service";
import { getAnswerById } from "../../services/answer.service";

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

  useEffect(() => {
    if (quizId) {
      fetchQuestions();
    }
  }, [quizId]);

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

      // Fetch lại toàn bộ danh sách câu hỏi để lấy dữ liệu mới nhất
      const response = await getQuestionsByQuizId(quizId);
      let questionToEdit = question;

      if (response?.data?.data) {
        // Tìm câu hỏi cụ thể trong danh sách mới
        const updatedQuestion = response.data.data.find(
          (q) => q.questionId === question.questionId
        );
        if (updatedQuestion) {
          // Fetch chi tiết từng câu trả lời
          const updatedAnswers = await Promise.all(
            updatedQuestion.answers.map(async (answer) => {
              try {
                if (answer.answerId) {
                  const answerDetail = await getAnswerById(answer.answerId);
                  return {
                    ...answer,
                    ...answerDetail,
                  };
                }
                return answer;
              } catch (error) {
                console.error(
                  `Lỗi khi tải chi tiết đáp án ${answer.answerId}:`,
                  error
                );
                return answer;
              }
            })
          );

          questionToEdit = {
            ...updatedQuestion,
            answers: updatedAnswers,
          };
        }
      }

      setSelectedQuestion(questionToEdit);

      // Tìm index của đáp án đúng từ dữ liệu mới nhất
      const correctAnswerIndex = questionToEdit.answers.findIndex(
        (answer) => answer.isCorrect === true
      );

      // Set giá trị form với dữ liệu mới nhất
      editForm.setFieldsValue({
        questionText: questionToEdit.questionText,
        questionType: questionToEdit.questionType,
        point: questionToEdit.point,
        correctAnswer: correctAnswerIndex >= 0 ? correctAnswerIndex : 0,
        answerUpdateRequests: questionToEdit.answers.map((answer) => ({
          ...answer,
          optionText: answer.optionText || "",
          isCorrect: answer.isCorrect,
        })),
      });

      setIsEditModalOpen(true);
    } catch (error) {
      console.error("Lỗi khi cập nhật câu hỏi:", error);
      message.error("Không thể cập nhật câu hỏi");
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
        questionType: values.questionType,
        point: Number(values.point) || 0,
        answerUpdateRequests: values.answerUpdateRequests.map(
          (answer, index) => ({
            answerId: selectedQuestion.answers[index].answerId,
            optionText: answer.optionText.trim(),
            optionType: "Text",
            isCorrect: answer.isCorrect, // Lấy trực tiếp từ form data
          })
        ),
      };

      console.log("Update request:", questionRequest); // Thêm log để kiểm tra

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
      // Fetch lại toàn bộ danh sách câu hỏi để lấy dữ liệu mới nhất
      const response = await getQuestionsByQuizId(quizId);

      if (response?.data?.data) {
        // Tìm câu hỏi cụ thể trong danh sách mới
        const updatedQuestion = response.data.data.find(
          (q) => q.questionId === question.questionId
        );

        if (updatedQuestion) {
          // Fetch chi tiết từng câu trả lời
          const updatedAnswers = await Promise.all(
            updatedQuestion.answers.map(async (answer) => {
              try {
                if (answer.answerId) {
                  const answerDetail = await getAnswerById(answer.answerId);
                  return {
                    ...answer,
                    ...answerDetail,
                  };
                }
                return answer;
              } catch (error) {
                console.error(
                  `Lỗi khi tải chi tiết đáp án ${answer.answerId}:`,
                  error
                );
                return answer;
              }
            })
          );

          setSelectedQuestion({
            ...updatedQuestion,
            answers: updatedAnswers,
          });
        } else {
          setSelectedQuestion(question);
        }
      } else {
        setSelectedQuestion(question);
      }
      setIsViewModalOpen(true);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      setSelectedQuestion(question);
      setIsViewModalOpen(true);
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
      width: "15%",
    },
    {
      title: "Nội dung câu hỏi",
      dataIndex: "questionText",
      key: "questionText",
      width: "35%",
    },
    {
      title: "Loại câu hỏi",
      dataIndex: "questionType",
      key: "questionType",
      width: "15%",
    },
    {
      title: "Điểm",
      dataIndex: "point",
      key: "point",
      width: "10%",
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
          >
            Cập nhật
          </CustomButton>
          <CustomButton
            type="primary"
            danger
            size="small"
            onClick={() => handleDeleteQuestion(record)}
            icon={<FaTrash size={14} />}
          >
            Xóa
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
        description={`Danh sách câu hỏi của bài kiểm tra ${quizId}`}
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
          <CustomButton
            type="primary"
            icon={<FaPlus size={14} />}
            onClick={handleOpenCreateModal}
          >
            Thêm câu hỏi mới
          </CustomButton>
        </div>

        {error && (
          <Error
            message={error}
            action={
              <CustomButton
                type="primary"
                onClick={fetchQuestions}
                loading={loading}
              >
                Thử lại
              </CustomButton>
            }
          />
        )}

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
              current={currentPage}
              total={questions.length}
              pageSize={pageSize}
              onChange={handlePageChange}
              onShowSizeChange={handlePageChange}
            />
          </div>
        </div>
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
                ]}
              >
                <Input.TextArea
                  rows={3}
                  placeholder="Nhập câu hỏi của bạn ở đây..."
                  className="text-lg"
                  style={{ fontSize: "1.2rem", padding: "15px" }}
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
                          />
                        </Form.Item>
                      </div>
                    ))}
                  </div>
                )}
              </Form.List>
            </div>

            <div className="flex justify-between items-center mt-8">
              <div>
                {/* Đã xóa phần điểm và loại câu hỏi */}
              </div>

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

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-gray-500 text-sm mb-1">Mã câu hỏi</div>
                <div className="font-medium">{selectedQuestion.questionId}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-gray-500 text-sm mb-1">Loại câu hỏi</div>
                <div className="font-medium">
                  {selectedQuestion.questionType}
                </div>
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
                ]}
              >
                <Input.TextArea
                  rows={3}
                  placeholder="Nhập câu hỏi của bạn ở đây..."
                  className="text-lg"
                  style={{ fontSize: "1.2rem", padding: "15px" }}
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
                        ]}
                      >
                        <Input.TextArea
                          rows={2}
                          placeholder={`Đáp án ${String.fromCharCode(
                            65 + index
                          )}`}
                          className="answer-input"
                          style={{
                            resize: "none",
                            backgroundColor: editForm.getFieldValue([
                              "answerUpdateRequests",
                              index,
                              "isCorrect",
                            ])
                              ? "#e8f5e9"
                              : "#f5f5f5",
                          }}
                        />
                      </Form.Item>
                    </div>
                  ))}
                </div>
              )}
            </Form.List>

            <div className="flex justify-between items-center mt-8">
              <div>
                {/* Đã xóa phần điểm và loại câu hỏi */}
              </div>

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
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Lưu ý:</strong> Hành động này không thể hoàn tác. Tất cả
                dữ liệu liên quan đến câu hỏi này sẽ bị xóa vĩnh viễn.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <CustomButton onClick={handleCancelDelete}>Hủy</CustomButton>
            <CustomButton
              type="primary"
              danger
              onClick={handleConfirmDelete}
              loading={isDeleting}
              icon={<FaTrash size={14} />}
            >
              Xác nhận xóa
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
    </div>
  );
};

export default Question;
