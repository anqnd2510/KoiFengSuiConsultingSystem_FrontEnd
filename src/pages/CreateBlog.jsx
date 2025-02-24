import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Layout/Sidebar";

const CreateBlog = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý logic tạo blog ở đây
    console.log("Blog data:", formData);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <header className="bg-[#B4925A] p-6">
          <h1 className="text-2xl font-semibold text-white">
            Workshops Management
          </h1>
          <p className="text-white/80">
            Reports and overview of your workshops
          </p>
        </header>

        <main className="p-6">
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-6">Create new blog</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B4925A]"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Content
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg h-48 focus:outline-none focus:ring-2 focus:ring-[#B4925A]"
                  required
                />
              </div>

              <div className="flex justify-center gap-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#B4925A] text-white rounded-lg hover:bg-[#a38350]"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Revert
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateBlog;
