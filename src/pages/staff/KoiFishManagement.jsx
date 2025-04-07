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

  // Thêm state cho file ảnh
  const [koiImageFile, setKoiImageFile] = useState(null);
  const [koiImageUrl, setKoiImageUrl] = useState("");

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

      // In ra mẫu ID của một vài phần tử để kiểm tra
      if (Array.isArray(response) && response.length > 0) {
        console.log("Mẫu ID của cá Koi đầu tiên:", response[0].id);
        console.log("Dữ liệu gốc của cá Koi đầu tiên:", response[0]);
      }

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

      setSelectedKoi(koiDetail);

      // Kiểm tra xem có trường varietyColors không, nếu không thì sử dụng mảng rỗng
      const koiColors = koiDetail.varietyColors || [];
      console.log("Danh sách màu từ API:", koiColors);

      if (koiColors.length === 0) {
        console.log("Không có màu sắc, sử dụng màu mặc định");
        setColorFields([{ colorId: "", value: 0.5 }]);
      } else {
        // Đảm bảo dữ liệu màu sắc đúng định dạng cho form
        const formattedColors = koiColors.map((color) => {
          // Log chi tiết mỗi màu để debug
          console.log("Chi tiết màu từ API:", color);

          // Đảm bảo tất cả các trường cần thiết đều có
          const colorData = {
            colorId: color.colorId || "",
            value: parseFloat((color.percentage || 0) / 100),
            colorName: color.colorName || color.color?.colorName || "",
            element: color.element || color.color?.element || "",
          };

          console.log("Dữ liệu màu đã xử lý:", colorData);
          return colorData;
        });

        console.log("Màu sắc đã định dạng cho form:", formattedColors);
        setColorFields(formattedColors);
      }

      // Reset file và URL ảnh mới
      setKoiImageFile(null);
      setKoiImageUrl("");

      // Nếu có URL hình ảnh hiện tại trong dữ liệu, hiển thị log
      if (koiDetail.imageUrl) {
        console.log("Ảnh hiện tại:", koiDetail.imageUrl);
      }

      // Đặt các giá trị cho form
      form.setFieldsValue({
        breed: koiDetail.varietyName || "",
        description: koiDetail.description || "",
        introduction: koiDetail.introduction || koiDetail.description || "",
      });

      console.log("Form đã được cập nhật với dữ liệu:", {
        breed: koiDetail.varietyName,
        description: koiDetail.description,
        introduction: koiDetail.introduction || koiDetail.description,
      });

      setIsModalOpen(true);
    } catch (err) {
      console.error("Lỗi khi tải thông tin cá Koi:", err);
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

  // Sửa lại hàm handleSave
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setModalLoading(true);

      // Nếu đang tạo mới thì kiểm tra file ảnh
      if (!selectedKoi && !koiImageFile) {
        message.error("Vui lòng tải lên hình ảnh cá Koi");
        setModalLoading(false);
        return;
      }

      // Kết hợp giá trị từ form với danh sách màu sắc
      const formData = {
        varietyName: values.breed,
        description: values.description,
        introduction: values.introduction || values.description,
        varietyColors: colorFields
          .filter((color) => color.colorId) // Chỉ lấy những màu đã chọn
          .map((color) => ({
            colorId: color.colorId,
            percentage: Math.round(color.value * 100),
            colorName: color.colorName || "",
            element: color.element || "",
          })),
        // Thêm file ảnh vào dữ liệu
        imageFile: koiImageFile,
      };

      // Log để debug
      console.log("Dữ liệu màu sắc gửi đi:", formData.varietyColors);

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

      // Reset state hình ảnh
      setKoiImageFile(null);
      setKoiImageUrl("");
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
      title: "Mã cá Koi",
      dataIndex: "id",
      key: "id",
      width: "12%",
      render: (text) => (
        <span className="text-xs font-mono">{text || "N/A"}</span>
      ),
    },
    {
      title: "Giống cá Koi",
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
                      (
                      {color.element ||
                        color.color?.element ||
                        "Không xác định"}
                      )
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
      title: "Điểm tương thích",
      key: "compatibilityScore",
      dataIndex: "compatibilityScore",
      width: "5%",
      render: (score) => <span>{score || 0}</span>,
    },
    {
      title: "Hành động",
      key: "action",
      width: "10%",
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
      // Đặt các giá trị cho form lại một lần nữa để đảm bảo
      form.setFieldsValue({
        breed: selectedKoi.varietyName || "",
        description: selectedKoi.description || "",
        introduction: selectedKoi.introduction || selectedKoi.description || "",
      });
    }
  }, [selectedKoi, isModalOpen, form]);

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
          <KoiFishForm
            form={form}
            initialData={selectedKoi}
            colorFields={colorFields}
            setColorFields={setColorFields}
            loading={modalLoading}
            imageUrl={koiImageUrl}
            onImageChange={handleImageChange}
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
