import { useState } from "react";
import { Tree, Button, Modal, message } from "antd";
import CategoryForm from "../../components/admin/categories/CategoryForm";
import CategoryTree from "../../components/admin/categories/CategoryTree";
import Header from "../../components/Common/Header";

const CategoryManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setIsModalVisible(true);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setIsModalVisible(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      // Call API to delete category
      message.success("Xóa danh mục thành công");
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa danh mục");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Quản lý danh mục" 
        description="Quản lý các danh mục trong hệ thống"
      />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <Button type="primary" onClick={handleAddCategory}>
            Thêm danh mục mới
          </Button>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <CategoryTree
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
          />
        </div>

        <Modal
          title={selectedCategory ? "Sửa danh mục" : "Thêm danh mục mới"}
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            setSelectedCategory(null);
          }}
          footer={null}
        >
          <CategoryForm
            initialData={selectedCategory}
            onSubmit={(data) => {
              // Handle form submission
              setIsModalVisible(false);
              setSelectedCategory(null);
            }}
          />
        </Modal>
      </div>
    </div>
  );
};

export default CategoryManagement;
