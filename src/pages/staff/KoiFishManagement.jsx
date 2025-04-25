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
  ColorPicker,
  Tooltip,
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
  const [editForm] = Form.useForm();
  const [modalLoading, setModalLoading] = useState(false);
  const [colorFields, setColorFields] = useState([
    { name: "", value: 0.5, colorCode: "#000000" },
  ]);

  // States cho modal quản lý màu sắc
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [colorForm] = Form.useForm();
  const [colorLoading, setColorLoading] = useState(false);

  // Thêm state cho file ảnh
  const [koiImageFile, setKoiImageFile] = useState(null);
  const [koiImageUrl, setKoiImageUrl] = useState("");

  // Thêm state cho modal xem chi tiết
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [viewKoi, setViewKoi] = useState(null);

  const [data, setData] = useState([]);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [colors, setColors] = useState([]);

  // Thêm hàm fetchColors
  const fetchColors = async () => {
    try {
      setColorLoading(true);
      const response = await KoiFishService.getColors();
      console.log("Phản hồi API lấy danh sách màu:", response);

      if (response && response.isSuccess && Array.isArray(response.data)) {
        setColors(response.data);
      } else {
        console.warn("Không có dữ liệu màu sắc hoặc dữ liệu không hợp lệ");
        setColors([]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách màu:", error);
      message.error("Không thể tải danh sách màu sắc");
    } finally {
      setColorLoading(false);
    }
  };

  // Fetch danh sách cá Koi từ API
  useEffect(() => {
    fetchKoiList();
    fetchColors();
  }, []);

  const fetchKoiList = async () => {
    setLoading(true);
    try {
      const response = await KoiFishService.getAllKoiFish();
      setData(response);
      setError(null);
    } catch (err) {
      if (!err.response || err.response.status !== 404) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Không thể tải danh sách cá Koi";
        setError(errorMessage);
        message.error(errorMessage);
      }
      setData([]);
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

      // Kiểm tra ID trước khi gửi request
      if (!id || id === "unknown-id") {
        message.error("ID cá Koi không hợp lệ");
        return;
      }

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
    setColorFields([{ colorId: "", value: 0.5 }]);
    form.resetFields();
    setIsModalOpen(true);
  };

  // Hàm mở modal để chỉnh sửa
  const handleOpenEditModal = async (koi) => {
    try {
      setModalLoading(true);
      console.log("Chuẩn bị lấy thông tin chi tiết cá Koi ID:", koi.id);

      const koiDetail = await KoiFishService.getKoiFishById(koi.id);
      console.log("Chi tiết cá Koi từ API:", koiDetail);

      if (!koiDetail) {
        message.error("Không thể tải thông tin cá Koi");
        setModalLoading(false);
        return;
      }

      // Đặt URL hình ảnh
      if (koiDetail.imageUrl) {
        setKoiImageUrl(koiDetail.imageUrl);
      }

      // Xử lý dữ liệu màu sắc
      if (Array.isArray(koiDetail.varietyColors) && koiDetail.varietyColors.length > 0) {
        const colors = koiDetail.varietyColors.map((color) => ({
          colorId: color.colorId || "",
          value: (color.percentage || 0) / 100,
          colorName: color.colorName || "",
          element: color.element || "",
        }));
        setColorFields(colors);
      } else {
        setColorFields([{ colorId: "", value: 0.5, colorName: "", element: "" }]);
      }

      // Cập nhật form
      form.setFieldsValue({
        breed: koiDetail.varietyName,
        description: koiDetail.description,
        introduction: koiDetail.introduction || koiDetail.description,
      });

      // Log để kiểm tra
      console.log("Form values after setting:", form.getFieldsValue());
      console.log("Color fields after setting:", colorFields);

      setSelectedKoi(koiDetail);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Lỗi khi tải thông tin cá Koi:", err);
      message.error("Không thể tải thông tin cá Koi");
    } finally {
      setModalLoading(false);
    }
  };

  // Đóng modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedKoi(null);
    form.resetFields();
    editForm.resetFields(); // Reset cả editForm
  };

  // Thêm hàm xử lý khi chọn file ảnh
  const handleImageChange = ({ fileList }) => {
    console.log("Image change:", fileList);
    if (fileList.length > 0) {
      setKoiImageFile(fileList[0].originFileObj);

      // Hiển thị preview ảnh
      if (fileList[0].originFileObj) {
        const url = URL.createObjectURL(fileList[0].originFileObj);
        setKoiImageUrl(url);
      }
    } else {
      setKoiImageFile(null);
      setKoiImageUrl("");
    }
  };

  // Thêm hàm kiểm tra tổng phần trăm
  const calculateTotalPercentage = (colors) => {
    return colors.reduce((sum, color) => sum + (color.value || 0) * 100, 0);
  };

  // Sửa lại hàm handleSave
  const handleSave = async () => {
    try {
      // Validate form
      const values = await form.validateFields();
      console.log("Form values:", values);

      setModalLoading(true);

      // Kiểm tra các trường bắt buộc
      if (!values.breed?.trim()) {
        message.error("Vui lòng nhập tên cá Koi");
        return;
      }

      // Validate tên giống cá không được chứa số
      const hasNumber = /\d/.test(values.breed);
      if (hasNumber) {
        message.error("Tên cá không được chứa số");
        return;
      }

      if (!values.description?.trim()) {
        message.error("Vui lòng nhập mô tả");
        return;
      }

      // Kiểm tra file ảnh khi tạo mới
      if (!selectedKoi && !koiImageFile) {
        message.error("Vui lòng tải lên hình ảnh cá Koi");
        return;
      }

      // Kiểm tra màu sắc
      if (!colorFields || colorFields.length === 0) {
        message.error("Vui lòng thêm ít nhất một màu sắc");
        return;
      }

      // Kiểm tra tổng phần trăm màu sắc
      const totalPercentage = colorFields.reduce((sum, color) => sum + (color.value || 0) * 100, 0);
      if (Math.abs(totalPercentage - 100) > 0.1) {
        message.error("Tổng tỷ lệ màu sắc phải đạt 100%");
        return;
      }

      let response;
      if (selectedKoi) {
        // Xử lý cập nhật
        const formData = new FormData();

        // Log trước khi append để debug
        console.log("Values being appended:", {
          VarietyName: values.breed.trim(),
          Description: values.description.trim(),
          Introduction: values.introduction?.trim() || values.description.trim()
        });

        // Append các trường dữ liệu cơ bản
        formData.append("VarietyName", values.breed.trim());
        formData.append("Description", values.description.trim());
        formData.append("Introduction", values.introduction?.trim() || values.description.trim());

        // Xử lý file ảnh nếu có
        if (koiImageFile) {
          console.log("Appending image file:", koiImageFile.name);
          formData.append("ImageUrl", koiImageFile);
        }

        // Xử lý màu sắc
        const validColorFields = colorFields
          .filter(color => color.colorId && color.value > 0)
          .map(color => ({
            ColorId: color.colorId,
            Percentage: Math.round(color.value * 100)
          }));

        console.log("Color data being appended:", validColorFields);
        formData.append("VarietyColorsJson", JSON.stringify(validColorFields));

        // Log toàn bộ dữ liệu trong FormData
        console.log("FormData entries:");
        for (let pair of formData.entries()) {
          console.log(pair[0] + ": " + (pair[1] instanceof File ? pair[1].name : pair[1]));
        }

        // Gửi request cập nhật
        response = await KoiFishService.updateKoiFish(selectedKoi.id, formData);
      } else {
        // Xử lý tạo mới
        const formData = new FormData();
        formData.append("VarietyName", values.breed.trim());
        formData.append("Description", values.description.trim());
        formData.append("Introduction", values.introduction?.trim() || values.description.trim());

        if (koiImageFile) {
          formData.append("ImageFile", koiImageFile);
        }

        const validColorFields = colorFields
          .filter(color => color.colorId && color.value > 0)
          .map(color => ({
            ColorId: color.colorId,
            Percentage: Math.round(color.value * 100)
          }));

        formData.append("VarietyColorsJson", JSON.stringify(validColorFields));
        response = await KoiFishService.createKoiFish(formData);
      }

      // Kiểm tra response
      console.log("Server response:", response);

      if (response && response.isSuccess) {
        message.success(selectedKoi ? "Đã cập nhật thành công" : "Đã tạo mới thành công");
        await fetchKoiList();
        handleCloseModal();
        setKoiImageFile(null);
        setKoiImageUrl("");
        form.resetFields();
      } else {
        throw new Error(response?.message || "Có lỗi xảy ra khi lưu dữ liệu");
      }
    } catch (err) {
      console.error("Lỗi khi lưu:", err);
      const errorMessage = err.response?.data?.title || 
                         err.response?.data?.message || 
                         err.response?.data?.errors?.join(", ") || 
                         err.message || 
                         "Đã xảy ra lỗi khi lưu dữ liệu";
      message.error(errorMessage);
    } finally {
      setModalLoading(false);
    }
  };

  // Thêm hàm kiểm tra file ảnh
  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Bạn chỉ có thể tải lên file ảnh!');
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Ảnh phải nhỏ hơn 5MB!');
      return false;
    }
    return true;
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
    setSelectedColor("#000000");
  };

  // Hàm xử lý thêm màu mới
  const handleAddColor = async () => {
    try {
      const values = await colorForm.validateFields();
      setColorLoading(true);

      // Gọi API tạo màu mới
      const response = await KoiFishService.createColor({
        colorName: values.colorName.trim(),
        colorCode: values.colorCode,
        element: Array.isArray(values.element)
          ? values.element.join(", ")
          : values.element,
      });

      if (response && response.isSuccess) {
        message.success("Đã thêm màu mới thành công");
        handleCloseColorModal();
        await fetchColors();
      } else {
        throw new Error(response?.message || "Không thể thêm màu mới");
      }
    } catch (error) {
      console.error("Lỗi khi thêm màu:", error);
      message.error(error.message || "Không thể thêm màu mới");
    } finally {
      setColorLoading(false);
    }
  };

  // Thêm hàm xử lý xem chi tiết
  const handleView = async (koi) => {
    try {
      setLoading(true);
      console.log("Chuẩn bị lấy thông tin chi tiết cá Koi ID:", koi.id);

      // Gọi API để lấy thông tin chi tiết
      const koiDetail = await KoiFishService.getKoiFishById(koi.id);
      console.log("Chi tiết cá Koi từ API:", koiDetail);

      // Cập nhật state với dữ liệu chi tiết
      setViewKoi(koiDetail);
      setIsViewModalVisible(true);
    } catch (err) {
      console.error("Lỗi khi tải thông tin chi tiết cá Koi:", err);
      message.error("Không thể tải thông tin chi tiết cá Koi");
    } finally {
      setLoading(false);
    }
  };

  const handleViewCancel = () => {
    setIsViewModalVisible(false);
    setViewKoi(null);
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
      title: "Mã cá Koi",
      dataIndex: "id",
      key: "id",
      width: "12%",
      render: (text) => (
        <span className="text-xs font-mono">{text || "N/A"}</span>
      ),
    },
    {
      title: "Tên cá Koi",
      dataIndex: "varietyName",
      key: "varietyName",
      width: "15%",
      render: (text) => text || "N/A",
    },
    {
      title: "Thông tin giới thiệu",
      dataIndex: "description",
      key: "description",
      width: "30%",
      ellipsis: true,
      render: (text) => text || "Không có thông tin",
    },
    {
      title: "Màu sắc",
      key: "colors",
      dataIndex: "colors",
      width: "15%",
      render: (_, record) => (
        <ul className="list-none pl-0 space-y-1">
          {!record.varietyColors || record.varietyColors.length === 0 ? (
            <li>• Không có dữ liệu màu sắc</li>
          ) : (
            <>
              {record.varietyColors.map((color, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-1">•</span>
                  <span>
                    {color.colorName || color.color?.colorName || "Không tên"}:{" "}
                    {color.percentage}%
                    <span className="ml-1 text-gray-500">
                      ({color.element || color.color?.element || "Không xác định"})
                    </span>
                  </span>
                </li>
              ))}
              {record.totalPercentage > 0 && (
                <li className="flex items-start font-semibold">
                  <span className="mr-1">•</span>
                  <span>Tổng: {record.totalPercentage}%</span>
                </li>
              )}
            </>
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
            type="default"
            size="small"
            onClick={() => handleView(record)}
          >
            Xem
          </CustomButton>
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
              // Log ra ID trước khi xóa để debug
              console.log("Chuẩn bị xóa cá Koi:", record);

              Modal.confirm({
                title: "Xác nhận xóa",
                content: (
                  <div>
                    <p>Bạn có chắc chắn muốn xóa cá Koi này không?</p>
                    <p className="text-xs mt-2 font-mono text-gray-500">
                      ID: {record.id}
                    </p>
                    <p className="text-xs font-mono text-gray-500">
                      Tên: {record.varietyName}
                    </p>
                  </div>
                ),
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

  // Effect để theo dõi thay đổi của colorFields
  useEffect(() => {
    console.log("colorFields đã được cập nhật:", colorFields);
  }, [colorFields]);

  // Effect để làm việc với dữ liệu modal khi selectedKoi thay đổi
  useEffect(() => {
    if (selectedKoi && isModalOpen) {
      console.log("Cập nhật form với dữ liệu selectedKoi:", selectedKoi);
      
      // Cập nhật form với thông tin hiện tại
      editForm.setFieldsValue({
        breed: selectedKoi.varietyName,
        description: selectedKoi.description,
        introduction: selectedKoi.introduction || selectedKoi.description,
      });

      // Cập nhật URL hình ảnh
      if (selectedKoi.imageUrl) {
        setKoiImageUrl(selectedKoi.imageUrl);
      }

      // Cập nhật dữ liệu màu sắc
      if (Array.isArray(selectedKoi.varietyColors) && selectedKoi.varietyColors.length > 0) {
        const colors = selectedKoi.varietyColors.map((color) => ({
          colorId: color.colorId || "",
          value: (color.percentage || 0) / 100,
          colorName: color.colorName || "",
          element: color.element || "",
        }));
        setColorFields(colors);
      }
    }
  }, [selectedKoi, isModalOpen, editForm]);

  // Thêm nội dung tooltip
  const colorTooltipContent = "Tổng phần trăm màu sắc phải đạt 100%";

  // Hàm chuyển đổi mã màu hex sang tên màu
  const getColorName = (hexColor) => {
    const colors = {
      "#FF0000": "Đỏ",
      "#00FF00": "Xanh lá",
      "#0000FF": "Xanh dương",
      "#FFFF00": "Vàng",
      "#FF00FF": "Hồng",
      "#00FFFF": "Xanh ngọc",
      "#000000": "Đen",
      "#FFFFFF": "Trắng",
      "#FFA500": "Cam",
      "#800080": "Tím",
      "#A52A2A": "Nâu",
      "#808080": "Xám",
    };

    // Tìm màu gần nhất
    let closestColor = "#000000";
    let minDistance = Number.MAX_VALUE;

    const hex2rgb = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return [r, g, b];
    };

    const colorDistance = (rgb1, rgb2) => {
      return Math.sqrt(
        Math.pow(rgb1[0] - rgb2[0], 2) +
          Math.pow(rgb1[1] - rgb2[1], 2) +
          Math.pow(rgb1[2] - rgb2[2], 2)
      );
    };

    const targetRgb = hex2rgb(hexColor);

    Object.keys(colors).forEach((hex) => {
      const distance = colorDistance(targetRgb, hex2rgb(hex));
      if (distance < minDistance) {
        minDistance = distance;
        closestColor = hex;
      }
    });

    return colors[closestColor];
  };

  // Hàm xử lý khi màu thay đổi
  const handleColorChange = (color) => {
    const hexColor = color.toHexString();
    setSelectedColor(hexColor);

    // Tự động cập nhật tên màu trong form
    const colorName = getColorName(hexColor);
    colorForm.setFieldsValue({
      colorName: colorName,
      colorCode: hexColor,
    });
  };

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
            onChange: (page) => {
              setCurrentPage(page);
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
          <Tooltip title={colorTooltipContent}>
            <KoiFishForm
              form={form}
              initialData={selectedKoi}
              colorFields={colorFields}
              setColorFields={setColorFields}
              loading={modalLoading}
              imageUrl={koiImageUrl}
              onImageChange={handleImageChange}
              colors={colors}
              isEditing={!!selectedKoi}
            />
          </Tooltip>

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
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="colorCode"
                  label="Chọn màu"
                  rules={[{ required: true, message: "Vui lòng chọn màu" }]}
                >
                  <ColorPicker
                    value={selectedColor}
                    onChange={handleColorChange}
                    presets={[
                      {
                        label: "Màu phổ biến",
                        colors: [
                          "#FF0000",
                          "#00FF00",
                          "#0000FF",
                          "#FFFF00",
                          "#FF00FF",
                          "#00FFFF",
                          "#000000",
                          "#FFFFFF",
                          "#FFA500",
                          "#800080",
                          "#A52A2A",
                          "#808080",
                        ],
                      },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="colorName"
                  label="Tên màu"
                  rules={[{ required: true, message: "Vui lòng nhập tên màu" }]}
                >
                  <Input placeholder="Tên màu sẽ tự động cập nhật" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="element"
              label="Mệnh"
              rules={[{ required: true, message: "Vui lòng chọn mệnh" }]}
            >
              <Select placeholder="Chọn mệnh" mode="multiple" allowClear>
                <Option value="Hỏa">Hỏa</Option>
                <Option value="Thủy">Thủy</Option>
                <Option value="Mộc">Mộc</Option>
                <Option value="Kim">Kim</Option>
                <Option value="Thổ">Thổ</Option>
              </Select>
            </Form.Item>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-lg shadow-inner"
                  style={{ backgroundColor: selectedColor }}
                />
                <div>
                  <p className="font-medium">Màu đã chọn:</p>
                  <p>Mã màu: {selectedColor}</p>
                  <p>Tên màu: {colorForm.getFieldValue("colorName")}</p>
                  <p>
                    Mệnh:{" "}
                    {Array.isArray(colorForm.getFieldValue("element"))
                      ? colorForm.getFieldValue("element").join(", ")
                      : colorForm.getFieldValue("element") || "Chưa chọn"}
                  </p>
                </div>
              </div>
            </div>
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

      {/* Thêm Modal xem chi tiết cá Koi */}
      <Modal
        title={`Chi tiết cá ${viewKoi?.varietyName || ""}`}
        open={isViewModalVisible}
        onCancel={handleViewCancel}
        footer={[
          <CustomButton key="close" onClick={handleViewCancel}>
            Đóng
          </CustomButton>,
        ]}
        width={700}
      >
        {viewKoi && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              {viewKoi.imageUrl && (
                <img
                  src={viewKoi.imageUrl}
                  alt={viewKoi.varietyName}
                  className="max-h-[300px] w-full object-cover rounded-lg mx-auto shadow-lg"
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg">
              <div className="space-y-2">
                <p className="text-sm text-gray-500 uppercase tracking-wider">
                  ID Cá
                </p>
                <p className="text-base font-medium text-gray-800">
                  {viewKoi.id}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-500 uppercase tracking-wider">
                  Giống cá
                </p>
                <p className="text-base font-medium text-gray-800">
                  {viewKoi.varietyName}
                </p>
              </div>
            </div>

            <div className="space-y-4 bg-white p-6 rounded-lg border border-gray-100">
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">
                  Giới thiệu
                </p>
                <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded">
                  {viewKoi.introduction || viewKoi.description}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">
                  Mô tả chi tiết
                </p>
                <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded">
                  {viewKoi.description}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">
                  Màu sắc
                </p>
                <div className="bg-gray-50 p-4 rounded">
                  {!viewKoi.varietyColors ||
                  viewKoi.varietyColors.length === 0 ? (
                    <p className="text-gray-700">Không có dữ liệu màu sắc</p>
                  ) : (
                    <ul className="space-y-2">
                      {viewKoi.varietyColors.map((color, index) => (
                        <li
                          key={index}
                          className="flex items-center text-gray-700"
                        >
                          <span className="mr-2">•</span>
                          <span>
                            {color.colorName ||
                              color.color?.colorName ||
                              "Không tên"}
                            : {color.percentage}%
                            <span className="ml-2 text-gray-500">
                              (
                              {color.element ||
                                color.color?.element ||
                                "Không xác định"}
                              )
                            </span>
                          </span>
                        </li>
                      ))}
                      {viewKoi.totalPercentage > 0 && (
                        <li className="flex items-center font-medium text-gray-800 mt-2 pt-2 border-t">
                          <span className="mr-2">•</span>
                          <span>Tổng: {viewKoi.totalPercentage}%</span>
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
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
