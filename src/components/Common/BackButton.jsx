import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import CustomButton from "./CustomButton";

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
    <CustomButton
      type="default"
      icon={<FaArrowLeft size={14} />}
      onClick={handleBack}
    >
      {text}
    </CustomButton>
  );
};

export default BackButton;
