import React, { useState, useEffect } from "react";
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
  Space,
  Popconfirm,
  Tooltip,
} from "antd";
import {
  UploadOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import axios from "axios";
import Header from "../../components/Common/Header";
import Error from "../../components/Common/Error";
import CustomButton from "../../components/Common/CustomButton";
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
  onImageUpdate
}) => {
  return (
    <Card className="h-full">
      <div className="text-center">
        <h3 className="text-base font-medium mb-2">{title}</h3>
        <div className="mb-3">
          {imageUrl && (
            <div className="relative">
              <img 
                src={imageUrl} 
                alt={title} 
                className="w-full h-32 object-cover mb-3 rounded"
              />
              <button 
                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                onClick={onImageUpdate}
                title="Cập nhật hình ảnh"
              >
                <UploadOutlined style={{ color: '#52c41a' }} />
              </button>
            </div>
          )}
        </div>
        <div className="mb-3 text-sm text-left">
          <p className="truncate">
            <span className="font-medium">ID Hồ:</span>{" "}
            <span className="text-xs">{koiPondId || "Không có"}</span>
          </p>
          <p>
            <span className="font-medium">Hình dạng:</span>{" "}
            {shapeName || "Không có"}
          </p>
          <p className="truncate">
            <span className="font-medium">Giới thiệu:</span>{" "}
            {introduction || "Không có"}
          </p>
          <p className="truncate">
            <span className="font-medium">Mô tả:</span>{" "}
            {description || "Không có"}
          </p>
        </div>
        <div className="border-t pt-2">
          <div className="flex items-center mt-2">
            <CustomButton
              type="primary"
              className="mr-2"
              onClick={onUpdate}
              size="small"
            >
              Cập nhật
            </CustomButton>
            <span className="cursor-pointer" onClick={onDelete}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ff0000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Component hiển thị khi không có hình dạng hồ
const NoShapesMessage = () => (
  <div className="text-center p-6 bg-yellow-50 rounded-lg border border-yellow-200 mt-4">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-12 w-12 text-yellow-500 mx-auto mb-3"
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
    <h3 className="text-lg font-semibold text-yellow-800 mb-2">
      Không tìm thấy dữ liệu hình dạng hồ
    </h3>
    <p className="text-yellow-700 mb-4">
      Vui lòng kiểm tra kết nối API hoặc thêm dữ liệu hình dạng hồ trước khi tạo hồ mới.
    </p>
    <button
      onClick={fetchPondShapes}
      className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
    >
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
        data: err.response.data
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

  // Lấy danh sách hồ cá khi component được mount
  useEffect(() => {
    testApiConnection();
    fetchPonds();
  }, []);

  // Tách riêng việc tải danh sách hình dạng hồ
  useEffect(() => {
    fetchPondShapes();
  }, []);

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
      message.loading({ content: 'Đang tải danh sách hình dạng hồ...', key: 'loadingShapes' });
      
      const shapes = await KoiPondService.getPondShapes();
      
      if (shapes && shapes.length > 0) {
        console.log('Đã tải được', shapes.length, 'hình dạng hồ');
        setPondShapes(shapes);
        message.success({ content: `Đã tải ${shapes.length} hình dạng hồ cá`, key: 'loadingShapes', duration: 1 });
      } else {
        console.warn('Không có dữ liệu hình dạng hồ');
        message.warning({ content: 'Không tìm thấy dữ liệu hình dạng hồ cá', key: 'loadingShapes' });
        setPondShapes([]);
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh sách hình dạng hồ cá:", err);
      message.error({ content: 'Không thể tải danh sách hình dạng hồ cá', key: 'loadingShapes' });
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
      imageUrl: pondType.imageUrl
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
    console.log('Create image change:', fileList);
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

      // Kiểm tra introduction và description
      if (!values.introduction || values.introduction.trim() === "") {
        message.error("Vui lòng nhập thông tin giới thiệu");
        setLoading(false);
        return;
      }

      if (!values.description || values.description.trim() === "") {
        message.error("Vui lòng nhập thông tin mô tả");
        setLoading(false);
        return;
      }

      let cloudinaryUrl = values.imageUrl;
      
      // Nếu có file ảnh mới hoặc imageUrl đã có sẵn, sử dụng nó
      if (createImageFile) {
        message.loading({ content: "Đang tải ảnh lên Cloudinary...", key: "uploadImage" });
        console.log("Bắt đầu upload ảnh lên Cloudinary...");
        
        try {
          cloudinaryUrl = await uploadImageToCloudinary(createImageFile);
          
          if (!cloudinaryUrl) {
            message.error({ content: "Không thể tải ảnh lên Cloudinary", key: "uploadImage" });
            console.error("Tải ảnh lên Cloudinary thất bại, không nhận được URL");
            setLoading(false);
            return;
          }
          
          message.success({ content: "Tải ảnh lên Cloudinary thành công", key: "uploadImage" });
          console.log("Đã nhận được URL Cloudinary:", cloudinaryUrl);
        } catch (uploadError) {
          console.error("Lỗi khi upload Cloudinary:", uploadError);
          message.error({ content: "Lỗi khi tải ảnh lên: " + (uploadError.message || "Không xác định"), key: "uploadImage" });
          setLoading(false);
          return;
        }
      } else if (!cloudinaryUrl || cloudinaryUrl.trim() === "") {
        // Nếu không có file và không có URL, hiển thị lỗi
        message.error("Vui lòng chọn hình ảnh hoặc nhập URL hình ảnh");
        setLoading(false);
        return;
      }

      // Chuẩn bị dữ liệu
      const pondData = {
        pondName: values.pondName,
        shapeId: values.shapeId,
        introduction: values.introduction,
        description: values.description,
        imageUrl: cloudinaryUrl
      };

      console.log("Đang gửi dữ liệu hồ cá:", pondData);

      // Gọi API để tạo hồ cá mới với URL ảnh từ Cloudinary
      try {
        // Sử dụng phương thức createPond đã được cập nhật để gửi JSON đến API
        console.log("Gọi API tạo hồ cá mới...");
        const response = await KoiPondService.createPond(pondData);
        console.log("Phản hồi tạo hồ cá:", response);

        message.success("Đã tạo hồ cá mới thành công");
        setIsCreateModalVisible(false);
        createForm.resetFields();
        setCreateImageFile(null);
        setCreateImageUrl("");

        // Tải lại danh sách hồ cá để cập nhật UI
        await fetchPonds();
      } catch (error) {
        console.error("Lỗi khi tạo hồ cá:", error);
        
        let errorMsg = "Không thể tạo hồ cá mới. ";
        if (error.response && error.response.data) {
          console.error("Chi tiết lỗi API:", error.response.data);
          
          if (error.response.data.errors) {
            // Hiển thị lỗi chi tiết từ API
            const errors = error.response.data.errors;
            Object.keys(errors).forEach(key => {
              errorMsg += `${key}: ${errors[key].join(', ')}. `;
            });
          } else if (error.response.data.message) {
            errorMsg += error.response.data.message;
          } else if (error.response.data.title) {
            errorMsg += error.response.data.title;
          }
        } else if (error.message) {
          errorMsg += error.message;
        }
        
        message.error(errorMsg);
      }
    } catch (err) {
      console.error("Lỗi khi tạo hồ cá mới:", err);

      let errorMessage = "Không thể tạo hồ cá mới. ";

      if (err.response && err.response.data) {
        console.error("API error response:", err.response.data);
        
        if (err.response.data.title) {
          errorMessage += err.response.data.title;
        } else if (err.response.data.message) {
          errorMessage += err.response.data.message;
        } else if (typeof err.response.data === "string") {
          errorMessage += err.response.data;
        } else {
          errorMessage += JSON.stringify(err.response.data);
        }
      } else if (err.message) {
        errorMessage += err.message;
      } else {
        errorMessage += "Vui lòng thử lại sau.";
      }

      message.error(errorMessage);
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
                const isImage = file.type.startsWith('image/');
                if (!isImage) {
                  message.error('Chỉ chấp nhận file hình ảnh!');
                  return Upload.LIST_IGNORE;
                }
                return false; // Ngăn tự động upload
              }}
              onChange={({ fileList }) => {
                if (fileList.length > 0) {
                  // Lưu file đã chọn vào biến tạm
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
        okText: 'Cập nhật',
        onOk: async () => {
          const file = window.selectedImageFile;
          if (!file) {
            message.error('Vui lòng chọn một hình ảnh');
            return;
          }
          
          try {
            setLoading(true);
            message.loading({ content: 'Đang tải ảnh lên Cloudinary...', key: 'uploadImage' });
            console.log('Bắt đầu upload ảnh lên Cloudinary:', file.name);
            
            // Upload ảnh lên Cloudinary
            let cloudinaryUrl;
            try {
              cloudinaryUrl = await uploadImageToCloudinary(file);
              
              if (!cloudinaryUrl) {
                message.error({ content: 'Không thể tải ảnh lên Cloudinary', key: 'uploadImage' });
                console.error('Upload Cloudinary thất bại, không nhận được URL');
                setLoading(false);
                return;
              }
            } catch (cloudinaryError) {
              console.error('Lỗi khi upload Cloudinary:', cloudinaryError);
              message.error({ 
                content: 'Lỗi khi tải ảnh lên Cloudinary: ' + (cloudinaryError.message || 'Không xác định'),
                key: 'uploadImage'
              });
              setLoading(false);
              return;
            }
            
            message.success({ content: 'Tải ảnh lên Cloudinary thành công', key: 'uploadImage' });
            console.log('Đã nhận được URL Cloudinary:', cloudinaryUrl);
            
            // Chuẩn bị dữ liệu cập nhật
            const pondId = pondType.koiPondId || pondType.id;
            const updateData = {
              shapeId: pondType.shapeId,
              pondName: pondType.pondName,
              introduction: pondType.introduction || '',
              description: pondType.description || '',
              imageUrl: cloudinaryUrl
            };
            
            console.log('Gửi dữ liệu cập nhật hồ cá:', updateData);
            
            // Cập nhật thông tin hồ cá với URL ảnh mới
            try {
              const response = await KoiPondService.updateKoiPond(pondId, updateData);
              console.log('Phản hồi cập nhật hồ cá:', response);
              
              message.success(`Đã cập nhật hình ảnh cho hồ ${pondType.pondName}`);
              
              // Xóa biến tạm
              delete window.selectedImageFile;
              
              // Tải lại danh sách hồ cá
              await fetchPonds();
            } catch (updateError) {
              console.error('Lỗi khi cập nhật thông tin hồ cá:', updateError);
              
              let errorMsg = 'Không thể cập nhật thông tin hồ cá. ';
              if (updateError.response && updateError.response.data) {
                if (updateError.response.data.errors) {
                  const errors = updateError.response.data.errors;
                  Object.keys(errors).forEach(key => {
                    errorMsg += `${key}: ${errors[key].join(', ')}. `;
                  });
                } else if (updateError.response.data.message) {
                  errorMsg += updateError.response.data.message;
                } else if (updateError.response.data.title) {
                  errorMsg += updateError.response.data.title;
                }
              } else if (updateError.message) {
                errorMsg += updateError.message;
              }
              
              message.error(errorMsg);
            }
          } catch (error) {
            console.error('Lỗi khi cập nhật hình ảnh:', error);
            message.error('Không thể cập nhật hình ảnh. Vui lòng thử lại sau.');
          } finally {
            setLoading(false);
          }
        },
        cancelText: 'Hủy',
        onCancel: () => {
          // Xóa biến tạm
          delete window.selectedImageFile;
        }
      });
    } catch (err) {
      console.error('Lỗi khi cập nhật hình ảnh:', err);
      message.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
    }
  };

  const handleEditImageChange = ({ fileList }) => {
    console.log('Edit image change:', fileList);
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
        return;
      }

      if (!values.shapeId) {
        message.error("Vui lòng chọn hình dạng hồ");
        return;
      }
      
      // Kiểm tra introduction và description
      if (!values.introduction || values.introduction.trim() === "") {
        message.error("Vui lòng nhập thông tin giới thiệu");
        return;
      }

      if (!values.description || values.description.trim() === "") {
        message.error("Vui lòng nhập thông tin mô tả");
        return;
      }
      
      setLoading(true);

      const pondId = selectedPond.koiPondId || selectedPond.id;
      
      let cloudinaryUrl = values.imageUrl;
      
      // Nếu có file ảnh mới, upload lên Cloudinary
      if (editImageFile) {
        message.loading({ content: "Đang tải ảnh lên Cloudinary...", key: "uploadEditImage" });
        cloudinaryUrl = await uploadImageToCloudinary(editImageFile);
        
        if (!cloudinaryUrl) {
          message.error({ content: "Không thể tải ảnh lên Cloudinary", key: "uploadEditImage" });
          setLoading(false);
          return;
        }
        message.success({ content: "Tải ảnh lên Cloudinary thành công", key: "uploadEditImage" });
      } else if (values.imageUrl && values.imageUrl.startsWith('blob:')) {
        // Nếu URL là blob nhưng không có file mới, giữ nguyên URL cũ
        cloudinaryUrl = selectedPond.imageUrl;
      } else if (!cloudinaryUrl || cloudinaryUrl.trim() === "") {
        // Nếu không có URL hình ảnh, hiển thị lỗi
        message.error("Vui lòng chọn hình ảnh hoặc nhập URL hình ảnh");
        setLoading(false);
        return;
      }
      
      // Chuẩn bị dữ liệu để cập nhật
      const updateData = {
        shapeId: values.shapeId,
        pondName: values.pondName,
        introduction: values.introduction,
        description: values.description,
        imageUrl: cloudinaryUrl
      };

      console.log("Updating pond with data:", updateData);

      try {
        // Cập nhật thông tin cơ bản (bao gồm cả imageUrl từ Cloudinary)
        const updateResponse = await KoiPondService.updateKoiPond(pondId, updateData);
        console.log("Update response:", updateResponse);

        message.success(`Đã cập nhật thông tin hồ ${selectedPond.pondName}`);
        setIsEditModalVisible(false);
        setEditImageFile(null);

        // Tải lại danh sách hồ cá để cập nhật UI
        await fetchPonds();
      } catch (apiError) {
        console.error("Error in API calls:", apiError);
        
        let errorMsg = "Không thể cập nhật: ";
        if (apiError.response && apiError.response.data) {
          if (apiError.response.data.errors) {
            // Hiển thị lỗi chi tiết từ API
            const errors = apiError.response.data.errors;
            Object.keys(errors).forEach(key => {
              errorMsg += `${key}: ${errors[key].join(', ')}. `;
            });
          } else if (apiError.response.data.message) {
            errorMsg += apiError.response.data.message;
          }
        } else {
          errorMsg += apiError.message || 'Đã xảy ra lỗi';
        }
        
        message.error(errorMsg);
      } finally {
        setLoading(false);
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật thông tin hồ cá:", err);
      
      let errorMessage = "Không thể cập nhật thông tin hồ cá. ";

      if (err.response && err.response.data) {
        console.error("API error response:", err.response.data);
        
        if (err.response.data.title) {
          errorMessage += err.response.data.title;
        } else if (err.response.data.message) {
          errorMessage += err.response.data.message;
        } else if (typeof err.response.data === "string") {
          errorMessage += err.response.data;
        } else {
          errorMessage += JSON.stringify(err.response.data);
        }
      } else if (err.message) {
        errorMessage += err.message;
      } else {
        errorMessage += "Vui lòng thử lại sau.";
      }
      
      message.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Quản lý hồ cá Koi"
        description="Quản lý thông tin và danh sách các loại hồ cá Koi"
      />

      <div className="p-6">
        <div className="mb-4 flex justify-between items-center">
          {loadingShapes ? (
            <Spin size="small" /> 
          ) : pondShapes && pondShapes.length > 0 ? (
            <CustomButton
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreatePond}
            >
              Tạo hồ mới
            </CustomButton>
          ) : (
            <Tooltip title="Cần có dữ liệu hình dạng hồ trước khi tạo hồ mới">
              <CustomButton 
                type="primary" 
                icon={<PlusOutlined />} 
                disabled
              >
                Tạo hồ mới
              </CustomButton>
            </Tooltip>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" tip="Đang tải..." />
          </div>
        ) : error ? (
          <Error message={error} />
        ) : (
          <Row gutter={[16, 16]}>
            {pondTypes && pondTypes.length > 0 ? (
              pondTypes.map((pondType) => (
                <Col
                  xs={24}
                  sm={12}
                  md={8}
                  lg={6}
                  key={pondType.koiPondId}
                >
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
                  />
                </Col>
              ))
            ) : (
              <Col span={24}>
                <div className="text-center p-8">
                  <p>Không có dữ liệu hồ cá. Vui lòng thêm hồ cá mới.</p>
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
            label={<span className="text-red-500">* Tên hồ cá</span>}
            rules={[{ required: true, message: "Vui lòng nhập tên hồ cá" }]}
          >
            <input
              className="w-full p-2 border rounded"
              placeholder="Nhập tên hồ cá"
            />
          </Form.Item>
          <Form.Item
            name="shapeId"
            label={<span className="text-red-500">* Hình dạng hồ</span>}
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
            label={<span className="text-red-500">* Giới thiệu</span>}
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
            label={<span className="text-red-500">* Mô tả</span>}
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
            label={<span className="text-red-500">* Hình ảnh</span>}
            rules={[{ required: true, message: "Vui lòng cung cấp URL hình ảnh hoặc tải ảnh lên" }]}
          >
            <div className="mb-2">
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="Nhập URL hình ảnh (nếu có)"
              />
            </div>
            <div className="mt-2">
              <p className="text-gray-600 mb-2 text-sm">Hoặc tải lên từ máy tính:</p>
              <Upload
                listType="picture-card"
                onChange={handleEditImageChange}
                maxCount={1}
                beforeUpload={(file) => {
                  const isImage = file.type.startsWith('image/');
                  if (!isImage) {
                    message.error('Chỉ chấp nhận file hình ảnh!');
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
              {selectedPond && selectedPond.imageUrl && (
                <div className="mt-2">
                  <p className="text-gray-600 text-sm">Hình ảnh hiện tại:</p>
                  <img 
                    src={selectedPond.imageUrl} 
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
            label={<span className="text-red-500">* Tên hồ cá</span>}
            rules={[{ required: true, message: "Vui lòng nhập tên hồ cá" }]}
          >
            <input
              className="w-full p-2 border rounded"
              placeholder="Nhập tên hồ cá"
            />
          </Form.Item>
          <Form.Item
            name="shapeId"
            label={<span className="text-red-500">* Hình dạng hồ</span>}
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
            label={<span className="text-red-500">* Giới thiệu</span>}
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
            label={<span className="text-red-500">* Mô tả</span>}
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
            label={<span className="text-red-500">* Hình ảnh</span>}
            rules={[{ required: true, message: "Vui lòng cung cấp URL hình ảnh hoặc tải ảnh lên" }]}
          >
            <div className="mb-2">
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="Nhập URL hình ảnh (nếu có)"
                value={createImageUrl}
                onChange={(e) => setCreateImageUrl(e.target.value)}
              />
            </div>
            <div className="mt-2">
              <p className="text-gray-600 mb-2 text-sm">Hoặc tải lên từ máy tính:</p>
              <Upload
                listType="picture-card"
                onChange={handleCreateImageChange}
                maxCount={1}
                beforeUpload={(file) => {
                  const isImage = file.type.startsWith('image/');
                  if (!isImage) {
                    message.error('Chỉ chấp nhận file hình ảnh!');
                    return Upload.LIST_IGNORE;
                  }
                  return false; // Không tự động upload
                }}
                fileList={createImageFile ? [{
                  uid: '-1',
                  name: createImageFile.name,
                  status: 'done',
                  url: createImageUrl,
                }] : []}
              >
                {createImageFile ? null : (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Tải lên</div>
                  </div>
                )}
              </Upload>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Thêm style cho modal xác nhận xóa */}
      <style jsx global>{`
        .delete-confirmation-modal .ant-modal-content {
          border-radius: 8px;
          overflow: hidden;
        }
        .delete-confirmation-modal .ant-modal-body {
          padding: 24px;
        }
        .delete-confirmation-modal .ant-modal-confirm-title {
          font-size: 18px;
          font-weight: 600;
        }
        .delete-confirmation-modal .ant-modal-confirm-content {
          margin-top: 8px;
          margin-bottom: 24px;
          font-size: 14px;
        }
        .delete-confirmation-modal .ant-modal-confirm-btns {
          margin-top: 24px;
        }
        .delete-confirmation-modal .ant-btn-primary {
          background-color: #f5222d;
          border-color: #f5222d;
        }
        .delete-confirmation-modal .ant-btn-primary:hover {
          background-color: #ff4d4f;
          border-color: #ff4d4f;
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
          border-color: #90B77D;
          box-shadow: 0 0 0 2px rgba(144, 183, 125, 0.2);
        }
        
        .shape-select select option {
          padding: 10px;
        }
        
        .shape-select select option:hover {
          background-color: #f5f5f5;
        }
      `}</style>
    </div>
  );
};

export default KoiPondManagement;
