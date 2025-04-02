import React, { useState, useEffect } from "react";
import {
  Space,
  Table,
  Button,
  Typography,
  Tag,
  Popconfirm,
  message,
  Modal,
  Form,
  Input,
  Select,
  Upload,
  Divider,
  InputNumber,
  Row,
  Col,
} from "antd";
import SearchBar from "../../components/Common/SearchBar";
import Pagination from "../../components/Common/Pagination";
import Header from "../../components/Common/Header";
import Error from "../../components/Common/Error";
import CustomButton from "../../components/Common/CustomButton";
import KoiFishForm from "../../components/KoiFishForm";
import { useNavigate } from "react-router-dom";
import { UploadCloud, Plus, Trash2 } from "lucide-react";
import KoiFishService from "../../services/koifish.service";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const KoiFishManagement = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // States cho modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedKoi, setSelectedKoi] = useState(null);
  const [form] = Form.useForm();
  const [modalLoading, setModalLoading] = useState(false);
  const [colorFields, setColorFields] = useState([
    { name: "", value: 0.5, colorCode: "#000000" },
  ]);

  // States cho modal quản lý màu sắc
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [colorForm] = Form.useForm();
  const [colorLoading, setColorLoading] = useState(false);

  const [data, setData] = useState([]);

  // Fetch danh sách cá Koi từ API
  useEffect(() => {
    fetchKoiList();
  }, []);

  const fetchKoiList = async () => {
    setLoading(true);
    try {
      const response = await KoiFishService.getAllKoiFish();
      console.log("Nhận dữ liệu từ service:", response);

      // Dữ liệu đã được xử lý bởi service
      setData(response);
      setError(null);
    } catch (err) {
      console.error("Lỗi khi fetch danh sách cá:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Không thể tải danh sách cá Koi";
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý tìm kiếm
  const handleSearch = (value) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  // Hàm xóa cá Koi
  const handleDelete = async (id) => {
    try {
      console.log("Xóa cá Koi ID:", id);
      const response = await KoiFishService.deleteKoiFish(id);
      console.log("Phản hồi từ API xóa:", response);

      if (response && response.isSuccess) {
        message.success(response.message || "Đã xóa cá Koi thành công");
        await fetchKoiList();
      } else {
        throw new Error(response?.message || "Có lỗi xảy ra khi xóa");
      }
    } catch (err) {
      console.error("Lỗi khi xóa cá Koi:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "Không thể xóa cá Koi";
      setError(errorMessage);
      message.error(errorMessage);
    }
  };

  // Hàm chuyển trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Hàm mở modal để tạo mới
  const handleOpenCreateModal = () => {
    setSelectedKoi(null);
    setColorFields([{ name: "", value: 0.5, colorCode: "#000000" }]);
    form.resetFields();
    setIsModalOpen(true);
  };

  // Hàm mở modal để chỉnh sửa
  const handleOpenEditModal = async (koi) => {
    try {
      setModalLoading(true);
      const koiDetail = await KoiFishService.getKoiFishById(koi.id);
      console.log("Chi tiết cá Koi:", koiDetail);

      setSelectedKoi(koiDetail);

      // Kiểm tra xem có trường colors không, nếu không thì sử dụng mảng rỗng
      const koiColors = koiDetail.colors || [];
      setColorFields(
        koiColors.map((color) => ({
          name: color.colorName,
          value: color.percentage / 100,
          colorCode: color.colorCode,
        })) || []
      );

      form.setFieldsValue({
        breed: koiDetail.varietyName,
        description: koiDetail.description,
      });
      setIsModalOpen(true);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Không thể tải thông tin cá Koi";
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setModalLoading(false);
    }
  };

  // Đóng modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedKoi(null);
    form.resetFields();
  };

  // Hàm lưu dữ liệu
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setModalLoading(true);

      // Kết hợp giá trị từ form với danh sách màu sắc
      const formData = {
        varietyName: values.breed,
        description: values.description,
        colors: colorFields.map((color) => ({
          colorName: color.name,
          colorCode: color.colorCode || "#000000",
          percentage: Math.round(color.value * 100),
        })),
      };

      let response;

      if (selectedKoi) {
        // Cập nhật
        console.log("Cập nhật cá Koi:", selectedKoi.id, formData);
        response = await KoiFishService.updateKoiFish(selectedKoi.id, formData);
        console.log("Phản hồi từ API cập nhật:", response);

        if (response && response.isSuccess) {
          message.success(
            response.message || "Đã cập nhật thông tin cá Koi thành công"
          );
        } else {
          throw new Error(response?.message || "Có lỗi xảy ra khi cập nhật");
        }
      } else {
        // Tạo mới
        console.log("Tạo mới cá Koi:", formData);
        response = await KoiFishService.createKoiFish(formData);
        console.log("Phản hồi từ API tạo mới:", response);

        if (response && response.isSuccess) {
          message.success(
            response.message || "Đã tạo mới loài cá Koi thành công"
          );
        } else {
          throw new Error(response?.message || "Có lỗi xảy ra khi tạo mới");
        }
      }

      await fetchKoiList();
      handleCloseModal();
    } catch (err) {
      console.error("Lỗi khi lưu dữ liệu:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "Đã xảy ra lỗi";
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setModalLoading(false);
    }
  };

  // Hàm mở modal quản lý màu sắc
  const handleOpenColorModal = () => {
    setIsColorModalOpen(true);
    colorForm.resetFields();
  };

  // Hàm đóng modal quản lý màu sắc
  const handleCloseColorModal = () => {
    setIsColorModalOpen(false);
    colorForm.resetFields();
  };

  // Hàm xử lý thêm màu mới
  const handleAddColor = async () => {
    try {
      const values = await colorForm.validateFields();
      setColorLoading(true);

      const formattedValues = {
        colorID: values.colorID,
        elementPoint: Object.entries(values.elementPoints).map(
          ([elementID, point]) => ({
            elementID,
            point: parseFloat(point),
          })
        ),
      };

      // Giả lập API call
      setTimeout(() => {
        message.success("Đã thêm màu mới thành công");
        handleCloseColorModal();
        setColorLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Lỗi khi thêm màu:", error);
      message.error("Không thể thêm màu mới");
    }
  };

  // Lọc dữ liệu theo tìm kiếm
  const filteredData = Array.isArray(data)
    ? data.filter((item) => {
        if (!item || typeof item !== "object") return false;
        return (
          item.varietyName &&
          item.varietyName
            .toLowerCase()
            .includes((searchText || "").toLowerCase())
        );
      })
    : [];

  // Cấu hình các cột cho bảng
  const columns = [
    {
      title: "Giống cá Koi",
      dataIndex: "varietyName",
      key: "varietyName",
      width: "15%",
      render: (text) => text || "N/A",
    },
    /* Tạm thời ẩn cột hình ảnh
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      width: "15%",
      render: (_, record) => (
        <div className="w-24 h-24 overflow-hidden">
          <img
            src={record?.image || "https://via.placeholder.com/150?text=Koi+Fish"}
            alt={record?.varietyName || "Cá Koi"}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/150?text=Koi+Fish";
            }}
          />
        </div>
      ),
    },
    */
    {
      title: "Thông tin giới thiệu",
      dataIndex: "description",
      key: "description",
      width: "40%", // Tăng độ rộng khi ẩn cột hình ảnh
      ellipsis: true,
      render: (text) => text || "Không có thông tin",
    },
    {
      title: "Màu sắc",
      key: "colors",
      dataIndex: "colors",
      width: "25%",
      render: (_, record) => (
        <ul className="list-disc pl-5">
          {Array.isArray(record?.colors) && record.colors.length > 0 ? (
            record.colors.map((color, index) => (
              <li key={index} style={{ color: color?.colorCode || "#000000" }}>
                {color?.colorName || "Không tên"}: {color?.percentage || 0}%
              </li>
            ))
          ) : (
            <li>Không có dữ liệu màu sắc</li>
          )}
        </ul>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: "15%",
      render: (_, record) => (
        <Space size="middle">
          <CustomButton
            type="primary"
            size="small"
            onClick={() => handleOpenEditModal(record)}
          >
            Chỉnh sửa
          </CustomButton>
          <CustomButton
            type="text"
            danger
            size="small"
            icon={<Trash2 size={16} />}
            onClick={() => {
              Modal.confirm({
                title: "Xác nhận xóa",
                content: "Bạn có chắc chắn muốn xóa cá Koi này không?",
                okText: "Có",
                cancelText: "Không",
                onOk: () => handleDelete(record.id),
              });
            }}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Quản lý cá Koi"
        description="Quản lý thông tin và danh sách các loại cá Koi"
      />

      {/* Main Content */}
      <div className="p-6">
        <div className="flex flex-wrap justify-between items-center mb-4">
          <div className="flex gap-2 mb-4">
            <CustomButton type="primary" onClick={handleOpenCreateModal}>
              Tạo mới loài cá Koi
            </CustomButton>
            <CustomButton onClick={handleOpenColorModal}>
              Quản lý màu sắc
            </CustomButton>
          </div>
          <SearchBar
            placeholder="Tìm kiếm theo giống cá..."
            onSearch={handleSearch}
            className="w-64"
          />
        </div>

        {error && <Error message={error} />}

        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{
            current: currentPage,
            total: filteredData.length,
            pageSize: pageSize,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} cá Koi`,
            onChange: (page, pageSize) => {
              setCurrentPage(page);
              setPageSize(pageSize);
            },
          }}
          rowKey="id"
          bordered
          loading={loading}
        />
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
            loading={modalLoading}
          />

          <div className="flex justify-end gap-3 mt-6">
            <CustomButton onClick={handleCloseModal}>Hủy bỏ</CustomButton>
            <CustomButton
              type="primary"
              onClick={handleSave}
              loading={modalLoading}
            >
              {selectedKoi ? "Cập nhật" : "Tạo mới"}
            </CustomButton>
          </div>
        </div>
      </Modal>

      {/* Modal for Color Management */}
      <Modal
        title="Quản lý màu sắc"
        open={isColorModalOpen}
        onCancel={handleCloseColorModal}
        footer={null}
        width={700}
        className="koi-fish-modal"
      >
        <div className="p-4">
          <Form form={colorForm} layout="vertical" disabled={colorLoading}>
            <Form.Item
              name="colorID"
              label="Tên màu"
              rules={[{ required: true, message: "Vui lòng nhập tên màu" }]}
            >
              <Input placeholder="Nhập tên màu (ví dụ: Đỏ, Vàng, ...)" />
            </Form.Item>

            <Divider orientation="left">Điểm số cho từng mệnh</Divider>

            {["Hỏa", "Thủy", "Mộc", "Kim", "Thổ"].map((element) => (
              <Form.Item
                key={element}
                name={["elementPoints", element]}
                label={element}
                rules={[{ required: true, message: "Vui lòng chọn điểm" }]}
              >
                <Select placeholder="Chọn điểm">
                  <Option value="0.25">0.25</Option>
                  <Option value="0.5">0.5</Option>
                  <Option value="0.75">0.75</Option>
                  <Option value="1">1</Option>
                </Select>
              </Form.Item>
            ))}
          </Form>

          <div className="flex justify-end gap-3 mt-6">
            <CustomButton onClick={handleCloseColorModal}>Hủy bỏ</CustomButton>
            <CustomButton
              type="primary"
              onClick={handleAddColor}
              loading={colorLoading}
            >
              Thêm màu mới
            </CustomButton>
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
