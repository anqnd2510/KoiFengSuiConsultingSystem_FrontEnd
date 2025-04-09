import React, { useState, useEffect } from "react";
import Header from "../../components/Common/Header";
import SearchBar from "../../components/Common/SearchBar";
import CustomTable from "../../components/Common/CustomTable";
import CustomButton from "../../components/Common/CustomButton";
import Pagination from "../../components/Common/Pagination";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Tag, message, Modal, Descriptions, Spin, Form, Input, Upload } from "antd";
import { UploadCloud } from "lucide-react";
import { getAllCategories, createCategory, getCategoryById } from "../../services/category.service";

const Category = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
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
        const mappedCategories = response.data.map(category => ({
          key: category.categoryId,
          id: category.categoryId,
          name: category.categoryName,
          image: category.image || null
        }));
        setCategories(mappedCategories);
      } else {
        throw new Error(response?.message || "Không thể tải danh sách loại khóa học");
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
        categoryName: values.categoryName.trim()
      };

      // Xử lý hình ảnh nếu có
      if (values.image && values.image.length > 0) {
        const file = values.image[0].originFileObj;
        const reader = new FileReader();
        
        const imageBase64 = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(file);
        });

        categoryData.image = imageBase64;
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

  const handleEdit = (id) => {
    message.info(`Chức năng đang được phát triển`);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa loại khóa học ${id} không?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        message.success(`Đã xóa loại khóa học ${id}`);
      },
    });
  };

  const columns = [
    {
      title: "Mã loại khóa học",
      dataIndex: "id",
      key: "id",
      width: '30%',
    },
    {
      title: "Tên loại khóa học",
      dataIndex: "name",
      key: "name",
      width: '50%',
    },
    {
      title: "Hành động",
      key: "action",
      width: '20%',
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
          <CustomButton
            type="default"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Xóa
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
          <CustomButton
            type="primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Thêm loại khóa học mới
          </CustomButton>
          <div className="w-72">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>

        {error && (
          <div className="mb-4 text-red-500 bg-red-50 p-4 rounded">
            {error}
          </div>
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
          </CustomButton>
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="categoryName"
            label="Tên loại khóa học"
            rules={[
              { required: true, message: "Vui lòng nhập tên loại khóa học" },
              { whitespace: true, message: "Tên không được chỉ chứa khoảng trắng" },
              { min: 2, message: "Tên phải có ít nhất 2 ký tự" }
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
          </CustomButton>
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
            {selectedCategory.image && (
              <Descriptions.Item label="Hình ảnh">
                <img
                  src={selectedCategory.image}
                  alt={selectedCategory.categoryName}
                  className="max-w-full h-auto rounded"
                  style={{ maxHeight: '200px' }}
                />
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default Category;
