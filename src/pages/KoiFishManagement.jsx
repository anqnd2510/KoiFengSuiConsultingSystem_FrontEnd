import React, { useState } from "react";
import { Space, Table, Button, Typography, Tag, Popconfirm, message, Modal, Form, Input, Select, Upload, Divider, InputNumber, Row, Col } from "antd";
import SearchBar from "../components/Common/SearchBar";
import Pagination from "../components/Common/Pagination";
import { useNavigate } from "react-router-dom";
import { UploadCloud, Plus, Trash2 } from "lucide-react";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// Component form cho cá Koi
const KoiFishForm = ({ form, initialData, colorFields, setColorFields, loading }) => {
  // Hàm thêm trường màu sắc
  const addColorField = () => {
    setColorFields([...colorFields, { name: "", value: "" }]);
  };

  // Hàm xóa trường màu sắc
  const removeColorField = (index) => {
    const newFields = [...colorFields];
    newFields.splice(index, 1);
    setColorFields(newFields);
  };

  // Hàm cập nhật trường màu sắc
  const updateColorField = (index, field, value) => {
    const newFields = [...colorFields];
    newFields[index][field] = value;
    setColorFields(newFields);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      disabled={loading}
    >
      <Row gutter={16}>
        <Col span={24} md={12}>
          <Form.Item
            label="Tên giống cá Koi"
            name="breed"
            rules={[{ required: true, message: "Vui lòng nhập tên giống cá Koi" }]}
          >
            <Input placeholder="Nhập tên giống cá Koi" />
          </Form.Item>
        </Col>

        <Col span={24} md={12}>
          <Form.Item
            label="Mệnh của cá"
            name="element"
            rules={[{ required: true, message: "Vui lòng chọn mệnh của cá" }]}
          >
            <Select placeholder="Chọn mệnh của cá">
              <Option value="Thủy">Thủy</Option>
              <Option value="Hỏa">Hỏa</Option>
              <Option value="Thổ">Thổ</Option>
              <Option value="Kim">Kim</Option>
              <Option value="Mộc">Mộc</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        label="Hình ảnh"
        name="image"
      >
        <Upload
          listType="picture-card"
          maxCount={1}
          beforeUpload={() => false} // Ngăn tự động upload
        >
          <div className="flex flex-col items-center">
            <UploadCloud className="w-6 h-6 text-gray-400" />
            <div className="mt-2">Tải lên</div>
          </div>
        </Upload>
      </Form.Item>

      <Form.Item
        label="Thông tin giới thiệu"
        name="description"
        rules={[{ required: true, message: "Vui lòng nhập thông tin giới thiệu" }]}
      >
        <TextArea
          placeholder="Nhập thông tin giới thiệu về loài cá Koi"
          autoSize={{ minRows: 3, maxRows: 6 }}
        />
      </Form.Item>

      <Divider orientation="left">Màu sắc</Divider>
      
      <div className="mb-4">
        {colorFields.map((field, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <Input
              placeholder="Tên màu"
              value={field.name}
              onChange={(e) => updateColorField(index, "name", e.target.value)}
              style={{ width: "50%" }}
            />
            <InputNumber
              placeholder="Tỷ lệ (0.0-1.0)"
              min={0}
              max={1}
              step={0.01}
              value={field.value}
              onChange={(value) => updateColorField(index, "value", value)}
              style={{ width: "30%" }}
            />
            <Button
              type="text"
              danger
              icon={<Trash2 size={16} />}
              onClick={() => removeColorField(index)}
              disabled={colorFields.length <= 1}
            />
          </div>
        ))}
        
        <Button 
          type="dashed" 
          onClick={addColorField}
          block
          icon={<Plus size={16} />}
        >
          Thêm màu sắc
        </Button>
      </div>
    </Form>
  );
};

