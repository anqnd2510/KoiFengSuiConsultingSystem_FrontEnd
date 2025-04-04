import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RoleBasedRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    console.log("Redirecting based on role:", userRole);

    // Điều hướng dựa trên role
    switch (userRole ? userRole.toLowerCase() : "staff") {
      case "manager":
        navigate("/manager/dashboard");
        break;
      case "master":
        navigate("/master/schedule");
        break;
      case "staff":
        navigate("/staff/notifications");
        break;
      case "admin":
        navigate("/admin/account-management");
        break;
      default:
        navigate("/staff/notifications");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    // Xóa các thông tin khác nếu cần
    navigate("/login");
  };

  return null;
};

export default RoleBasedRedirect;
