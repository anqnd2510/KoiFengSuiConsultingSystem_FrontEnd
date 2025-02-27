import React, { useRef, useEffect } from "react";

const ViewCourseModal = ({ isOpen, onClose, course }) => {
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

  if (!isOpen || !course) return null;

  // Format date to display in the header
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg p-6 w-full max-w-md my-4 shadow-xl"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">View detail courses</h2>
          <span className="text-sm text-gray-600">{formatDate(course.createdAt)}</span>
        </div>
        
        <div className="max-h-[70vh] overflow-y-auto pr-2">
          <div className="mb-3">
            <label className="block mb-1">Courses Name</label>
            <input
              type="text"
              value={course.name || ""}
              readOnly
              className="w-full border rounded-md p-2 bg-gray-50"
            />
          </div>
          
          <div className="mb-3">
            <label className="block mb-1">What will you learn</label>
            <input
              type="text"
              value={course.learningObjectives || ""}
              readOnly
              className="w-full border rounded-md p-2 bg-gray-50"
            />
          </div>
          
          <div className="mb-3">
            <label className="block mb-1">Description</label>
            <input
              type="text"
              value={course.description || ""}
              readOnly
              className="w-full border rounded-md p-2 bg-gray-50"
            />
          </div>
          
          <div className="mb-3">
            <label className="block mb-1">Video</label>
            <input
              type="text"
              value={course.videoUrl || ""}
              readOnly
              className="w-full border rounded-md p-2 bg-gray-50"
            />
          </div>
          
          <div className="mb-3">
            <label className="block mb-1">Price</label>
            <input
              type="text"
              value={course.price || ""}
              readOnly
              className="w-full border rounded-md p-2 bg-gray-50"
            />
          </div>
          
          <div className="mb-5">
            <label className="block mb-1">Image</label>
            <input
              type="text"
              value={course.image || ""}
              readOnly
              className="w-full border rounded-md p-2 bg-gray-50"
            />
          </div>
        </div>
        
        <div className="flex justify-center space-x-4 pt-3 border-t mt-2">
          <button 
            onClick={() => {
              // Implement edit functionality
              onClose();
            }}
            className="bg-white border rounded-md px-4 py-2"
          >
            Edit
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

export default ViewCourseModal; 