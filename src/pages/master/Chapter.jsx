import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Tag,
  Divider,
  Row,
  Col,
  Tooltip,
} from "antd";
import {
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaPlay,
  FaList,
  FaClock,
} from "react-icons/fa";
import { Book, Video, FileText } from "lucide-react";
import Header from "../../components/Common/Header";
import Error from "../../components/Common/Error";
import CustomButton from "../../components/Common/CustomButton";
import BackButton from "../../components/Common/BackButton";
import {
  getChaptersByCourseId,
  formatDuration,
  createChapter,
  updateChapter,
  deleteChapter,
} from "../../services/chapter.service";
import { getAllCourses } from "../../services/course.service";

const { TextArea } = Input;

// Form component cho chương
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

const Chapter = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [courseChapters, setCourseChapters] = useState([]);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [courseInfo, setCourseInfo] = useState(null);
  const [selectedVideoChapter, setSelectedVideoChapter] = useState(null);

  // State cho modal tạo chương
  const [isCreateChapterModalOpen, setIsCreateChapterModalOpen] =
    useState(false);
  const [chapterForm] = Form.useForm();
  const [creatingChapter, setCreatingChapter] = useState(false);

  // State cho modal cập nhật chương
  const [isUpdateChapterModalOpen, setIsUpdateChapterModalOpen] =
    useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [updateChapterForm] = Form.useForm();
  const [updatingChapter, setUpdatingChapter] = useState(false);

  // Lấy thông tin khóa học và danh sách chương khi tải trang
  useEffect(() => {
    if (courseId) {
      fetchCourseInfo();
      fetchCourseChapters();
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
            // Các thông tin khác của khóa học
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

  // Hàm lấy danh sách chương
  const fetchCourseChapters = async () => {
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
            videoUrl: chapter.videoUrl || chapter.video || "",
            // Thêm field để xác định chapter đang được xem
            isActive: false,
          };
        });

        // Sắp xếp theo thứ tự nếu có
        mappedChapters.sort((a, b) => a.order - b.order);

        // Nếu có dữ liệu, chọn chương đầu tiên có video làm mặc định
        const firstChapterWithVideo = mappedChapters.find(
          (chapter) => chapter.videoUrl
        );
        if (firstChapterWithVideo) {
          firstChapterWithVideo.isActive = true;
          setSelectedVideoChapter(firstChapterWithVideo);
        }

        setCourseChapters(mappedChapters);
        setError("");
      } else {
        // Trường hợp không có dữ liệu hoặc API trả về lỗi
        console.error(
          "API không trả về dữ liệu chương theo định dạng mong đợi:",
          response
        );
        setCourseChapters([]);

        if (response && !response.isSuccess) {
          setError(response.message || "Không thể lấy danh sách chương");
        }
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách chương:", error);
      setError("Không thể tải danh sách chương. Vui lòng thử lại sau.");
      setCourseChapters([]);
    } finally {
      setLoadingChapters(false);
    }
  };

  // Hàm chọn chương để xem video
  const handleSelectChapter = (chapter) => {
    if (!chapter.videoUrl) {
      message.warning("Chương này không có video");
      return;
    }

    // Cập nhật trạng thái isActive cho tất cả các chương
    const updatedChapters = courseChapters.map((ch) => ({
      ...ch,
      isActive: ch.id === chapter.id,
    }));

    setCourseChapters(updatedChapters);
    setSelectedVideoChapter(chapter);
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
        courseId: courseId,
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
          title: response.data.chapterName || response.data.title,
          description: response.data.description,
          duration: response.data.duration,
          order: response.data.order,
          videoUrl: response.data.videoUrl || response.data.video,
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
        courseId: courseId,
        chapterName: values.chapterName.trim(),
        description: values.description.trim(),
        duration: Number(values.duration),
        order: Number(values.order),
        videoUrl: values.videoUrl ? values.videoUrl.trim() : "",
        content: values.content ? values.content.trim() : "",
        resourceUrl: values.resourceUrl ? values.resourceUrl.trim() : "",
      };

      console.log("Đang cập nhật chương với dữ liệu:", chapterData);

      // Gọi API cập nhật chương
      const response = await updateChapter(chapterData);

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
                isActive: chapter.isActive, // Giữ trạng thái active
              }
            : chapter
        );

        // Sắp xếp lại theo thứ tự
        updatedChapters.sort((a, b) => a.order - b.order);
        setCourseChapters(updatedChapters);

        // Nếu đang cập nhật chương được chọn để xem video, cũng cập nhật nó
        if (
          selectedVideoChapter &&
          selectedVideoChapter.id === selectedChapter.id
        ) {
          setSelectedVideoChapter({
            ...selectedVideoChapter,
            title: chapterData.chapterName,
            description: chapterData.description,
            duration: chapterData.duration,
            order: chapterData.order,
            videoUrl: chapterData.videoUrl,
            content: chapterData.content,
            resourceUrl: chapterData.resourceUrl,
          });
        }

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

          // Gọi API xóa chương
          const result = await deleteChapter(chapter.id);

          if (result && result.isSuccess) {
            // Cập nhật state sau khi xóa thành công
            const updatedChapters = courseChapters.filter(
              (c) => c.id !== chapter.id
            );
            setCourseChapters(updatedChapters);

            // Nếu đang xóa chương đang được chọn để xem video, reset selectedVideoChapter
            if (
              selectedVideoChapter &&
              selectedVideoChapter.id === chapter.id
            ) {
              // Tìm chương có video để hiển thị nếu có
              const nextChapterWithVideo = updatedChapters.find(
                (ch) => ch.videoUrl
              );
              if (nextChapterWithVideo) {
                // Đánh dấu chapter mới là active
                const newUpdatedChapters = updatedChapters.map((ch) => ({
                  ...ch,
                  isActive: ch.id === nextChapterWithVideo.id,
                }));
                setCourseChapters(newUpdatedChapters);
                setSelectedVideoChapter(nextChapterWithVideo);
              } else {
                setSelectedVideoChapter(null);
              }
            }

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

  // Hàm hiển thị embed video từ URL
  const renderVideoEmbed = (videoUrl) => {
    if (!videoUrl) return null;

    // Xử lý URL YouTube
    if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
      // Trích xuất ID video từ URL YouTube
      let videoId = "";
      if (videoUrl.includes("v=")) {
        videoId = videoUrl.split("v=")[1];
        const ampersandPosition = videoId.indexOf("&");
        if (ampersandPosition !== -1) {
          videoId = videoId.substring(0, ampersandPosition);
        }
      } else if (videoUrl.includes("youtu.be/")) {
        videoId = videoUrl.split("youtu.be/")[1];
      }

      return (
        <iframe
          className="w-full h-full rounded-lg"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      );
    }

    // Xử lý URL Vimeo
    if (videoUrl.includes("vimeo.com")) {
      const vimeoId = videoUrl.split("/").pop();
      return (
        <iframe
          className="w-full h-full rounded-lg"
          src={`https://player.vimeo.com/video/${vimeoId}`}
          title="Vimeo video player"
          frameBorder="0"
          allow="autoplay; fullscreen"
          allowFullScreen
        ></iframe>
      );
    }

    // Xử lý các trường hợp khác hoặc URL không hỗ trợ
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500"
        >
          <div className="flex flex-col items-center">
            <Video size={48} className="mb-2" />
            <span>Mở video trong tab mới</span>
          </div>
        </a>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header
        title={courseInfo ? `${courseInfo.name}` : "Quản lý chương"}
        description="Xem và quản lý nội dung các chương của khóa học"
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
            onClick={handleOpenCreateChapterModal}
          >
            Thêm chương mới
          </CustomButton>
        </div>

        {error && (
          <Error
            message={error}
            action={
              <CustomButton
                type="primary"
                onClick={fetchCourseChapters}
                loading={loadingChapters}
              >
                Thử lại
              </CustomButton>
            }
          />
        )}

        {loadingChapters ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải danh sách chương...</p>
          </div>
        ) : (
          <>
            {courseChapters.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow text-center">
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
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Phần hiển thị video */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    {/* Video player */}
                    <div className="aspect-video bg-gray-100 relative">
                      {selectedVideoChapter && selectedVideoChapter.videoUrl ? (
                        renderVideoEmbed(selectedVideoChapter.videoUrl)
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center p-6">
                            <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">
                              Chọn một chương có video để xem
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Thông tin video đang phát */}
                    {selectedVideoChapter && (
                      <div className="p-4 border-t border-gray-100">
                        <h3 className="text-xl font-semibold mb-2">
                          {selectedVideoChapter.title}
                        </h3>
                        <div className="flex items-center text-gray-500 text-sm mb-4">
                          <div className="flex items-center mr-4">
                            <FaClock className="mr-1" size={14} />
                            <span>
                              {formatDuration(selectedVideoChapter.duration)}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <FileText className="mr-1" size={14} />
                            <span>Chương {selectedVideoChapter.order}</span>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm">
                          {selectedVideoChapter.description}
                        </p>

                        {/* Liên kết tài nguyên */}
                        {selectedVideoChapter.resourceUrl && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <a
                              href={selectedVideoChapter.resourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 flex items-center hover:underline"
                            >
                              <FileText size={16} className="mr-2" />
                              Tài liệu bổ sung
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Danh sách chương kiểu YouTube */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <FaList size={16} className="text-gray-500 mr-2" />
                        <h3 className="font-medium text-gray-800">
                          Danh sách chương ({courseChapters.length})
                        </h3>
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDuration(
                          courseChapters.reduce(
                            (total, chapter) => total + (chapter.duration || 0),
                            0
                          )
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 h-[calc(100vh-320px)] overflow-y-auto pr-2">
                      {courseChapters.map((chapter, index) => (
                        <div
                          key={chapter.id}
                          onClick={() => handleSelectChapter(chapter)}
                          className={`flex p-2 rounded-md cursor-pointer transition duration-200 ${
                            chapter.isActive
                              ? "bg-blue-50 border border-blue-100"
                              : "hover:bg-gray-100 border border-transparent"
                          }`}
                        >
                          <div className="flex-shrink-0 w-8 text-center text-gray-500 font-medium">
                            {chapter.videoUrl ? (
                              chapter.isActive ? (
                                <FaPlay
                                  size={14}
                                  className="text-blue-600 mx-auto"
                                />
                              ) : (
                                index + 1
                              )
                            ) : (
                              <Tooltip title="Chương này không có video">
                                <span className="opacity-50">{index + 1}</span>
                              </Tooltip>
                            )}
                          </div>
                          <div className="ml-2 flex-grow">
                            <h4
                              className={`font-medium line-clamp-2 text-sm ${
                                chapter.isActive
                                  ? "text-blue-700"
                                  : "text-gray-800"
                              } ${!chapter.videoUrl ? "opacity-50" : ""}`}
                            >
                              {chapter.title}
                            </h4>
                            <div className="flex items-center mt-1 text-xs text-gray-500">
                              <span className="mr-2">
                                {formatDuration(chapter.duration)}
                              </span>
                              {chapter.order && (
                                <span className="mr-2">
                                  • Thứ tự: {chapter.order}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Thêm nút quản lý */}
                          <div className="flex-shrink-0 flex items-center">
                            <Tooltip title="Chỉnh sửa">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateChapter(chapter);
                                }}
                                className="text-gray-400 hover:text-blue-600 p-1"
                              >
                                <FaEdit size={14} />
                              </button>
                            </Tooltip>
                            <Tooltip title="Xóa">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteChapter(chapter);
                                }}
                                className="text-gray-400 hover:text-red-500 p-1"
                              >
                                <FaTrash size={14} />
                              </button>
                            </Tooltip>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal tạo chương mới */}
      <Modal
        title={
          <div className="text-xl font-semibold">
            Tạo chương mới cho khóa học{" "}
            {courseInfo ? `"${courseInfo.name}"` : ""}
          </div>
        }
        open={isCreateChapterModalOpen}
        onCancel={handleCloseCreateChapterModal}
        footer={null}
        width={700}
        className="chapter-modal"
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
        className="chapter-modal"
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

      <style jsx global>{`
        .chapter-modal .ant-modal-content {
          border-radius: 12px;
          overflow: hidden;
        }
        .chapter-modal .ant-modal-header {
          border-bottom: 1px solid #f0f0f0;
          padding: 16px 24px;
        }
        .chapter-modal .ant-modal-body {
          padding: 12px;
        }
        .chapter-modal .ant-modal-footer {
          border-top: 1px solid #f0f0f0;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Chapter;
