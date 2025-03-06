import { useState } from "react";
import { Search, BookmarkPlus, Trash2 } from "lucide-react";
import Sidebar from "../components/Layout/Sidebar";
import { useNavigate } from "react-router-dom";
import CustomTable from "../components/Common/CustomTable";
import Pagination from "../components/Common/Pagination";
import Header from "../components/Common/Header";
import Error from "../components/Common/Error";
import CustomButton from "../components/Common/CustomButton";
import { Modal, Form, Input, DatePicker, message } from "antd";
import dayjs from "dayjs";

const BlogManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("Đã xảy ra lỗi");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [blogs, setBlogs] = useState([
    {
      id: "BL001",
      title: "Cách bố trí hồ Koi theo phong thủy",
      uploadedDate: "2024-03-15",
      content: "Nội dung bài viết về cách bố trí hồ Koi theo phong thủy...",
    },
    {
      id: "BL002",
      title: "Cách bố trí hồ Koi theo phong thủy",
      uploadedDate: "2024-03-15",
    },
    {
      id: "BL003",
      title: "Cách bố trí hồ Koi theo phong thủy",
      uploadedDate: "2024-03-15",
    },
    {
      id: "BL004",
      title: "Cách bố trí hồ Koi theo phong thủy",
      uploadedDate: "2024-03-15",
    },
    {
      id: "BL005",
      title: "Cách bố trí hồ Koi theo phong thủy",
      uploadedDate: "2024-03-15",
    },
    {
      id: "BL006",
      title: "Cách bố trí hồ Koi theo phong thủy",
      uploadedDate: "2024-03-15",
    },
  ]);
  const [form] = Form.useForm();

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleViewBlog = (blog) => {
    setSelectedBlog(blog);
    setViewModalVisible(true);
  };

  const handleUpdateBlog = (blog) => {
    setSelectedBlog(blog);
    
    // Chuyển đổi chuỗi ngày thành đối tượng dayjs
    const formattedDate = blog.uploadedDate ? dayjs(blog.uploadedDate) : null;
    
    form.setFieldsValue({
      id: blog.id,
      title: blog.title,
      uploadedDate: formattedDate,
      content: blog.content,
    });
    
    setUpdateModalVisible(true);
  };

  const handleUpdateSubmit = () => {
    form.validateFields()
      .then(values => {
        // Chuyển đổi ngày từ dayjs về chuỗi ngày
        const formattedDate = values.uploadedDate ? 
          values.uploadedDate.format('YYYY-MM-DD') : '';
          
        // Tạo đối tượng bài viết cập nhật
        const updatedBlog = {
          ...selectedBlog,
          title: values.title,
          uploadedDate: formattedDate,
          content: values.content,
        };
        
        // Cập nhật mảng blogs
        const updatedBlogs = blogs.map(blog => 
          blog.id === updatedBlog.id ? updatedBlog : blog
        );
        
        setBlogs(updatedBlogs);
        setUpdateModalVisible(false);
        message.success('Cập nhật bài viết thành công!');
      })
      .catch(error => {
        console.error("Lỗi khi cập nhật bài viết:", error);
        message.error('Đã xảy ra lỗi khi cập nhật bài viết!');
      });
  };

  const columns = [
    {
      title: "Mã bài viết",
      dataIndex: "id",
      key: "id",
      width: "15%",
    },
    {
      title: "Tiêu đề bài viết",
      dataIndex: "title",
      key: "title",
      width: "50%",
    },
    {
      title: "Ngày đăng",
      dataIndex: "uploadedDate",
      key: "uploadedDate",
      width: "15%",
    },
    {
      title: "Thao tác",
      key: "action",
      width: "20%",
      render: (_, record) => (
        <div className="space-x-2">
          <CustomButton 
            type="primary" 
            className="bg-[#4CAF50]"
            onClick={() => handleViewBlog(record)}
          >
            Xem
          </CustomButton>
          <CustomButton 
            type="default"
            onClick={() => handleUpdateBlog(record)}
          >
            Cập nhật
          </CustomButton>
          <CustomButton type="text" danger icon={<Trash2 size={16} />}>
          </CustomButton>
        </div>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header 
          title="Quản lý bài viết"
          description="Báo cáo và tổng quan về các bài viết"
        />

        <main className="p-6">
          <div className="flex justify-between mb-6">
            <CustomButton
              className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50"
              onClick={() => navigate("/create-blog")}
              icon={<BookmarkPlus className="w-5 h-5" />}
            >
              Thêm bài viết mới
            </CustomButton>

            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm nội dung..."
                className="pl-4 pr-10 py-2 border rounded-lg w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          {error && <Error message={error} />}

          <CustomTable
            columns={columns}
            dataSource={blogs}
            loading={loading}
          />

          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={5}
              onPageChange={handlePageChange}
            />
          </div>

          {/* Modal Xem chi tiết bài viết */}
          <Modal
            title={<div className="text-xl font-semibold">Chi tiết bài viết</div>}
            open={viewModalVisible}
            onCancel={() => setViewModalVisible(false)}
            footer={[
              <CustomButton key="close" onClick={() => setViewModalVisible(false)}>
                Đóng
              </CustomButton>
            ]}
            width={700}
            className="blog-modal"
          >
            {selectedBlog && (
              <div className="p-4">
                <h2 className="text-xl font-bold mb-4">{selectedBlog.title}</h2>
                <p className="text-gray-500 mb-4">Mã bài viết: {selectedBlog.id}</p>
                <p className="text-gray-500 mb-6">Ngày đăng: {selectedBlog.uploadedDate}</p>
                <div className="border-t pt-4">
                  <p>{selectedBlog.content}</p>
                </div>
              </div>
            )}
          </Modal>

          {/* Modal Cập nhật bài viết */}
          <Modal
            title={<div className="text-xl font-semibold">Cập nhật bài viết</div>}
            open={updateModalVisible}
            onCancel={() => setUpdateModalVisible(false)}
            footer={[
              <CustomButton key="cancel" onClick={() => setUpdateModalVisible(false)}>
                Hủy bỏ
              </CustomButton>,
              <CustomButton key="submit" type="primary" onClick={handleUpdateSubmit}>
                Cập nhật
              </CustomButton>
            ]}
            width={700}
            className="blog-modal"
          >
            <div className="p-4">
              <Form
                form={form}
                layout="vertical"
              >
                <Form.Item
                  label="Mã bài viết"
                  name="id"
                >
                  <Input disabled />
                </Form.Item>

                <Form.Item
                  label="Tiêu đề bài viết"
                  name="title"
                  rules={[{ required: true, message: "Vui lòng nhập tiêu đề bài viết" }]}
                >
                  <Input placeholder="Nhập tiêu đề bài viết" />
                </Form.Item>

                <Form.Item
                  label="Ngày đăng"
                  name="uploadedDate"
                  rules={[{ required: true, message: "Vui lòng chọn ngày đăng" }]}
                >
                  <DatePicker className="w-full" />
                </Form.Item>

                <Form.Item
                  label="Nội dung"
                  name="content"
                  rules={[{ required: true, message: "Vui lòng nhập nội dung bài viết" }]}
                >
                  <Input.TextArea rows={6} placeholder="Nhập nội dung bài viết" />
                </Form.Item>
              </Form>
            </div>
          </Modal>

          <style jsx global>{`
            .blog-modal .ant-modal-content {
              border-radius: 12px;
              overflow: hidden;
            }
            .blog-modal .ant-modal-header {
              border-bottom: 1px solid #f0f0f0;
              padding: 16px 24px;
            }
            .blog-modal .ant-modal-body {
              padding: 12px;
            }
            .blog-modal .ant-modal-footer {
              border-top: 1px solid #f0f0f0;
            }
          `}</style>
        </main>
      </div>
    </div>
  );
};

export default BlogManagement;
