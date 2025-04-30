import { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  message,
  Modal,
  Upload,
  Form,
  Spin,
  Tooltip,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Eye, Edit } from "lucide-react";
import axios from "axios";
import Header from "../../components/Common/Header";
import Error from "../../components/Common/Error";
import CustomButton from "../../components/Common/CustomButton";
import SearchBar from "../../components/Common/SearchBar";
import KoiPondService from "../../services/koipond.service";

const { Title } = Typography;
const { Dragger } = Upload;

const PondCard = ({
  title,
  image,
  onUpdate,
  onDelete,
  shapeName,
  introduction,
  description,
  koiPondId,
  imageUrl,
  onImageUpdate,
  onView,
}) => {
  return (
    <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-md border border-gray-200">
      <div className="flex flex-col h-full">
        <h3 className="text-lg font-semibold mb-3 text-center text-gray-800">
          {title}
        </h3>
        <div className="mb-3 flex-shrink-0">
          {imageUrl ? (
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={imageUrl || "/placeholder.svg"}
                alt={title}
                className="w-full h-40 object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ) : (
            <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">Không có hình ảnh</span>
            </div>
          )}
        </div>
        <div className="mb-4 text-sm text-left flex-grow">
          <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1.5">
            <span className="font-medium text-gray-700">ID Hồ:</span>
            <span className="text-xs text-gray-600 truncate">
              {koiPondId || "Không có"}
            </span>

            <span className="font-medium text-gray-700">Hình dạng:</span>
            <span className="text-gray-600">{shapeName || "Không có"}</span>

            <span className="font-medium text-gray-700">Giới thiệu:</span>
            <span className="text-gray-600 truncate">
              {introduction || "Không có"}
            </span>

            <span className="font-medium text-gray-700">Mô tả:</span>
            <span className="text-gray-600 truncate">
              {description || "Không có"}
            </span>
          </div>
        </div>
        <div className="border-t pt-3 mt-auto">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <CustomButton
                type="primary"
                onClick={onView}
                size="small"
                icon={<Eye size={14} />}
                className="!bg-blue-500 hover:!bg-blue-600 !text-white !border-blue-500 hover:!border-blue-600 !shadow-sm"
              >
                Xem
              </CustomButton>
              <CustomButton
                type="default"
                size="small"
                icon={<Edit size={14} />}
                onClick={onUpdate}
                className="hover:!bg-gray-50 !shadow-sm"
              >
                Cập nhật
              </CustomButton>
            </div>
            <Tooltip title="Xóa hồ cá">
              <button
                className="p-1.5 rounded-full hover:bg-red-50 text-red-500 transition-colors"
                onClick={onDelete}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Component hiển thị khi không có hình dạng hồ
const NoShapesMessage = () => (
  <div className="text-center p-8 bg-amber-50 rounded-lg border border-amber-200 mt-6 max-w-2xl mx-auto">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-16 w-16 text-amber-500 mx-auto mb-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
    <h3 className="text-xl font-bold text-amber-800 mb-3">
      Không tìm thấy dữ liệu hình dạng hồ
    </h3>
    <p className="text-amber-700 mb-5 max-w-md mx-auto">
      Vui lòng kiểm tra kết nối API hoặc thêm dữ liệu hình dạng hồ trước khi tạo
      hồ mới.
    </p>
    <button className="px-5 py-2.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium shadow-sm">
      Thử lại
    </button>
  </div>
);

// Thêm hàm upload ảnh lên Cloudinary
const uploadImageToCloudinary = async (file) => {
  console.log("Bắt đầu upload file lên Cloudinary:", file?.name);

  if (!file) {
    console.error("❌ Không có file để upload");
    return null;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "upload-cloudinary"); // preset cloudinary

  try {
    console.log("Đang gửi file đến Cloudinary...");

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dzedpn3us/image/upload",
      formData
    );

    console.log("✅ Upload Cloudinary thành công:", res.status);
    console.log("URL trả về:", res.data?.secure_url);

    return res.data.secure_url;
  } catch (err) {
    console.error("❌ Lỗi upload Cloudinary:", err);

    if (err.response) {
      console.error("Lỗi response từ Cloudinary:", {
        status: err.response.status,
        data: err.response.data,
      });
    } else if (err.request) {
      console.error("Không nhận được response từ Cloudinary");
    } else {
      console.error("Lỗi cấu hình request:", err.message);
    }

    return null;
  }
};

const KoiPondManagement = () => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [selectedPond, setSelectedPond] = useState(null);
  const [createImageFile, setCreateImageFile] = useState(null);
  const [createImageUrl, setCreateImageUrl] = useState("");
  const [editImageFile, setEditImageFile] = useState(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [createForm] = Form.useForm();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pondShapes, setPondShapes] = useState([]);

  // State cho danh sách hồ cá từ API
  const [pondTypes, setPondTypes] = useState([]);

  // Thêm state cho modal xác nhận xóa
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [pondToDelete, setPondToDelete] = useState(null);

  // Thêm state cho việc loading hình dạng hồ
  const [loadingShapes, setLoadingShapes] = useState(true);

  // Thêm state cho modal xem chi tiết hồ
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [viewPond, setViewPond] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPonds, setFilteredPonds] = useState([]);

  // Lấy danh sách hồ cá khi component được mount
  useEffect(() => {
    testApiConnection();
    fetchPonds();
  }, []);

  // Tách riêng việc tải danh sách hình dạng hồ
  useEffect(() => {
    fetchPondShapes();
  }, []);

  // Thêm hàm xử lý tìm kiếm
  const handleSearch = (value) => {
    setSearchTerm(value);
    if (!value.trim()) {
      setFilteredPonds(pondTypes);
      return;
    }

    const filtered = pondTypes.filter(
      (pond) =>
        pond.pondName.toLowerCase().includes(value.toLowerCase()) ||
        pond.shapeName.toLowerCase().includes(value.toLowerCase()) ||
        pond.introduction.toLowerCase().includes(value.toLowerCase()) ||
        pond.description.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPonds(filtered);
  };

  // Cập nhật useEffect để khởi tạo filteredPonds
  useEffect(() => {
    setFilteredPonds(pondTypes);
  }, [pondTypes]);

  const testApiConnection = async () => {
    try {
      const result = await KoiPondService.testApiConnection();
      if (result.success) {
        console.log("API connection successful");
      } else {
        console.error("API connection failed");
        setError("Không thể kết nối đến API. Vui lòng kiểm tra lại kết nối.");
      }
    } catch (err) {
      console.error("Error testing API connection:", err);
    }
  };

  const fetchPondShapes = async () => {
    try {
      setLoadingShapes(true); // Hiển thị trạng thái loading cho hình dạng hồ
      message.loading({
        content: "Đang tải danh sách hình dạng hồ...",
        key: "loadingShapes",
      });

      const shapes = await KoiPondService.getPondShapes();

      if (shapes && shapes.length > 0) {
        console.log("Đã tải được", shapes.length, "hình dạng hồ");
        setPondShapes(shapes);
        message.destroy("loadingShapes"); // Chỉ hủy thông báo loading, không hiển thị thông báo thành công
      } else {
        console.warn("Không có dữ liệu hình dạng hồ");
        message.warning({
          content: "Không tìm thấy dữ liệu hình dạng hồ cá",
          key: "loadingShapes",
        });
        setPondShapes([]);
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh sách hình dạng hồ cá:", err);
      message.error({
        content: "Không thể tải danh sách hình dạng hồ cá",
        key: "loadingShapes",
      });
      setPondShapes([]);
    } finally {
      setLoadingShapes(false);
    }
  };

  const fetchPonds = async () => {
    try {
      setLoading(true);
      const response = await KoiPondService.getAllKoiPonds();

      console.log("Response from API:", response);

      // Kiểm tra cấu trúc dữ liệu trả về từ API
      if (response && response.data) {
        console.log("Setting pond types from response.data:", response.data);
        setPondTypes(response.data);
      } else if (Array.isArray(response)) {
        console.log("Setting pond types from array response:", response);
        setPondTypes(response);
      } else {
        console.error("Cấu trúc dữ liệu không đúng định dạng:", response);
        setError("Dữ liệu không đúng định dạng. Vui lòng kiểm tra lại API.");
      }

      setError(null);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách hồ cá:", err);
      setError("Không thể tải danh sách hồ cá. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (pondType) => {
    setSelectedPond(pondType);
    editForm.setFieldsValue({
      pondName: pondType.pondName,
      shapeId: pondType.shapeId,
      introduction: pondType.introduction,
      description: pondType.description,
      imageUrl: pondType.imageUrl,
    });
    setIsEditModalVisible(true);
  };

  const handleDelete = (id) => {
    const pondToDelete = pondTypes.find(
      (pond) => (pond.koiPondId || pond.id) === id
    );
    console.log("Đang xóa hồ cá:", pondToDelete);

    // Sử dụng Modal.confirm để xác nhận xóa
    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc chắn muốn xóa hồ cá này không?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      centered: true, // Để modal hiển thị ở giữa màn hình
      className: "delete-confirmation-modal", // Thêm class để styling
      onOk: async () => {
        try {
          setLoading(true);

          // Gọi API xóa hồ cá
          const response = await KoiPondService.deletePond(id);
          console.log("Delete response:", response);

          // Kiểm tra kết quả xóa
          if (
            response &&
            (response.isSuccess === true ||
              (response.data && response.data.isSuccess === true))
          ) {
            message.success("Xóa hồ cá thành công");

            // Cập nhật danh sách sau khi xóa
            if (response.updatedPonds) {
              if (response.updatedPonds.data) {
                setPondTypes(response.updatedPonds.data);
              } else if (Array.isArray(response.updatedPonds)) {
                setPondTypes(response.updatedPonds);
              } else {
                fetchPonds();
              }
            } else {
              fetchPonds();
            }
          } else {
            console.error("Delete failed with response:", response);
            message.error(response?.message || "Lỗi khi xóa hồ cá");

            if (response?.message?.includes("tham chiếu")) {
              Modal.error({
                title: "Không thể xóa hồ cá",
                content:
                  "Hồ cá này đang được sử dụng bởi dữ liệu khác trong hệ thống. Vui lòng xóa các dữ liệu liên quan trước khi xóa hồ cá này.",
              });
            }
          }
        } catch (error) {
          console.error("Error in delete confirmation:", error);
          let errorMessage = "Lỗi khi xóa hồ cá";

          if (error.response) {
            console.error("API error response:", error.response.data);

            if (error.response.status === 500) {
              errorMessage =
                "Lỗi server: Không thể xóa hồ cá. Có thể hồ cá đang được sử dụng bởi dữ liệu khác.";

              Modal.error({
                title: "Lỗi Server",
                content:
                  "Không thể xóa hồ cá. Vui lòng liên hệ quản trị viên hoặc thử lại sau.",
              });
            } else {
              errorMessage = error.response.data?.message || errorMessage;
            }
          } else {
            errorMessage = error.message;
          }

          message.error(errorMessage);
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleCreatePond = () => {
    setIsCreateModalVisible(true);
  };

  const handleCreateCancel = () => {
    setIsCreateModalVisible(false);
    createForm.resetFields();
    setCreateImageFile(null);
    setCreateImageUrl("");
  };

  const handleCreateImageChange = ({ fileList }) => {
    console.log("Create image change:", fileList);
    if (fileList.length > 0) {
      setCreateImageFile(fileList[0].originFileObj);

      // Hiển thị preview ảnh
      if (fileList[0].originFileObj) {
        const url = URL.createObjectURL(fileList[0].originFileObj);
        setCreateImageUrl(url);
      }
    } else {
      setCreateImageFile(null);
      setCreateImageUrl("");
    }
  };

  const handleCreateSubmit = async () => {
    try {
      const values = await createForm.validateFields();
      console.log("Form values:", values);

      setLoading(true);

      // Kiểm tra các trường bắt buộc
      if (!values.pondName || values.pondName.trim() === "") {
        message.error("Vui lòng nhập tên hồ cá");
        setLoading(false);
        return;
      }

      if (!values.shapeId) {
        message.error("Vui lòng chọn hình dạng hồ");
        setLoading(false);
        return;
      }

      if (!values.introduction || values.introduction.trim() === "") {
        message.error("Vui lòng nhập giới thiệu");
        setLoading(false);
        return;
      }

      if (!values.description || values.description.trim() === "") {
        message.error("Vui lòng nhập mô tả");
        setLoading(false);
        return;
      }

      // Kiểm tra độ dài tối thiểu và tối đa
      if (values.pondName.trim().length < 3) {
        message.error("Tên hồ cá phải có ít nhất 3 ký tự");
        setLoading(false);
        return;
      }

      if (values.pondName.trim().length > 100) {
        message.error("Tên hồ cá không được vượt quá 100 ký tự");
        setLoading(false);
        return;
      }

      if (values.introduction.trim().length < 10) {
        message.error("Giới thiệu phải có ít nhất 10 ký tự");
        setLoading(false);
        return;
      }

      if (values.description.trim().length < 10) {
        message.error("Mô tả phải có ít nhất 10 ký tự");
        setLoading(false);
        return;
      }

      // Kiểm tra xem đã chọn file ảnh chưa
      if (!createImageFile) {
        message.error("Vui lòng tải ảnh lên");
        setLoading(false);
        return;
      }

      // Kiểm tra kích thước và định dạng file ảnh
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

      if (createImageFile.size > maxSize) {
        message.error("Kích thước ảnh không được vượt quá 5MB");
        setLoading(false);
        return;
      }

      if (!allowedTypes.includes(createImageFile.type)) {
        message.error("Chỉ chấp nhận file ảnh định dạng JPG, PNG hoặc GIF");
        setLoading(false);
        return;
      }

      // Tạo FormData để gửi file
      const formData = new FormData();
      formData.append("ShapeId", values.shapeId);
      formData.append("PondName", values.pondName.trim());
      formData.append("Introduction", values.introduction.trim());
      formData.append("Description", values.description.trim());
      formData.append("ImageUrl", createImageFile);

      console.log(
        "Đang gửi dữ liệu tạo hồ mới với file:",
        createImageFile.name
      );

      try {
        // Sử dụng service thay vì gọi axios trực tiếp
        const response = await KoiPondService.createPond(formData);

        console.log("Create pond response:", response);
        message.success("Đã tạo hồ cá mới thành công");
        setIsCreateModalVisible(false);
        createForm.resetFields();
        setCreateImageFile(null);
        setCreateImageUrl("");

        // Tải lại danh sách
        await fetchPonds();
      } catch (apiError) {
        console.error("API error:", apiError);

        let errorMessage = "Lỗi tạo hồ cá: ";

        if (apiError.response) {
          console.error("Response data:", apiError.response.data);

          if (apiError.response.data.errors) {
            const errors = apiError.response.data.errors;
            Object.keys(errors).forEach((key) => {
              errorMessage += `${key}: ${errors[key].join(", ")}. `;
            });
          } else if (apiError.response.data.title) {
            errorMessage += apiError.response.data.title;
          } else {
            errorMessage += JSON.stringify(apiError.response.data);
          }
        } else {
          errorMessage += apiError.message || "Không xác định";
        }

        message.error(errorMessage);
      }
    } catch (err) {
      console.error("Form validation error:", err);
      message.error("Vui lòng kiểm tra lại thông tin nhập vào");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditModalVisible(false);
    setSelectedPond(null);
    editForm.resetFields();
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    setSelectedPond(null);
    editForm.resetFields();
  };

  const handleImageUpdate = async (pondType) => {
    try {
      // Hiển thị modal để chọn ảnh
      Modal.info({
        title: `Cập nhật hình ảnh cho hồ ${pondType.pondName}`,
        content: (
          <div className="mt-4">
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={(file) => {
                const isImage = file.type.startsWith("image/");
                if (!isImage) {
                  message.error("Chỉ chấp nhận file hình ảnh!");
                  return Upload.LIST_IGNORE;
                }
                return false;
              }}
              onChange={({ fileList }) => {
                if (fileList.length > 0) {
                  window.selectedImageFile = fileList[0].originFileObj;
                }
              }}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Tải lên</div>
              </div>
            </Upload>
          </div>
        ),
        okText: "Cập nhật",
        onOk: async () => {
          const file = window.selectedImageFile;
          if (!file) {
            message.error("Vui lòng chọn một hình ảnh");
            return;
          }

          try {
            setLoading(true);
            message.loading({
              content: "Đang cập nhật...",
              key: "uploadImage",
            });

            // Tạo FormData
            const formData = new FormData();
            formData.append("ShapeId", pondType.shapeId);
            formData.append("PondName", pondType.pondName);
            formData.append("Introduction", pondType.introduction || "");
            formData.append("Description", pondType.description || "");
            formData.append("ImageUrl", file);

            // Gọi service thay vì trực tiếp axios
            const pondId = pondType.koiPondId || pondType.id;
            const response = await KoiPondService.updatePond(pondId, formData);

            console.log("Phản hồi API:", response);
            message.success({
              content: `Đã cập nhật hình ảnh cho hồ ${pondType.pondName}`,
              key: "uploadImage",
            });
            delete window.selectedImageFile;

            // Tải lại danh sách
            await fetchPonds();
          } catch (error) {
            console.error("Lỗi khi cập nhật hình ảnh:", error);

            let errorMsg = "Không thể cập nhật hình ảnh. ";
            if (error.response) {
              console.error("Response data:", error.response.data);
              if (error.response.data.errors) {
                const errors = error.response.data.errors;
                Object.keys(errors).forEach((key) => {
                  errorMsg += `${key}: ${errors[key].join(", ")}. `;
                });
              } else if (error.response.data.title) {
                errorMsg += error.response.data.title;
              }
            } else {
              errorMsg += error.message || "Vui lòng thử lại sau.";
            }

            message.error({ content: errorMsg, key: "uploadImage" });
          } finally {
            setLoading(false);
          }
        },
        cancelText: "Hủy",
        onCancel: () => {
          delete window.selectedImageFile;
        },
      });
    } catch (err) {
      console.error("Lỗi khi cập nhật hình ảnh:", err);
      message.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };

  const handleEditImageChange = ({ fileList }) => {
    console.log("Edit image change:", fileList);
    if (fileList.length > 0) {
      setEditImageFile(fileList[0].originFileObj);
      // Hiển thị preview ảnh
      if (fileList[0].originFileObj) {
        const url = URL.createObjectURL(fileList[0].originFileObj);
        // Có thể thêm preview URL nếu cần
      }
    } else {
      setEditImageFile(null);
    }
  };

  const handleEditSubmit = async () => {
    try {
      const values = await editForm.validateFields();

      // Kiểm tra các trường bắt buộc
      if (!values.pondName || values.pondName.trim() === "") {
        message.error("Vui lòng nhập tên hồ cá");
        setLoading(false);
        return;
      }

      if (!values.shapeId) {
        message.error("Vui lòng chọn hình dạng hồ");
        setLoading(false);
        return;
      }

      if (!values.introduction || values.introduction.trim() === "") {
        message.error("Vui lòng nhập giới thiệu");
        setLoading(false);
        return;
      }

      if (!values.description || values.description.trim() === "") {
        message.error("Vui lòng nhập mô tả");
        setLoading(false);
        return;
      }

      // Kiểm tra độ dài tối thiểu và tối đa
      if (values.pondName.trim().length < 3) {
        message.error("Tên hồ cá phải có ít nhất 3 ký tự");
        setLoading(false);
        return;
      }

      if (values.pondName.trim().length > 100) {
        message.error("Tên hồ cá không được vượt quá 100 ký tự");
        setLoading(false);
        return;
      }

      if (values.introduction.trim().length < 10) {
        message.error("Giới thiệu phải có ít nhất 10 ký tự");
        setLoading(false);
        return;
      }

      if (values.description.trim().length < 10) {
        message.error("Mô tả phải có ít nhất 10 ký tự");
        setLoading(false);
        return;
      }

      setLoading(true);
      const pondId = selectedPond.koiPondId || selectedPond.id;

      // Kiểm tra xem đã chọn file ảnh chưa
      if (
        !editImageFile &&
        (!selectedPond.imageUrl || selectedPond.imageUrl.trim() === "")
      ) {
        message.error("Vui lòng chọn hình ảnh");
        setLoading(false);
        return;
      }

      // Kiểm tra kích thước và định dạng file ảnh nếu có file mới
      if (editImageFile) {
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

        if (editImageFile.size > maxSize) {
          message.error("Kích thước ảnh không được vượt quá 5MB");
          setLoading(false);
          return;
        }

        if (!allowedTypes.includes(editImageFile.type)) {
          message.error("Chỉ chấp nhận file ảnh định dạng JPG, PNG hoặc GIF");
          setLoading(false);
          return;
        }
      }

      // Tạo FormData để gửi file thay vì URL
      const formData = new FormData();
      formData.append("ShapeId", values.shapeId);
      formData.append("PondName", values.pondName.trim());
      // Xử lý description để chỉ giữ lại các ký tự hợp lệ
      const sanitizedDescription = values.description
        .trim()
        .replace(
          /[^a-zA-Z0-9\sáàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ,._-]/g,
          ""
        );
      formData.append("Description", sanitizedDescription);
      formData.append("Introduction", values.introduction.trim());

      // Nếu có file ảnh mới, đính kèm trực tiếp
      if (editImageFile) {
        formData.append("ImageUrl", editImageFile);
        console.log("Gửi với file mới:", editImageFile.name);
      }
      // Nếu không có file mới, tải file từ URL hiện tại và gửi lên
      else if (selectedPond.imageUrl) {
        try {
          console.log("Tải file từ URL hiện tại:", selectedPond.imageUrl);
          const response = await fetch(selectedPond.imageUrl);
          const blob = await response.blob();
          const fileName =
            selectedPond.imageUrl.split("/").pop() || "image.jpg";
          const file = new File([blob], fileName, {
            type: blob.type || "image/jpeg",
          });
          formData.append("ImageUrl", file);
          console.log("Đã tạo file từ URL:", file.name, file.size, "bytes");
        } catch (error) {
          console.error("Lỗi khi tải file từ URL:", error);
          message.error(
            "Không thể tải file từ URL hiện tại. Vui lòng chọn file mới."
          );
          setLoading(false);
          return;
        }
      }

      try {
        // Gọi service thay vì trực tiếp axios
        const response = await KoiPondService.updatePond(pondId, formData);

        console.log("Kết quả cập nhật:", response);
        message.success(`Đã cập nhật thông tin hồ ${values.pondName}`);

        // Đóng modal và reset form
        setIsEditModalVisible(false);
        setEditImageFile(null);
        editForm.resetFields();

        // Tải lại danh sách hồ cá
        await fetchPonds();
      } catch (error) {
        console.error("Lỗi khi cập nhật hồ cá:", error);

        let errorMsg = "Lỗi cập nhật: ";
        if (error.response) {
          console.error("Response status:", error.response.status);
          console.error("Response data:", error.response.data);

          if (error.response.data?.errors) {
            const errors = error.response.data.errors;
            Object.keys(errors).forEach((key) => {
              errorMsg += `${key}: ${errors[key].join(", ")}. `;
            });
          } else if (error.response.data?.title) {
            errorMsg += error.response.data.title;
          } else {
            errorMsg += JSON.stringify(error.response.data || "Không xác định");
          }
        } else {
          errorMsg += error.message || "Không xác định";
        }

        message.error(errorMsg);
      }
    } catch (err) {
      console.error("Form validation error:", err);
      message.error("Vui lòng kiểm tra lại thông tin nhập vào");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (pondType) => {
    setViewPond(pondType);
    setIsViewModalVisible(true);
  };

  const handleViewCancel = () => {
    setIsViewModalVisible(false);
    setViewPond(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Quản lý hồ cá Koi"
        description="Quản lý thông tin và danh sách các loại hồ cá Koi"
      />

      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            {loadingShapes ? (
              <div className="flex items-center gap-2 h-10 px-4 border border-gray-200 rounded-lg bg-white">
                <Spin size="small" />
                <span className="text-gray-500 text-sm">
                  Đang tải hình dạng hồ...
                </span>
              </div>
            ) : pondShapes && pondShapes.length > 0 ? (
              <CustomButton
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreatePond}
                className="!bg-green-600 hover:!bg-green-700 !border-green-600 hover:!border-green-700 !shadow-sm"
              >
                Tạo hồ mới
              </CustomButton>
            ) : (
              <Tooltip title="Cần có dữ liệu hình dạng hồ trước khi tạo hồ mới">
                <CustomButton type="primary" icon={<PlusOutlined />} disabled>
                  Tạo hồ mới
                </CustomButton>
              </Tooltip>
            )}
          </div>
          <SearchBar onSearch={handleSearch} />
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 bg-white rounded-xl shadow-sm border border-gray-100">
            <Spin size="large" />
            <span className="mt-4 text-gray-500">
              Đang tải dữ liệu hồ cá...
            </span>
          </div>
        ) : error ? (
          <Error message={error} />
        ) : (
          <Row gutter={[16, 16]}>
            {filteredPonds && filteredPonds.length > 0 ? (
              filteredPonds.map((pondType) => (
                <Col xs={24} sm={12} md={8} lg={6} key={pondType.koiPondId}>
                  <PondCard
                    title={pondType.pondName}
                    image={pondType.imageUrl}
                    onUpdate={() => handleUpdate(pondType)}
                    onDelete={() => handleDelete(pondType.koiPondId)}
                    shapeName={pondType.shapeName}
                    introduction={pondType.introduction}
                    description={pondType.description}
                    koiPondId={pondType.koiPondId}
                    imageUrl={pondType.imageUrl}
                    onImageUpdate={() => handleImageUpdate(pondType)}
                    onView={() => handleView(pondType)}
                  />
                </Col>
              ))
            ) : (
              <Col span={24}>
                <div className="text-center p-12 bg-white rounded-lg border border-gray-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-gray-300 mx-auto mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 12H4"
                    />
                  </svg>
                  <p className="text-gray-500 text-lg">
                    Không có dữ liệu hồ cá phù hợp với tìm kiếm.
                  </p>
                </div>
              </Col>
            )}
          </Row>
        )}

        {/* Cập nhật phần hiển thị thông báo khi không có hình dạng hồ */}
        {!loadingShapes && (!pondShapes || pondShapes.length === 0) && (
          <NoShapesMessage />
        )}
      </div>

      {/* Modal chỉnh sửa thông tin hồ cá */}
      <Modal
        title={`Chỉnh sửa thông tin hồ ${
          selectedPond ? selectedPond.pondName : ""
        }`}
        open={isEditModalVisible}
        onCancel={handleEditCancel}
        onOk={handleEditSubmit}
        okText="Lưu thay đổi"
        cancelText="Hủy"
        confirmLoading={loading}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            name="pondName"
            label={<span> Tên hồ cá</span>}
            rules={[{ required: true, message: "Vui lòng nhập tên hồ cá" }]}
          >
            <input
              className="w-full p-2 border rounded"
              placeholder="Nhập tên hồ cá"
            />
          </Form.Item>
          <Form.Item
            name="shapeId"
            label={<span> Hình dạng hồ</span>}
            rules={[{ required: true, message: "Vui lòng chọn hình dạng hồ" }]}
          >
            <div className="shape-select">
              <select
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#90B77D] transition-colors duration-200"
                defaultValue={selectedPond?.shapeId}
              >
                {pondShapes && pondShapes.length > 0 ? (
                  pondShapes.map((shape) => (
                    <option
                      key={shape.shapeId}
                      value={shape.shapeId}
                      selected={selectedPond?.shapeId === shape.shapeId}
                    >
                      {shape.shapeName}
                    </option>
                  ))
                ) : (
                  <option disabled>Đang tải danh sách...</option>
                )}
              </select>
            </div>
          </Form.Item>
          <Form.Item
            name="introduction"
            label={<span>Giới thiệu</span>}
            rules={[{ required: true, message: "Vui lòng nhập giới thiệu" }]}
          >
            <textarea
              className="w-full p-2 border rounded"
              placeholder="Nhập giới thiệu"
              rows={3}
            />
          </Form.Item>
          <Form.Item
            name="description"
            label={<span>Mô tả</span>}
            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
          >
            <textarea
              className="w-full p-2 border rounded"
              placeholder="Nhập mô tả"
              rows={3}
            />
          </Form.Item>
          <Form.Item
            name="imageUrl"
            label={<span>Hình ảnh</span>}
            initialValue={selectedPond?.imageUrl}
            rules={[
              {
                required: true,
                message: "Vui lòng tải hình ảnh lên",
              },
            ]}
          >
            <div className="mt-2">
              <Upload
                listType="picture-card"
                onChange={handleEditImageChange}
                maxCount={1}
                beforeUpload={(file) => {
                  const isImage = file.type.startsWith("image/");
                  if (!isImage) {
                    message.error("Chỉ chấp nhận file hình ảnh!");
                    return Upload.LIST_IGNORE;
                  }
                  return false; // Không tự động upload
                }}
              >
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Tải lên</div>
                </div>
              </Upload>
              {selectedPond && selectedPond.imageUrl && !editImageFile && (
                <div className="mt-2">
                  <p className="text-gray-600 text-sm">Hình ảnh hiện tại:</p>
                  <img
                    src={selectedPond.imageUrl || "/placeholder.svg"}
                    alt={selectedPond.pondName}
                    className="mt-1 h-20 object-cover rounded"
                  />
                </div>
              )}
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal tạo hồ mới */}
      <Modal
        title="Tạo hồ cá mới"
        open={isCreateModalVisible}
        onCancel={handleCreateCancel}
        onOk={handleCreateSubmit}
        okText="Tạo mới"
        cancelText="Hủy"
        confirmLoading={loading}
      >
        <Form form={createForm} layout="vertical">
          <Form.Item
            name="pondName"
            label={<span>Tên hồ cá</span>}
            rules={[{ required: true, message: "Vui lòng nhập tên hồ cá" }]}
          >
            <input
              className="w-full p-2 border rounded"
              placeholder="Nhập tên hồ cá"
            />
          </Form.Item>
          <Form.Item
            name="shapeId"
            label={<span>Hình dạng hồ</span>}
            rules={[{ required: true, message: "Vui lòng chọn hình dạng hồ" }]}
          >
            <div className="shape-select">
              <select className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#90B77D] transition-colors duration-200">
                <option value="">-- Chọn hình dạng hồ --</option>
                {pondShapes && pondShapes.length > 0 ? (
                  pondShapes.map((shape) => (
                    <option key={shape.shapeId} value={shape.shapeId}>
                      {shape.shapeName}
                    </option>
                  ))
                ) : (
                  <option disabled>Đang tải danh sách...</option>
                )}
              </select>
            </div>
          </Form.Item>
          <Form.Item
            name="introduction"
            label={<span>Giới thiệu</span>}
            rules={[{ required: true, message: "Vui lòng nhập giới thiệu" }]}
          >
            <textarea
              className="w-full p-2 border rounded"
              placeholder="Nhập giới thiệu"
              rows={3}
            />
          </Form.Item>
          <Form.Item
            name="description"
            label={<span>Mô tả</span>}
            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
          >
            <textarea
              className="w-full p-2 border rounded"
              placeholder="Nhập mô tả"
              rows={3}
            />
          </Form.Item>
          <Form.Item
            name="imageUrl"
            label={<span>Hình ảnh</span>}
            rules={[{ required: true, message: "Vui lòng tải ảnh lên" }]}
          >
            <div className="mt-2">
              <Upload
                listType="picture-card"
                onChange={(info) => {
                  console.log("File changed:", info.fileList);
                  handleCreateImageChange(info);

                  // Set giá trị tạm thời để form validation pass
                  if (info.fileList.length > 0) {
                    createForm.setFieldsValue({
                      imageUrl: "temp-uploading-file",
                    });
                  } else {
                    createForm.setFieldsValue({
                      imageUrl: "",
                    });
                  }
                }}
                maxCount={1}
                beforeUpload={() => false}
                fileList={
                  createImageFile
                    ? [
                        {
                          uid: "-1",
                          name: createImageFile.name,
                          status: "done",
                          url: createImageUrl,
                        },
                      ]
                    : []
                }
              >
                {createImageFile ? null : (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Tải lên</div>
                  </div>
                )}
              </Upload>
              {createImageFile && (
                <div className="mt-2 text-xs text-green-600">
                  Sẽ upload khi bấm nút "Tạo mới"
                </div>
              )}
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal xem chi tiết hồ cá */}
      <Modal
        title={
          <div className="flex items-center gap-2 py-1">
            <span className="text-xl font-semibold text-gray-800">
              Chi tiết hồ {viewPond?.pondName || ""}
            </span>
          </div>
        }
        open={isViewModalVisible}
        onCancel={handleViewCancel}
        footer={[
          <CustomButton key="close" onClick={handleViewCancel} className="px-5">
            Đóng
          </CustomButton>,
        ]}
        width={700}
        centered
        className="view-pond-modal"
      >
        {viewPond && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              {viewPond.imageUrl ? (
                <div className="overflow-hidden rounded-lg shadow-md">
                  <img
                    src={viewPond.imageUrl || "/placeholder.svg"}
                    alt={viewPond.pondName}
                    className="max-h-[350px] w-full object-cover rounded-lg mx-auto"
                  />
                </div>
              ) : (
                <div className="h-[200px] bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">Không có hình ảnh</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg">
              <div className="space-y-2">
                <p className="text-sm text-gray-500 uppercase tracking-wider font-medium">
                  ID Hồ
                </p>
                <p className="text-base font-medium text-gray-800 bg-white p-2 rounded border border-gray-100">
                  {viewPond.koiPondId}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-500 uppercase tracking-wider font-medium">
                  Tên hồ
                </p>
                <p className="text-base font-medium text-gray-800 bg-white p-2 rounded border border-gray-100">
                  {viewPond.pondName}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-500 uppercase tracking-wider font-medium">
                  Hình dạng
                </p>
                <p className="text-base font-medium text-gray-800 bg-white p-2 rounded border border-gray-100">
                  {viewPond.shapeName}
                </p>
              </div>
            </div>

            <div className="space-y-5 bg-white p-6 rounded-lg border border-gray-100">
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider font-medium mb-2">
                  Giới thiệu
                </p>
                <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded border border-gray-100">
                  {viewPond.introduction}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider font-medium mb-2">
                  Mô tả chi tiết
                </p>
                <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded border border-gray-100">
                  {viewPond.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Thêm style cho modal xác nhận xóa */}
      <style jsx global>{`
        .delete-confirmation-modal .ant-modal-content {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        .delete-confirmation-modal .ant-modal-body {
          padding: 28px 24px;
        }
        .delete-confirmation-modal .ant-modal-confirm-title {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
        }
        .delete-confirmation-modal .ant-modal-confirm-content {
          margin-top: 12px;
          margin-bottom: 24px;
          font-size: 15px;
          color: #4b5563;
        }
        .delete-confirmation-modal .ant-modal-confirm-btns {
          margin-top: 24px;
        }
        .delete-confirmation-modal .ant-btn-primary {
          background-color: #ef4444;
          border-color: #ef4444;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }
        .delete-confirmation-modal .ant-btn-primary:hover {
          background-color: #dc2626;
          border-color: #dc2626;
        }
        .shape-select {
          position: relative;
        }

        .shape-select select {
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          background-image: url("data:image/svg+xml;utf8,<svg fill='%2390B77D' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
          background-repeat: no-repeat;
          background-position-x: calc(100% - 10px);
          background-position-y: 50%;
          padding-right: 30px;
        }

        .shape-select select:focus {
          border-color: #90b77d;
          box-shadow: 0 0 0 2px rgba(144, 183, 125, 0.2);
        }

        .shape-select select option {
          padding: 10px;
        }

        .shape-select select option:hover {
          background-color: #f5f5f5;
        }

        /* Improved modal styles */
        .ant-modal-content {
          border-radius: 12px;
          overflow: hidden;
        }

        .ant-modal-header {
          padding: 16px 24px;
          border-bottom: 1px solid #f0f0f0;
        }

        .ant-modal-title {
          font-weight: 600;
          font-size: 18px;
        }

        .ant-modal-footer {
          padding: 16px 24px;
          border-top: 1px solid #f0f0f0;
        }

        .ant-form-item-label > label {
          font-weight: 500;
          color: #374151;
        }

        .view-pond-modal .ant-modal-content {
          overflow: hidden;
          border-radius: 12px;
        }

        .view-pond-modal .ant-modal-body {
          padding: 24px;
        }

        /* Improved form inputs */
        input.ant-input,
        textarea.ant-input,
        .ant-select-selector {
          border-radius: 8px !important;
          border-color: #d1d5db !important;
        }

        input.ant-input:hover,
        textarea.ant-input:hover,
        .ant-select-selector:hover {
          border-color: #9ca3af !important;
        }

        input.ant-input:focus,
        textarea.ant-input:focus,
        .ant-select-selector:focus {
          border-color: #90b77d !important;
          box-shadow: 0 0 0 2px rgba(144, 183, 125, 0.2) !important;
        }

        /* Custom button hover effects */
        .ant-btn:hover {
          transform: translateY(-1px);
          transition: transform 0.2s;
        }
      `}</style>
    </div>
  );
};

export default KoiPondManagement;
