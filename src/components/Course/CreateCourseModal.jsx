import React, { useState, useRef, useEffect } from "react";

const CreateCourseModal = ({ isOpen, onClose, onSave }) => {
  const [courseData, setCourseData] = useState({
    courseName: "",
    courseCategory: "",
    description: "",
    price: ""
  });
  
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
      [name]: value
    });
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