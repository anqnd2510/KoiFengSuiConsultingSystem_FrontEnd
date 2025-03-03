import React, { useState } from "react";
import { Row, Col, Card, Button, Typography, message, Modal, Upload, Form } from "antd";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import Header from "../components/Common/Header";

const { Title } = Typography;
const { Dragger } = Upload;

const PondCard = ({ title, image, onUpdate }) => {
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
        <Button 
          type="primary" 
          className="w-full bg-blue-500"
          onClick={onUpdate}
        >
          Cập nhật 
        </Button>
      </div>
    </Card>
  );
};

const KoiPondManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPond, setSelectedPond] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [previewVisible, setPreviewVisible] = useState(false);
  const [form] = Form.useForm();

  // Mock data cho các loại hồ cá
  const [pondTypes, setPondTypes] = useState([
    {
      id: 1,
      title: "Hình chữ nhật",
      image: "https://images.unsplash.com/photo-1542587227-8802646daa56?q=80&w=2940&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "Hình lượn sóng",
      image: "https://images.unsplash.com/photo-1578860305106-6ace19bfa3cf?q=80&w=2940&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "Hình tam giác",
      image: "https://images.unsplash.com/photo-1555187381-fa11b4086992?q=80&w=3024&auto=format&fit=crop",
    },
    {
      id: 4,
      title: "Hình tròn",
      image: "https://images.unsplash.com/photo-1580861405218-1805ff978aa4?q=80&w=2938&auto=format&fit=crop",
    },
    {
      id: 5,
      title: "Hình vuông",
      image: "https://images.unsplash.com/photo-1511044568932-338cba0ad803?q=80&w=2940&auto=format&fit=crop",
    },
  ]);

  const handleUpdate = (pondType) => {
    setSelectedPond(pondType);
    setFileList([]);
    setIsModalVisible(true);
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

  const handleSave = () => {
    if (fileList.length === 0) {
      message.error("Vui lòng chọn một hình ảnh mới");
      return;
    }

    // Giả lập URL hình ảnh từ file đã tải lên
    const file = fileList[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      // Cập nhật URL hình ảnh mới
      const newPondTypes = pondTypes.map(pond => {
        if (pond.id === selectedPond.id) {
          return {
            ...pond,
            image: e.target.result
          };
        }
        return pond;
      });
      
      setPondTypes(newPondTypes);
      message.success(`Đã cập nhật hình ảnh cho hồ ${selectedPond.title}`);
      setIsModalVisible(false);
    };
    
    reader.readAsDataURL(file.originFileObj);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Quản lý hồ cá Koi"
        description="Quản lý thông tin và danh sách các loại hồ cá Koi"
      />

      <div className="p-6">
        <Row gutter={[16, 16]}>
          {pondTypes.map((pondType) => (
            <Col xs={24} sm={12} md={8} lg={6} key={pondType.id}>
              <PondCard
                title={pondType.title}
                image={pondType.image}
                onUpdate={() => handleUpdate(pondType)}
              />
            </Col>
          ))}
        </Row>
      </div>

      {/* Modal cập nhật hình ảnh */}
      <Modal
        title={`Cập nhật hình ảnh cho hồ ${selectedPond?.title || ""}`}
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={handleSave}
        okText="Lưu thay đổi"
        cancelText="Hủy"
      >
        <div className="mb-4">
          <p>Chọn hình ảnh mới cho hồ cá:</p>
          <Upload {...uploadProps}>
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
        </div>
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
    </div>
  );
};

export default KoiPondManagement; 