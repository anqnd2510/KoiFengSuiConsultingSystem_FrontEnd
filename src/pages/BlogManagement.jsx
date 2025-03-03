import { useState } from "react";
import { Search, BookmarkPlus } from "lucide-react";
import { Button } from "antd";
import Sidebar from "../components/Layout/Sidebar";
import { useNavigate } from "react-router-dom";
import CustomTable from "../components/Common/CustomTable";
import Pagination from "../components/Common/Pagination";
import Header from "../components/Common/Header";

const BlogManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("An error occurred while loading data");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const blogs = [
    {
      id: "BL001",
      title: "Cách bố trí hồ Koi theo phong thủy",
      uploadedDate: "2024-03-15",
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
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
      render: () => (
        <div className="space-x-2">
          <Button type="primary" className="bg-[#4CAF50]">
            Xem
          </Button>
          <Button type="primary" className="bg-[#FF9800]">
            Cập nhật
          </Button>
          <Button type="primary" danger>
            Xóa
          </Button>
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
            <button
              className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => navigate("/create-blog")}
            >
              <BookmarkPlus className="w-5 h-5" />
              Thêm bài viết mới
            </button>

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

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm">Đã xảy ra lỗi!</p>
                </div>
              </div>
            </div>
          )}

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
        </main>
      </div>
    </div>
  );
};

export default BlogManagement;
