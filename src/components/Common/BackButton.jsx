import React from "react";
import { useNavigate } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";

const BackButton = ({ to = -1, text = "Quay lại" }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (to === -1) {
      navigate(-1);
    } else {
      navigate(to);
    }
  };

  return (
    <button
      onClick={handleBack}
      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-[#B4925A] cursor-pointer transition-all duration-200 rounded-lg hover:bg-[#B4925A]/5 active:bg-[#B4925A]/10"
    >
      <LeftOutlined className="text-lg" />
      <span className="font-medium">{text}</span>
    </button>
  );
};

export default BackButton;
