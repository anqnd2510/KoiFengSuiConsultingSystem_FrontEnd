import React, { useState, useEffect } from "react";
import { Row, Col, Tag, message, Form, Input, Modal, Radio } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import Header from "../components/Common/Header";
import CustomButton from "../components/Common/CustomButton";
import CustomTable from "../components/Common/CustomTable";
import Pagination from "../components/Common/Pagination";
import Error from "../components/Common/Error";
import { getQuestionsByQuizId, createQuestion, updateQuestion, deleteQuestion } from "../services/question.service";

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

  useEffect(() => {
    if (quizId) {
      fetchQuestions();
    }
  }, [quizId]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("Fetching questions for quizId:", quizId);
      const data = await getQuestionsByQuizId(quizId);
      console.log("Received questions data:", data);
      
      if (Array.isArray(data)) {
        setQuestions(data);
      } else {
        console.warn("Received non-array data:", data);
        setQuestions([]);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      setError(error.toString());
      message.error(error.toString());
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
      console.log("Creating question with values:", values);

      // Chuẩn bị dữ liệu cho API
      const questionRequest = {
        questionText: values.questionText.trim(),
        questionType: values.questionType,
        point: Number(values.point),
        answers: values.answers.map((answer, index) => ({
          optionText: answer.optionText.trim(),
          isCorrect: index === values.correctAnswer
        }))
      };

      console.log("Question request:", questionRequest);
      await createQuestion(quizId, questionRequest);
      
      message.success("Tạo câu hỏi mới thành công!");
      handleCloseCreateModal();
      fetchQuestions();
    } catch (error) {
      console.error("Error creating question:", error);
      message.error(error.toString());
    } finally {
      setCreatingQuestion(false);
    }
  };

  const handleEditQuestion = (question) => {
    setSelectedQuestion(question);
    editForm.setFieldsValue({
      questionText: question.questionText,
      questionType: question.questionType,
      point: question.point,
      answers: question.answers.map(answer => ({
        optionText: answer.optionText,
        isCorrect: answer.isCorrect
      }))
    });
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedQuestion(null);
    editForm.resetFields();
  };

  const handleUpdateQuestion = async (values) => {
    try {
      setEditingQuestion(true);
      
      // Validate dữ liệu
      if (!values.questionText?.trim()) {
        throw new Error("Vui lòng nhập nội dung câu hỏi");
      }
      
      const point = Number(values.point);
      if (isNaN(point) || point < 0 || point > 100) {
        throw new Error("Điểm số phải từ 0-100");
      }

      const questionRequest = {
        questionText: values.questionText.trim(),
        questionType: values.questionType,
        point: point,
        answers: values.answers.map(answer => ({
          optionText: answer.optionText.trim(),
          isCorrect: !!answer.isCorrect
        }))
      };

      await updateQuestion(selectedQuestion.questionId, questionRequest);
      
      message.success("Cập nhật câu hỏi thành công!");
      handleCloseEditModal();
      fetchQuestions();
    } catch (error) {
      console.error("Error updating question:", error);
      message.error(error.toString());
    } finally {
      setEditingQuestion(false);
    }
  };

  const handleDeleteQuestion = async (question) => {
    try {
      const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa câu hỏi này?");
      if (confirmDelete) {
        await deleteQuestion(question.questionId);
        message.success("Xóa câu hỏi thành công!");
        fetchQuestions();
      }
    } catch (error) {
      console.error("Error deleting question:", error);
      message.error(error.toString());
    }
  };

  const handleViewQuestion = (question) => {
    setSelectedQuestion(question);
    setIsViewModalOpen(true);
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
      render: (point) => (
        <Tag color="blue">{point}</Tag>
      ),
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
      backgroundColor: '#4CAF50',
      color: 'white',
      border: '2px solid #45a049'
    },
    incorrect: {
      backgroundColor: '#ff4444',
      color: 'white',
      border: '2px solid #cc0000'
    },
    default: {
      backgroundColor: '#f0f0f0',
      border: '2px solid #d9d9d9'
    }
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
              <CustomButton type="primary" onClick={fetchQuestions} loading={loading}>
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
            />
          </div>
        </div>
      </div>

      {/* Modal tạo câu hỏi mới */}
      <Modal
        title={
          <div className="text-xl font-semibold">
            Thêm câu hỏi mới
          </div>
        }
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
              { optionText: "", isCorrect: false },
              { optionText: "", isCorrect: false },
              { optionText: "", isCorrect: false },
              { optionText: "", isCorrect: false }
            ]
          }}
        >
          <div className="p-4">
            <div className="mb-8">
              <Form.Item
                name="questionText"
                rules={[{ required: true, message: "Vui lòng nhập nội dung câu hỏi" }]}
              >
                <Input.TextArea 
                  rows={3}
                  placeholder="Nhập câu hỏi của bạn ở đây..."
                  className="text-lg"
                  style={{ fontSize: '1.2rem', padding: '15px' }}
                />
              </Form.Item>
            </div>

            <Form.List name="answers">
              {(fields) => (
                <div className="grid grid-cols-2 gap-4">
                  <Form.Item name="correctAnswer" className="hidden">
                    <Input type="hidden" />
                  </Form.Item>
                  {fields.map((field, index) => (
                    <div key={field.key}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 flex items-center justify-center">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <Form.Item
                          noStyle
                          name="correctAnswer"
                          initialValue={0}
                        >
                          <Radio value={index}>Đáp án đúng</Radio>
                        </Form.Item>
                      </div>

                      <Form.Item
                        {...field}
                        name={[field.name, 'optionText']}
                        rules={[{ required: true, message: 'Vui lòng nhập đáp án' }]}
                      >
                        <Input.TextArea
                          rows={2}
                          placeholder={`Đáp án ${String.fromCharCode(65 + index)}`}
                          className="answer-input"
                          style={{
                            resize: 'none',
                            backgroundColor: createForm.getFieldValue('correctAnswer') === index
                              ? '#e8f5e9'
                              : '#f5f5f5'
                          }}
                        />
                      </Form.Item>
                    </div>
                  ))}
                </div>
              )}
            </Form.List>

            <div className="flex justify-between items-center mt-8">
              <div className="flex items-center gap-4">
                <Form.Item
                  name="point"
                  label="Điểm"
                  className="mb-0"
                >
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    style={{ width: '100px' }}
                  />
                </Form.Item>
                
                <Form.Item
                  name="questionType"
                  className="mb-0"
                >
                  <Radio.Group buttonStyle="solid">
                    <Radio.Button value="Multiple Choice">Trắc nghiệm</Radio.Button>
                    <Radio.Button value="True/False">Đúng/Sai</Radio.Button>
                  </Radio.Group>
                </Form.Item>
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
        title={
          <div className="text-xl font-semibold">
            Chi tiết câu hỏi
          </div>
        }
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
                        ? 'border-green-500 bg-green-50' 
                        : 'border-red-500 bg-red-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
                        answer.isCorrect 
                          ? 'bg-green-500 text-white' 
                          : 'bg-red-500 text-white'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <div className="flex-1">
                        <div className="text-base">{answer.optionText}</div>
                        <div className={`text-sm mt-1 ${
                          answer.isCorrect 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {answer.isCorrect ? 'Đáp án đúng' : 'Đáp án sai'}
                        </div>
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
                <div className="font-medium">{selectedQuestion.questionType}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-gray-500 text-sm mb-1">Điểm số</div>
                <Tag color="blue" className="text-lg px-4 py-1">
                  {selectedQuestion.point || 0}
                </Tag>
              </div>
            </div>

            <div className="flex justify-end">
              <CustomButton onClick={handleCloseViewModal}>
                Đóng
              </CustomButton>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal cập nhật câu hỏi */}
      <Modal
        title={
          <div className="text-xl font-semibold">
            Cập nhật câu hỏi
          </div>
        }
        open={isEditModalOpen}
        onCancel={handleCloseEditModal}
        footer={null}
        width={800}
        className="question-modal"
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleUpdateQuestion}
        >
          <div className="p-4">
            <div className="mb-8">
              <Form.Item
                name="questionText"
                rules={[{ required: true, message: "Vui lòng nhập nội dung câu hỏi" }]}
              >
                <Input.TextArea 
                  rows={3}
                  placeholder="Nhập câu hỏi của bạn ở đây..."
                  className="text-lg"
                  style={{ fontSize: '1.2rem', padding: '15px' }}
                />
              </Form.Item>
            </div>

            <Form.List name="answers">
              {(fields) => (
                <div className="grid grid-cols-2 gap-4">
                  <Form.Item name="correctAnswer" className="hidden">
                    <Input type="hidden" />
                  </Form.Item>
                  {fields.map((field, index) => (
                    <div key={field.key}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 flex items-center justify-center">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <Form.Item
                          noStyle
                          name="correctAnswer"
                          initialValue={0}
                        >
                          <Radio value={index}>Đáp án đúng</Radio>
                        </Form.Item>
                      </div>

                      <Form.Item
                        {...field}
                        name={[field.name, 'optionText']}
                        rules={[{ required: true, message: 'Vui lòng nhập đáp án' }]}
                      >
                        <Input.TextArea
                          rows={2}
                          placeholder={`Đáp án ${String.fromCharCode(65 + index)}`}
                          className="answer-input"
                          style={{
                            resize: 'none',
                            backgroundColor: editForm.getFieldValue('correctAnswer') === index
                              ? '#e8f5e9'
                              : '#f5f5f5'
                          }}
                        />
                      </Form.Item>
                    </div>
                  ))}
                </div>
              )}
            </Form.List>

            <div className="flex justify-between items-center mt-8">
              <div className="flex items-center gap-4">
                <Form.Item
                  name="point"
                  label="Điểm"
                  className="mb-0"
                >
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    style={{ width: '100px' }}
                  />
                </Form.Item>
                
                <Form.Item
                  name="questionType"
                  className="mb-0"
                >
                  <Radio.Group buttonStyle="solid">
                    <Radio.Button value="Multiple Choice">Trắc nghiệm</Radio.Button>
                    <Radio.Button value="True/False">Đúng/Sai</Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </div>

              <div className="flex gap-3">
                <CustomButton onClick={handleCloseEditModal}>
                  Hủy
                </CustomButton>
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
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
};

export default Question;
