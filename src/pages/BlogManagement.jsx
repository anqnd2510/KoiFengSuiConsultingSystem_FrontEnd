import { useState } from "react";
import { Search, BookmarkPlus } from "lucide-react";
import Sidebar from "../components/Layout/Sidebar";
import { useNavigate } from "react-router-dom";

const BlogManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("An error occurred while loading data");

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

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <header className="bg-[#B4925A] p-6">
          <h1 className="text-2xl font-semibold text-white">
            Quản lý bài viết
          </h1>
          <p className="text-white/80">
            Báo cáo và tổng quan về các bài viết
          </p>
        </header>

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

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-3 text-left font-medium">Mã bài viết</th>
                  <th className="px-6 py-3 text-left font-medium">
                    Tiêu đề bài viết
                  </th>
                  <th className="px-6 py-3 text-left font-medium">
                    Ngày đăng
                  </th>
                  <th className="px-6 py-3 text-center font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr key={blog.id} className="border-t">
                    <td className="px-6 py-4">{blog.id}</td>
                    <td className="px-6 py-4">{blog.title}</td>
                    <td className="px-6 py-4">{blog.uploadedDate}</td>
                    <td className="px-6 py-4 text-center space-x-2">
                      <button className="px-3 py-1 bg-[#4CAF50] text-white rounded hover:bg-[#45a049]">
                        Xem
                      </button>
                      <button className="px-3 py-1 bg-[#FF9800] text-white rounded hover:bg-[#f57c00]">
                        Cập nhật
                      </button>
                      <button className="px-3 py-1 bg-[#f44336] text-white rounded hover:bg-[#e53935]">
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mt-6 gap-2">
            <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
              Trước
            </button>
            {[1, 2, 3, "...", 99].map((page, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded ${
                  page === 1 ? "bg-gray-300" : "bg-gray-200"
                } hover:bg-gray-300`}
              >
                {page}
              </button>
            ))}
            <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
              Sau
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BlogManagement;