const KoiFishManagement = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  
  // States cho modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedKoi, setSelectedKoi] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [colorFields, setColorFields] = useState([{ name: "", value: "" }]);

  // Mock data cho các loại cá Koi
  const initialData = [
    {
      id: 1,
      breed: "Asagi",
      image: "https://example.com/asagi.jpg",
      element: "Thủy",
      description: "Asagi chính là giống sản sinh ra Nishikigoi, chúng bắt nguồn từ loài cá chép Magoi cổ đại.",
      colors: [
        { name: "Đen", value: "0.50" },
        { name: "Đỏ", value: "0.10" },
        { name: "Trắng", value: "0.40" },
      ],
    },
    {
      id: 2,
      breed: "Beni Kumonryu",
      image: "https://example.com/beni-kumonryu.jpg",
      element: "Hỏa",
      description: "Koi Beni Kumonryu là một biến thể hiếm hoi của Kumonryu, chúng được lai tạo để có màu đỏ trên đầu.",
      colors: [
        { name: "Đen", value: "0.10" },
        { name: "Đỏ", value: "0.60" },
        { name: "Trắng", value: "0.30" },
      ],
    },
    {
      id: 3,
      breed: "Gin Rin Yamato Nishiki",
      image: "https://example.com/gin-rin.jpg",
      element: "Hỏa",
      description: "Gin Rin Yamato nishiki koi là loài cá được lai tạo khoảng thời gian đầu thế kỷ 20 tại Nhật Bản.",
      colors: [
        { name: "Cam", value: "0.70" },
        { name: "Đen", value: "0.05" },
        { name: "Trắng", value: "0.25" },
      ],
    },
    {
      id: 4,
      breed: "Ginrin Chagoi",
      image: "https://example.com/ginrin-chagoi.jpg",
      element: "Thổ",
      description: "Ginrin Chagoi luôn chiếm được sự yêu thích từ người chơi cá Koi. Chúng dễ nuôi và rất thân thiện.",
      colors: [
        { name: "Nâu", value: "0.20" },
        { name: "Vàng", value: "0.80" },
      ],
    },
  ];

  const [data, setData] = useState(initialData);

  // Hàm xử lý tìm kiếm
  const handleSearch = (value) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  // Hàm xóa cá Koi
  const handleDelete = (id) => {
    const newData = data.filter((item) => item.id !== id);
    setData(newData);
    message.success("Đã xóa cá Koi thành công");
  };

  // Hàm chuyển trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Hàm mở modal để tạo mới
  const handleOpenCreateModal = () => {
    setSelectedKoi(null);
    setColorFields([{ name: "", value: "" }]);
    form.resetFields();
    setIsModalOpen(true);
  };

  // Hàm mở modal để chỉnh sửa
  const handleOpenEditModal = (koi) => {
    setSelectedKoi(koi);
    setColorFields(koi.colors);
    form.setFieldsValue({
      breed: koi.breed,
      element: koi.element,
      description: koi.description,
    });
    setIsModalOpen(true);
  };

  // Đóng modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedKoi(null);
    form.resetFields();
  };

  // Hàm lưu dữ liệu
  const handleSave = () => {
    form.validateFields().then((values) => {
      setLoading(true);
      
      // Kết hợp giá trị từ form với danh sách màu sắc
      const formData = {
        ...values,
        colors: colorFields,
      };
      
      setTimeout(() => {
        if (selectedKoi) {
          // Cập nhật
          const newData = data.map(item => {
            if (item.id === selectedKoi.id) {
              return {
                ...item,
                ...formData
              };
            }
            return item;
          });
          setData(newData);
          message.success("Đã cập nhật thông tin cá Koi thành công");
        } else {
          // Tạo mới
          const newId = Math.max(...data.map(item => item.id)) + 1;
          const newKoi = {
            id: newId,
            ...formData
          };
          setData([...data, newKoi]);
          message.success("Đã tạo mới loài cá Koi thành công");
        }
        
        setLoading(false);
        handleCloseModal();
      }, 1000);
    });
  };

  // Cấu hình các cột cho bảng
  const columns = [
    {
      title: "Giống cá Koi",
      dataIndex: "breed",
      key: "breed",
      width: "15%",
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      width: "15%",
      render: (_, record) => (
        <div className="w-24 h-24 overflow-hidden">
          <img
            src={record.image}
            alt={record.breed}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/150?text=Koi+Fish";
            }}
          />
        </div>
      ),
    },
    {
      title: "Mệnh của cá",
      dataIndex: "element",
      key: "element",
      width: "10%",
      render: (element) => {
        let color = "blue";
        if (element === "Hỏa") color = "volcano";
        if (element === "Thổ") color = "gold";
        if (element === "Thủy") color = "blue";
        return <Tag color={color}>{element}</Tag>;
      },
    },
    {
      title: "Thông tin giới thiệu",
      dataIndex: "description",
      key: "description",
      width: "25%",
      ellipsis: true,
    },
    {
      title: "Màu sắc",
      key: "colors",
      dataIndex: "colors",
      width: "20%",
      render: (_, record) => (
        <ul className="list-disc pl-5">
          {record.colors.map((color, index) => (
            <li key={index}>
              {color.name}: {color.value}
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: "15%",
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            size="small"
            onClick={() => handleOpenEditModal(record)}
          >
            Chỉnh sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa cá Koi này không?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="primary" danger size="small">
              Xóa cá Koi
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Lọc dữ liệu theo tìm kiếm
  const filteredData = data.filter((item) =>
    item.breed.toLowerCase().includes(searchText.toLowerCase())
  );

  // Phân trang dữ liệu
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#B89D71] p-4">
        <h1 className="text-white text-xl font-semibold">
          Quản lý cá Koi
        </h1>
        <p className="text-white/80 text-sm">
          Quản lý thông tin và danh sách các loại cá Koi
        </p>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="flex flex-wrap justify-between items-center mb-4">
          <div className="flex gap-2 mb-4">
            <Button type="primary" onClick={handleOpenCreateModal}>Tạo mới loài cá Koi</Button>
            <Button>Quản lý màu sắc</Button>
          </div>
          <SearchBar
            placeholder="Tìm kiếm theo giống cá..."
            onSearch={handleSearch}
            className="w-64"
          />
        </div>

        <Table
          columns={columns}
          dataSource={paginatedData}
          pagination={false}
          rowKey="id"
          bordered
        />

        <div className="mt-4 flex justify-end">
          <Pagination
            current={currentPage}
            total={filteredData.length}
            pageSize={pageSize}
            onChange={handlePageChange}
          />
        </div>
      </div>

      {/* Modal for Create/Edit */}
      <Modal
        title={
          <div className="text-xl font-semibold">
            {selectedKoi ? "Chỉnh sửa thông tin cá Koi" : "Tạo mới loài cá Koi"}
          </div>
        }
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={700}
        className="koi-fish-modal"
      >
        <div className="p-4">
          <KoiFishForm
            form={form}
            initialData={selectedKoi}
            colorFields={colorFields}
            setColorFields={setColorFields}
            loading={loading}
          />
          
          <div className="flex justify-end gap-3 mt-6">
            <Button onClick={handleCloseModal}>
              Hủy bỏ
            </Button>
            <Button type="primary" onClick={handleSave} loading={loading}>
              {selectedKoi ? "Cập nhật" : "Tạo mới"}
            </Button>
          </div>
        </div>
      </Modal>

      <style jsx global>{`
        .koi-fish-modal .ant-modal-content {
          border-radius: 12px;
          overflow: hidden;
        }
        .koi-fish-modal .ant-modal-header {
          border-bottom: 1px solid #f0f0f0;
          padding: 16px 24px;
        }
        .koi-fish-modal .ant-modal-body {
          padding: 12px;
        }
        .koi-fish-modal .ant-modal-footer {
          border-top: 1px solid #f0f0f0;
        }
      `}</style>
    </div>
  );
};

export default KoiFishManagement; 