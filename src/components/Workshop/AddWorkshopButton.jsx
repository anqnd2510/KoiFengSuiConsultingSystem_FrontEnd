import React from "react";

const AddWorkshopButton = ({ onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="flex items-center bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
    >
      <span>Add new workshops</span>
      <span className="ml-2 border border-gray-400 rounded-sm w-5 h-5 flex items-center justify-center text-xs">+</span>
    </button>
  );
};

export default AddWorkshopButton; 