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
  Upload,
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
import axios from "axios";

const { TextArea } = Input;

// Form component cho chương
const ChapterForm = ({
  form,
  loading,
  isUpdate = false,
  currentVideo = null,
}) => {
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

      {isUpdate && currentVideo && (
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">Video hiện tại:</div>
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <video
              src={currentVideo}
              controls
              className="w-full h-full object-contain"
            >
              Trình duyệt của bạn không hỗ trợ video.
            </video>
          </div>
        </div>
      )}

      <Form.Item
        label="Video"
        name="video"
        valuePropName="fileList"
        getValueFromEvent={(e) => {
          if (Array.isArray(e)) {
            return e;
          }
          return e?.fileList;
        }}
        rules={[
          {
            required: !isUpdate,
            message: "Vui lòng tải lên file video",
          },
        ]}
      >
        <Upload
          listType="picture"
          maxCount={1}
          beforeUpload={() => false}
          accept="video/*"
        >
          <CustomButton icon={<Video size={16} />}>
            {isUpdate ? "Cập nhật video mới" : "Tải lên video"}
          </CustomButton>
        </Upload>
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

      // Kiểm tra kích thước video
      if (values.video && values.video.length > 0) {
        const videoFile = values.video[0].originFileObj;
        const fileSizeMB = videoFile.size / (1024 * 1024);
        console.log(`Kích thước file video: ${fileSizeMB.toFixed(2)} MB`);

        // Hiển thị thông báo nếu file lớn
        if (fileSizeMB > 50) {
          message.warning(
            `File video của bạn khá lớn (${fileSizeMB.toFixed(2)} MB). 
            Quá trình tải lên có thể mất nhiều thời gian. Vui lòng đợi...`,
            8
          );
        }

        // Từ chối file quá lớn
        if (fileSizeMB > 100) {
          message.error(
            "File video quá lớn (>100MB). Vui lòng nén file hoặc chọn file nhỏ hơn.",
            5
          );
          setCreatingChapter(false);
          return;
        }
      }

      // Tạo FormData để gửi dữ liệu và file
      const formData = new FormData();
      formData.append("CourseId", courseId);
      formData.append("Title", values.chapterName.trim());
      formData.append("Description", values.description.trim());
      formData.append("Order", Number(values.order));

      // Xử lý file video
      if (values.video && values.video.length > 0) {
        const videoFile = values.video[0].originFileObj;
        console.log("Đính kèm file video:", videoFile.name);
        formData.append("Video", videoFile);

        // Hiển thị thông báo upload đang tiến hành
        message.loading({
          content: "Đang tải video lên server...",
          key: "uploadProgress",
          duration: 0,
        });
      }

      if (values.content) {
        formData.append("Content", values.content.trim());
      }

      // Log FormData để debug
      console.log("FormData entries for chapter creation:");
      for (let pair of formData.entries()) {
        console.log(
          pair[0] +
            ": " +
            (pair[1] instanceof File ? `File: ${pair[1].name}` : pair[1])
        );
      }

      console.log("Đang tạo chương mới...");

      try {
        // Gọi API tạo chương
        const response = await createChapter(formData);

        // Đóng thông báo loading nếu còn
        message.destroy("uploadProgress");

        if (response && response.isSuccess) {
          message.success(response.message || "Tạo mới chương thành công!");

          // Cập nhật lại danh sách chương
          const newChapter = {
            id: response.data.chapterId || response.data.id,
            title:
              response.data.chapterName ||
              response.data.title ||
              values.chapterName,
            description: response.data.description || values.description,
            order: response.data.order || values.order,
            content: response.data.content || values.content || "",
            videoUrl: response.data.videoUrl || response.data.video || "",
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
        // Đóng thông báo loading
        message.destroy("uploadProgress");

        console.error("Lỗi khi gọi API tạo chương:", error);

        // Thông báo lỗi cụ thể
        if (
          error.message.includes("timeout") ||
          error.message.includes("quá lớn")
        ) {
          message.error(
            "File video quá lớn hoặc kết nối chậm. Vui lòng nén file hoặc chọn file nhỏ hơn.",
            5
          );
        } else if (
          error.message.includes("network") ||
          error.message.includes("kết nối")
        ) {
          message.error(
            "Lỗi kết nối đến server. Vui lòng kiểm tra kết nối internet và thử lại.",
            5
          );
        } else {
          message.error("Không thể tạo chương: " + error.message);
        }
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
      order: chapter.order,
      content: chapter.content,
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

      // Tạo FormData để gửi dữ liệu và file
      const formData = new FormData();
      formData.append("Title", values.chapterName.trim());
      formData.append("Description", values.description.trim());
      formData.append("CourseId", courseId);

      // Chỉ gửi Video khi có chọn file mới
      if (values.video && values.video.length > 0) {
        const videoFile = values.video[0].originFileObj;
        console.log("Đính kèm file video:", videoFile.name);
        formData.append("Video", videoFile);
      }

      // Chỉ gửi Content khi có nội dung
      if (values.content) {
        formData.append("Content", values.content.trim());
      }

      formData.append("Order", Number(values.order));

      // Log FormData để debug
      console.log("FormData entries for chapter update:");
      for (let pair of formData.entries()) {
        console.log(
          pair[0] +
            ": " +
            (pair[1] instanceof File ? `File: ${pair[1].name}` : pair[1])
        );
      }

      console.log("Đang cập nhật chương với ID:", selectedChapter.id);

      try {
        // Gọi API cập nhật chương, truyền riêng ID và formData
        const response = await updateChapter(selectedChapter.id, formData);
        console.log("Kết quả cập nhật:", response);

        if (response && response.isSuccess) {
          message.success(response.message || "Cập nhật chương thành công!");

          // Cập nhật lại danh sách chương
          const updatedChapters = courseChapters.map((chapter) =>
            chapter.id === selectedChapter.id
              ? {
                  ...chapter,
                  title: values.chapterName.trim(),
                  description: values.description.trim(),
                  order: Number(values.order),
                  videoUrl: response.data?.video || chapter.videoUrl,
                  content: values.content ? values.content.trim() : "",
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
              title: values.chapterName.trim(),
              description: values.description.trim(),
              order: Number(values.order),
              videoUrl: response.data?.video || selectedVideoChapter.videoUrl,
              content: values.content ? values.content.trim() : "",
            });
          }

          // Đóng modal và reset form
          setIsUpdateChapterModalOpen(false);
          updateChapterForm.resetFields();

          // Refresh lại danh sách
          fetchCourseChapters();
        } else {
          message.error(response?.message || "Không thể cập nhật chương");
        }
      } catch (apiError) {
        console.error("Lỗi khi gọi API cập nhật chương:", apiError);
        message.error("Lỗi kết nối khi cập nhật: " + apiError.message);
      } finally {
        // Đảm bảo luôn tắt trạng thái loading sau khi gọi API
        setUpdatingChapter(false);
      }
    } catch (formError) {
      console.error("Lỗi validate form:", formError);
      message.error("Vui lòng điền đầy đủ thông tin chương");
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

    // Xử lý video trực tiếp
    return (
      <video
        className="w-full h-full rounded-lg"
        controls
        controlsList="nodownload"
        src={videoUrl}
      >
        <source src={videoUrl} type="video/mp4" />
        Trình duyệt của bạn không hỗ trợ thẻ video.
      </video>
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

        {loadingChapters ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải danh sách chương...</p>
          </div>
        ) : (
          <>
            {courseChapters.length === 0 ? (
              <div className="text-center p-8">
                <p className="text-gray-500 mb-4">Khóa học này chưa có chương nào</p>
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
                          <div className="flex items-center">
                            <FileText className="mr-1" size={14} />
                            <span>Chương {selectedVideoChapter.order}</span>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm">
                          {selectedVideoChapter.description}
                        </p>
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
                              {chapter.order && (
                                <span className="mr-2">
                                  Thứ tự: {chapter.order}
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
          <ChapterForm
            form={updateChapterForm}
            loading={updatingChapter}
            isUpdate={true}
            currentVideo={selectedChapter?.videoUrl}
          />

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
