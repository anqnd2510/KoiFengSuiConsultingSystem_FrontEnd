import React, { useState, useRef, useEffect } from "react";
import { UploadCloud } from "lucide-react";

const CreateCourseModal = ({ isOpen, onClose, onSave }) => {
  const [courseData, setCourseData] = useState({
    courseName: "",
    courseCategory: "",
    description: "",
    price: "",
    imageFile: null,
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const modalRef = useRef(null);

  // Xử lý sự kiện click bên ngoài modal
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData({
      ...courseData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCourseData({
        ...courseData,
        imageFile: file,
      });

      // Tạo URL xem trước cho hình ảnh
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto">
      <div
        ref={modalRef}
        className="bg-white rounded-lg p-6 w-full max-w-md my-4 shadow-xl"
      >
        <h2 className="text-xl font-bold mb-4">Create new courses</h2>

        <div className="max-h-[70vh] overflow-y-auto pr-2">
          <div className="mb-3">
            <label className="block mb-1">Course Name</label>
            <input
              type="text"
              name="courseName"
              value={courseData.courseName}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1">Course Category</label>
            <input
              type="text"
              name="courseCategory"
              value={courseData.categoryId}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1">Description</label>
            <input
              type="text"
              name="description"
              value={courseData.description}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1">Price</label>
            <input
              type="number"
              name="price"
              value={courseData.price}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1">Image</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {previewUrl ? (
                  <div className="mb-3">
                    <img
                      src={previewUrl}
                      alt="Tải lên"
                      className="mx-auto h-32 w-auto object-cover rounded"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center mb-3">
                    <UploadCloud className="h-10 w-10 text-gray-400" />
                  </div>
                )}
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="image-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="image-upload"
                      name="image-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-3 border-t mt-2">
          <button
            onClick={() => onSave(courseData)}
            className="bg-white border rounded-md px-4 py-2"
          >
            Add
          </button>
          <button
            onClick={onClose}
            className="bg-white border rounded-md px-4 py-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCourseModal;
