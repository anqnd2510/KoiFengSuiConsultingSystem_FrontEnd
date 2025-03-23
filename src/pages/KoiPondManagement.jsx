import React, { useState, useEffect } from "react";
import { Row, Col, Card, Typography, message, Modal, Upload, Form, Spin, Space, Popconfirm } from "antd";
import { UploadOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import Header from "../components/Common/Header";
import Error from "../components/Common/Error";
import CustomButton from "../components/Common/CustomButton";
import KoiPondService from "../services/koipond.service";

const { Title } = Typography;
const { Dragger } = Upload;

const PondCard = ({ title, image, onUpdate, onDelete, size, direction, shapeId, koiPondId }) => {
  return (
    <Card className="h-full">
      <div className="text-center">
        <h3 className="text-base font-medium mb-2">{title}</h3>
        <div className="mb-3">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-32 object-cover rounded-md"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/150?text=Pond+Type";
            }}
          />
        </div>
        <div className="mb-3 text-sm text-left">
          <p><span className="font-medium">Kích thước:</span> {size || 'Không có'}</p>
          <p><span className="font-medium">Hướng:</span> {direction || 'Không có'}</p>
          <p className="truncate"><span className="font-medium">ID Hồ:</span> <span className="text-xs">{koiPondId || 'Không có'}</span></p>
          <p className="truncate"><span className="font-medium">ID Hình dạng:</span> <span className="text-xs">{shapeId || 'Không có'}</span></p>
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
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

const KoiPondManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [selectedPond, setSelectedPond] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [previewVisible, setPreviewVisible] = useState(false);
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

  // Lấy danh sách hồ cá khi component được mount
  useEffect(() => {
    testApiConnection();
    fetchPonds();
    fetchPondShapes();
  }, []);

  const testApiConnection = async () => {
    try {
      const result = await KoiPondService.testApiConnection();
      if (result.success) {
        console.log('API connection successful');
      } else {
        console.error('API connection failed');
        setError("Không thể kết nối đến API. Vui lòng kiểm tra lại kết nối.");
      }
    } catch (err) {
      console.error('Error testing API connection:', err);
    }
  };

  const fetchPondShapes = async () => {
    try {
      const shapes = await KoiPondService.getPondShapes();
      setPondShapes(shapes);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách hình dạng hồ cá:", err);
    }
  };

  const fetchPonds = async () => {
    try {
      setLoading(true);
      const response = await KoiPondService.getAllKoiPonds();
      
      console.log('Response from API:', response);
      
      // Kiểm tra cấu trúc dữ liệu trả về từ API
      if (response && response.data) {
        console.log('Setting pond types from response.data:', response.data);
        setPondTypes(response.data);
      } else if (Array.isArray(response)) {
        console.log('Setting pond types from array response:', response);
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
      size: pondType.size,
      direction: pondType.direction,
      shapeId: pondType.shapeId
    });
    setIsEditModalVisible(true);
  };

  const handleDelete = (id) => {
    const pondToDelete = pondTypes.find(pond => (pond.koiPondId || pond.id) === id);
    console.log("Đang xóa hồ cá:", pondToDelete);
    
    // Sử dụng Modal.confirm để xác nhận xóa
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa hồ cá này không?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      centered: true, // Để modal hiển thị ở giữa màn hình
      className: "delete-confirmation-modal", // Thêm class để styling
      onOk: async () => {
        try {
          setLoading(true);
          
          // Gọi API xóa hồ cá
          const response = await KoiPondService.deletePond(id);
          console.log('Delete response:', response);
          
          // Kiểm tra kết quả xóa
          if (response && (response.isSuccess === true || (response.data && response.data.isSuccess === true))) {
            message.success('Xóa hồ cá thành công');
            
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
            console.error('Delete failed with response:', response);
            message.error(response?.message || 'Lỗi khi xóa hồ cá');
            
            if (response?.message?.includes('tham chiếu')) {
              Modal.error({
                title: 'Không thể xóa hồ cá',
                content: 'Hồ cá này đang được sử dụng bởi dữ liệu khác trong hệ thống. Vui lòng xóa các dữ liệu liên quan trước khi xóa hồ cá này.',
              });
            }
          }
        } catch (error) {
          console.error('Error in delete confirmation:', error);
          let errorMessage = 'Lỗi khi xóa hồ cá';
          
          if (error.response) {
            console.error('API error response:', error.response.data);
            
            if (error.response.status === 500) {
              errorMessage = 'Lỗi server: Không thể xóa hồ cá. Có thể hồ cá đang được sử dụng bởi dữ liệu khác.';
              
              Modal.error({
                title: 'Lỗi Server',
                content: 'Không thể xóa hồ cá. Vui lòng liên hệ quản trị viên hoặc thử lại sau.',
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
  };

  const handleCreateSubmit = async () => {
    try {
      const values = await createForm.validateFields();
      console.log('Form values:', values);
      
      setLoading(true);
      
      // Đảm bảo dữ liệu đúng định dạng
      const pondData = {
        pondName: values.pondName,
        size: values.size,
        direction: values.direction,
        shapeId: values.shapeId
      };
      
      // Kiểm tra và chuyển đổi dữ liệu
      if (typeof pondData.size === 'string') {
        pondData.size = parseInt(pondData.size) || 0;
      }
      
      // Đảm bảo shapeId là chuỗi hợp lệ
      if (!pondData.shapeId || pondData.shapeId.trim() === '') {
        message.error("Vui lòng nhập ID hình dạng hợp lệ");
        setLoading(false);
        return;
      }
      
      // Kiểm tra các trường bắt buộc khác
      if (!pondData.pondName || pondData.pondName.trim() === '') {
        message.error("Vui lòng nhập tên hồ cá");
        setLoading(false);
        return;
      }
      
      if (!pondData.direction || pondData.direction.trim() === '') {
        message.error("Vui lòng chọn hướng cho hồ cá");
        setLoading(false);
        return;
      }
      
      console.log('Sending pond data:', pondData);
      
      // Gọi API để tạo hồ cá mới
      const response = await KoiPondService.createPond(pondData);
      console.log('Create pond response:', response);
      
      message.success("Đã tạo hồ cá mới thành công");
      setIsCreateModalVisible(false);
      createForm.resetFields();
      
      // Tải lại danh sách hồ cá để cập nhật UI
      await fetchPonds();
    } catch (err) {
      console.error("Lỗi khi tạo hồ cá mới:", err);
      
      let errorMessage = "Không thể tạo hồ cá mới. ";
      
      if (err.response && err.response.data) {
        console.error("API error response:", err.response.data);
        if (typeof err.response.data === 'object') {
          errorMessage += JSON.stringify(err.response.data);
        } else if (err.response.data.message) {
          errorMessage += err.response.data.message;
        } else {
          errorMessage += "Lỗi từ server.";
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
    setIsModalVisible(false);
    setSelectedPond(null);
    setFileList([]);
  };

  const handlePreview = (file) => {
    setPreviewImage(file.url || file.thumbUrl);
    setPreviewVisible(true);
  };

  const handlePreviewCancel = () => {
    setPreviewVisible(false);
  };

  const handleChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleSave = async () => {
    if (fileList.length === 0) {
      message.error("Vui lòng chọn một hình ảnh mới");
      return;
    }

    try {
      setLoading(true);
      const file = fileList[0].originFileObj;
      
      // Sử dụng koiPondId thay vì id
      const pondId = selectedPond.koiPondId || selectedPond.id;
      
      // Gọi API để cập nhật hình ảnh
      await KoiPondService.uploadPondImage(pondId, file);
      
      // Tải lại danh sách hồ cá để cập nhật UI
      await fetchPonds();
      
      message.success(`Đã cập nhật hình ảnh cho hồ ${getPondName(selectedPond)}`);
      setIsModalVisible(false);
    } catch (err) {
      console.error("Lỗi khi cập nhật hình ảnh:", err);
      message.error("Không thể cập nhật hình ảnh. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    onPreview: handlePreview,
    onChange: handleChange,
    fileList: fileList,
    listType: "picture-card",
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('Bạn chỉ có thể tải lên hình ảnh!');
      }
      return isImage || Upload.LIST_IGNORE;
    },
    maxCount: 1,
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Tải lên</div>
    </div>
  );

  // Hàm để lấy tên hiển thị từ đối tượng hồ cá
  const getPondName = (pond) => {
    console.log('Pond object:', pond);
    // Sử dụng trường pondName từ dữ liệu API
    return pond.pondName || "Hồ không tên";
  };

  // Hàm để lấy URL hình ảnh từ đối tượng hồ cá
  const getPondImage = (pond) => {
    return pond.imageUrl || pond.image || "https://via.placeholder.com/150?text=No+Image";
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    setSelectedPond(null);
    editForm.resetFields();
  };

  const handleEditSubmit = async () => {
    try {
      const values = await editForm.validateFields();
      setLoading(true);
      
      const pondId = selectedPond.koiPondId || selectedPond.id;
      
      // Gọi API để cập nhật thông tin hồ cá
      await KoiPondService.updateKoiPond(pondId, values);
      
      message.success(`Đã cập nhật thông tin hồ ${getPondName(selectedPond)}`);
      setIsEditModalVisible(false);
      
      // Tải lại danh sách hồ cá để cập nhật UI
      await fetchPonds();
    } catch (err) {
      console.error("Lỗi khi cập nhật thông tin hồ cá:", err);
      message.error("Không thể cập nhật thông tin hồ cá. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpdate = (pondType) => {
    setSelectedPond(pondType);
    setFileList([]);
    setIsModalVisible(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Quản lý hồ cá Koi"
        description="Quản lý thông tin và danh sách các loại hồ cá Koi"
      />

      <div className="p-6">
        <div className="mb-4 flex justify-between items-center">
          <CustomButton 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleCreatePond}
          >
            Tạo hồ mới
          </CustomButton>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" tip="Đang tải..." />
          </div>
        ) : error ? (
          <Error message={error} />
        ) : (
          <Row gutter={[16, 16]}>
            {pondTypes.length > 0 ? (
              pondTypes.map((pondType) => (
                <Col xs={24} sm={12} md={8} lg={6} key={pondType.id || pondType.koiPondId}>
                  <PondCard
                    title={getPondName(pondType)}
                    image={getPondImage(pondType)}
                    onUpdate={() => handleUpdate(pondType)}
                    onDelete={() => handleDelete(pondType.koiPondId || pondType.id)}
                    size={pondType.size}
                    direction={pondType.direction}
                    shapeId={pondType.shapeId}
                    koiPondId={pondType.koiPondId}
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
      </div>

      {/* Modal cập nhật hình ảnh */}
      <Modal
        title={`Cập nhật hình ảnh cho hồ ${selectedPond ? getPondName(selectedPond) : ""}`}
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={handleSave}
        okText="Lưu thay đổi"
        cancelText="Hủy"
        confirmLoading={loading}
      >
        <div className="mb-4">
          <p>Chọn hình ảnh mới cho hồ cá:</p>
          <Upload {...uploadProps}>
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
        </div>
      </Modal>

      {/* Modal chỉnh sửa thông tin hồ cá */}
      <Modal
        title={`Chỉnh sửa thông tin hồ ${selectedPond ? getPondName(selectedPond) : ""}`}
        open={isEditModalVisible}
        onCancel={handleEditCancel}
        onOk={handleEditSubmit}
        okText="Lưu thay đổi"
        cancelText="Hủy"
        confirmLoading={loading}
      >
        <Form
          form={editForm}
          layout="vertical"
        >
          <Form.Item
            name="pondName"
            label={<span className="text-red-500">* Tên hồ cá</span>}
            rules={[{ required: true, message: 'Vui lòng nhập tên hồ cá' }]}
          >
            <input className="w-full p-2 border rounded" placeholder="Nhập tên hồ cá" />
          </Form.Item>
          <Form.Item
            name="size"
            label={<span className="text-red-500">* Kích thước</span>}
            rules={[{ required: true, message: 'Vui lòng nhập kích thước' }]}
          >
            <input 
              className="w-full p-2 border rounded" 
              placeholder="Nhập kích thước" 
            />
          </Form.Item>
          <Form.Item
            name="direction"
            label={<span className="text-red-500">* Hướng</span>}
            rules={[{ required: true, message: 'Vui lòng nhập hướng' }]}
          >
            <select className="w-full p-2 border rounded">
              <option value="">Chọn hướng</option>
              <option value="North">Bắc</option>
              <option value="South">Nam</option>
              <option value="East">Đông</option>
              <option value="West">Tây</option>
              <option value="Northeast">Đông Bắc</option>
              <option value="Northwest">Tây Bắc</option>
              <option value="Southeast">Đông Nam</option>
              <option value="Southwest">Tây Nam</option>
            </select>
          </Form.Item>
          <Form.Item
            name="shapeId"
            label={<span className="text-red-500">* Hình dạng</span>}
            rules={[{ required: true, message: 'Vui lòng chọn hình dạng' }]}
          >
            <select className="w-full p-2 border rounded">
              <option value="">Chọn hình dạng</option>
              {pondShapes.length > 0 ? (
                pondShapes.map(shape => (
                  <option key={shape.id} value={shape.id}>{shape.name}</option>
                ))
              ) : (
                <option value="" disabled>Đang tải danh sách hình dạng...</option>
              )}
            </select>
          </Form.Item>
          <div className="mt-4">
            <CustomButton 
              type="primary" 
              className="w-full"
              onClick={() => {
                handleEditCancel();
                handleImageUpdate(selectedPond);
              }}
            >
              Cập nhật hình ảnh
            </CustomButton>
          </div>
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
        <Form
          form={createForm}
          layout="vertical"
        >
          <Form.Item
            name="pondName"
            label={<span className="text-red-500">* Tên hồ cá</span>}
            rules={[{ required: true, message: 'Vui lòng nhập tên hồ cá' }]}
          >
            <input className="w-full p-2 border rounded" placeholder="Nhập tên hồ cá" />
          </Form.Item>
          <Form.Item
            name="size"
            label={<span className="text-red-500">* Kích thước</span>}
            rules={[{ required: true, message: 'Vui lòng nhập kích thước' }]}
          >
            <input 
              className="w-full p-2 border rounded" 
              placeholder="Nhập kích thước" 
            />
          </Form.Item>
          <Form.Item
            name="direction"
            label={<span className="text-red-500">* Hướng</span>}
            rules={[{ required: true, message: 'Vui lòng nhập hướng' }]}
          >
            <select className="w-full p-2 border rounded">
              <option value="">Chọn hướng</option>
              <option value="North">Bắc</option>
              <option value="South">Nam</option>
              <option value="East">Đông</option>
              <option value="West">Tây</option>
              <option value="Northeast">Đông Bắc</option>
              <option value="Northwest">Tây Bắc</option>
              <option value="Southeast">Đông Nam</option>
              <option value="Southwest">Tây Nam</option>
            </select>
          </Form.Item>
          <Form.Item
            name="shapeId"
            label={<span className="text-red-500">* Hình dạng</span>}
            rules={[{ required: true, message: 'Vui lòng chọn hình dạng' }]}
          >
            <select className="w-full p-2 border rounded">
              <option value="">Chọn hình dạng</option>
              {pondShapes.length > 0 ? (
                pondShapes.map(shape => (
                  <option key={shape.id} value={shape.id}>{shape.name}</option>
                ))
              ) : (
                <option value="" disabled>Đang tải danh sách hình dạng...</option>
              )}
            </select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal xem trước hình ảnh */}
      <Modal
        open={previewVisible}
        title="Xem trước hình ảnh"
        footer={null}
        onCancel={handlePreviewCancel}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
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
      `}</style>
    </div>
  );
};

export default KoiPondManagement; 