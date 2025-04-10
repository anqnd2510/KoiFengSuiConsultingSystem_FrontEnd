import React, { useState, useEffect } from "react";
import Header from "../../components/Common/Header";
import SearchBar from "../../components/Common/SearchBar";
import CustomTable from "../../components/Common/CustomTable";
import CustomButton from "../../components/Common/CustomButton";
import Pagination from "../../components/Common/Pagination";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  Tag,
  message,
  Modal,
  Descriptions,
  Spin,
  Form,
  Input,
  Upload,
  Switch,
} from "antd";
import { UploadCloud } from "lucide-react";
import {
  getAllCategories,
  createCategory,
  getCategoryById,
  updateCategoryStatus,
  updateCategory,
} from "../../services/category.service";
import BackButton from "../../components/Common/BackButton";

const Category = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllCategories();

      if (response && response.isSuccess) {
        const mappedCategories = response.data.map((category) => ({
          key: category.categoryId,
          id: category.categoryId,
          name: category.categoryName,
          image: category.image || null,
          status: category.status || "Active", // Mặc định là Active nếu không có trạng thái
        }));
        setCategories(mappedCategories);
      } else {
        throw new Error(
          response?.message || "Không thể tải danh sách loại khóa học"
        );
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách loại khóa học:", err);
      setError("Không thể tải danh sách loại khóa học. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const categoryData = {
        categoryName: values.categoryName.trim(),
      };

      // Xử lý hình ảnh nếu có - chuyển sang gửi file thay vì base64
      if (values.image && values.image.length > 0) {
        const imageFile = values.image[0].originFileObj;
        categoryData.imageFile = imageFile; // Lưu trực tiếp file để gửi FormData
      }

      const response = await createCategory(categoryData);

      if (response && response.isSuccess) {
        message.success("Tạo loại khóa học mới thành công!");
        setIsCreateModalOpen(false);
        form.resetFields();
        fetchCategories();
      } else {
        throw new Error(response?.message || "Không thể tạo loại khóa học");
      }
    } catch (error) {
      console.error("Lỗi khi tạo loại khóa học:", error);
      message.error(error.message || "Có lỗi xảy ra khi tạo loại khóa học");
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (id) => {
    try {
      setLoading(true);
      const response = await getCategoryById(id);

      if (response && response.isSuccess) {
        setSelectedCategory(response.data);
        setIsViewModalOpen(true);
      } else {
        message.error("Không thể tải thông tin loại khóa học");
      }
    } catch (error) {
      console.error("Lỗi khi tải thông tin loại khóa học:", error);
      message.error("Có lỗi xảy ra khi tải thông tin loại khóa học");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      setLoading(true);
      const response = await getCategoryById(id);

      if (response && response.isSuccess) {
        setSelectedCategory(response.data);

        // Set giá trị cho form từ dữ liệu hiện tại
        form.setFieldsValue({
          categoryName: response.data.categoryName,
          // Không set image, người dùng sẽ chọn lại nếu muốn thay đổi
        });

        setIsEditModalOpen(true);
      } else {
        message.error("Không thể tải thông tin loại khóa học");
      }
    } catch (error) {
      console.error("Lỗi khi tải thông tin loại khóa học:", error);
      message.error("Có lỗi xảy ra khi tải thông tin loại khóa học");
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý thay đổi trạng thái category
  const handleStatusChange = (categoryId, checked) => {
    // Hiển thị modal xác nhận trước khi thay đổi
    Modal.confirm({
      title: "Xác nhận thay đổi",
      content: "Bạn chắc chắn muốn đổi trạng thái?",
      okText: "Đồng ý",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const newStatus = checked ? "Active" : "Inactive";

          // Gọi API cập nhật trạng thái
          const response = await updateCategoryStatus(categoryId, newStatus);

          if (response && response.isSuccess) {
            message.success("Cập nhật trạng thái thành công!");

            // Cập nhật state local
            setCategories((prevCategories) =>
              prevCategories.map((category) =>
                category.id === categoryId
                  ? { ...category, status: newStatus }
                  : category
              )
            );
          } else {
            message.error(response?.message || "Không thể cập nhật trạng thái");
            // Nếu thất bại, đặt lại trạng thái switch
            setTimeout(() => {
              setCategories((prevCategories) => [...prevCategories]);
            }, 0);
          }
        } catch (error) {
          console.error("Lỗi khi cập nhật trạng thái:", error);
          message.error("Có lỗi xảy ra khi cập nhật trạng thái");
          // Nếu có lỗi, đặt lại trạng thái switch
          setTimeout(() => {
            setCategories((prevCategories) => [...prevCategories]);
          }, 0);
        }
      },
      onCancel() {
        // Nếu người dùng hủy, đặt lại trạng thái switch
        setTimeout(() => {
          setCategories((prevCategories) => [...prevCategories]);
        }, 0);
      },
    });
  };

  const handleEditCategory = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // Lấy ID từ selectedCategory
      if (!selectedCategory || !selectedCategory.categoryId) {
        throw new Error(
          "Thiếu ID danh mục. Vui lòng tải lại trang và thử lại."
        );
      }

      console.log("Cập nhật danh mục với ID:", selectedCategory.categoryId);

      const categoryData = {
        categoryName: values.categoryName.trim(),
      };

      // Xử lý hình ảnh nếu có - chuyển sang gửi file thay vì base64
      if (values.image && values.image.length > 0) {
        const imageFile = values.image[0].originFileObj;
        categoryData.imageFile = imageFile; // Lưu trực tiếp file để gửi FormData
      }

      // Dùng selectedCategory.categoryId thay vì selectedCategory.id
      const response = await updateCategory(
        selectedCategory.categoryId,
        categoryData
      );

      if (response && response.isSuccess) {
        message.success("Cập nhật loại khóa học thành công!");
        setIsEditModalOpen(false);
        form.resetFields();
        fetchCategories();
      } else {
        throw new Error(
          response?.message || "Không thể cập nhật loại khóa học"
        );
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật loại khóa học:", error);
      message.error(
        error.message || "Có lỗi xảy ra khi cập nhật loại khóa học"
      );
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Mã loại khóa học",
      dataIndex: "id",
      key: "id",
      width: "25%",
    },
    {
      title: "Tên loại khóa học",
      dataIndex: "name",
      key: "name",
      width: "35%",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "20%",
      render: (status, record) => {
        const isActive = status === "Active";

        return (
          <Switch
            checked={isActive}
            onChange={(checked) => handleStatusChange(record.id, checked)}
          />
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      width: "20%",
      render: (_, record) => (
        <div className="flex gap-2">
          <CustomButton
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleView(record.id)}
          >
            Xem
          </CustomButton>
          <CustomButton
            type="default"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.id)}
          >
            Sửa
          </CustomButton>
        </div>
      ),
    },
  ];

  const handleSearch = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-0">
      <Header
        title="Quản lý loại khóa học"
        description="Xem và quản lý các loại khóa học trong hệ thống"
      />

      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between mb-6">
          <div className="flex items-center gap-4">
            <BackButton />
            <CustomButton
              type="primary"
              onClick={() => setIsCreateModalOpen(true)}
            >
              Thêm loại khóa học mới
            </CustomButton>
          </div>
          <div className="w-72">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>

        {error && (
          <div className="mb-4 text-red-500 bg-red-50 p-4 rounded">{error}</div>
        )}

        <CustomTable
          columns={columns}
          dataSource={filteredCategories}
          loading={loading}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredCategories.length / 10)}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Modal tạo loại khóa học mới */}
      <Modal
        title="Tạo loại khóa học mới"
        open={isCreateModalOpen}
        onCancel={() => {
          setIsCreateModalOpen(false);
          form.resetFields();
        }}
        footer={[
          <CustomButton
            key="cancel"
            onClick={() => {
              setIsCreateModalOpen(false);
              form.resetFields();
            }}
          >
            Hủy
          </CustomButton>,
          <CustomButton
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleCreateCategory}
          >
            Tạo mới
          </CustomButton>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="categoryName"
            label="Tên loại khóa học"
            rules={[
              { required: true, message: "Vui lòng nhập tên loại khóa học" },
              {
                whitespace: true,
                message: "Tên không được chỉ chứa khoảng trắng",
              },
              { min: 2, message: "Tên phải có ít nhất 2 ký tự" },
            ]}
          >
            <Input placeholder="Nhập tên loại khóa học" />
          </Form.Item>

          <Form.Item
            name="image"
            label="Hình ảnh"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) return e;
              return e?.fileList;
            }}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false}
              accept="image/*"
            >
              <div className="flex flex-col items-center">
                <UploadCloud className="w-6 h-6 text-gray-400" />
                <div className="mt-2">Tải lên</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal xem chi tiết */}
      <Modal
        title="Chi tiết loại khóa học"
        open={isViewModalOpen}
        onCancel={() => {
          setIsViewModalOpen(false);
          setSelectedCategory(null);
        }}
        footer={[
          <CustomButton
            key="close"
            onClick={() => {
              setIsViewModalOpen(false);
              setSelectedCategory(null);
            }}
          >
            Đóng
          </CustomButton>,
        ]}
      >
        {selectedCategory && (
          <Descriptions column={1}>
            <Descriptions.Item label="Mã loại khóa học">
              {selectedCategory.categoryId}
            </Descriptions.Item>
            <Descriptions.Item label="Tên loại khóa học">
              {selectedCategory.categoryName}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag
                color={selectedCategory.status === "Active" ? "green" : "red"}
              >
                {selectedCategory.status === "Active"
                  ? "Hoạt động"
                  : "Không hoạt động"}
              </Tag>
            </Descriptions.Item>
            {selectedCategory.image && (
              <Descriptions.Item label="Hình ảnh">
                <img
                  src={selectedCategory.image}
                  alt={selectedCategory.categoryName}
                  className="max-w-full h-auto rounded"
                  style={{ maxHeight: "200px" }}
                />
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>

      {/* Modal chỉnh sửa loại khóa học */}
      <Modal
        title="Chỉnh sửa loại khóa học"
        open={isEditModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false);
          form.resetFields();
        }}
        footer={[
          <CustomButton
            key="cancel"
            onClick={() => {
              setIsEditModalOpen(false);
              form.resetFields();
            }}
          >
            Hủy
          </CustomButton>,
          <CustomButton
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleEditCategory}
          >
            Cập nhật
          </CustomButton>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="categoryName"
            label="Tên loại khóa học"
            rules={[
              { required: true, message: "Vui lòng nhập tên loại khóa học" },
              {
                whitespace: true,
                message: "Tên không được chỉ chứa khoảng trắng",
              },
              { min: 2, message: "Tên phải có ít nhất 2 ký tự" },
            ]}
          >
            <Input placeholder="Nhập tên loại khóa học" />
          </Form.Item>

          <Form.Item
            name="image"
            label="Hình ảnh mới (không bắt buộc)"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) return e;
              return e?.fileList;
            }}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false}
              accept="image/*"
            >
              <div className="flex flex-col items-center">
                <UploadCloud className="w-6 h-6 text-gray-400" />
                <div className="mt-2">Tải lên</div>
              </div>
            </Upload>
          </Form.Item>

          {selectedCategory && selectedCategory.image && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Hình ảnh hiện tại:</p>
              <img
                src={selectedCategory.image}
                alt={selectedCategory.categoryName}
                className="max-w-full h-auto rounded"
                style={{ maxHeight: "100px" }}
              />
            </div>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default Category;
