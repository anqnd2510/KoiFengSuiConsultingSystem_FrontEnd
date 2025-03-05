import { useState } from "react";
import { Search, BookmarkPlus } from "lucide-react";
import Sidebar from "../components/Layout/Sidebar";
import { useNavigate } from "react-router-dom";
import CustomTable from "../components/Common/CustomTable";
import Pagination from "../components/Common/Pagination";
import Header from "../components/Common/Header";
import Error from "../components/Common/Error";
import CustomButton from "../components/Common/CustomButton";

const BlogManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("Đã xảy ra lỗi");
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
          <CustomButton type="primary" className="bg-[#4CAF50]">
            Xem
          </CustomButton>
          <CustomButton type="default">
            Cập nhật
          </CustomButton>
          <CustomButton type="primary" danger>
            Xóa
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
        </main>
      </div>
    </div>
  );
};

export default BlogManagement;
