import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RoleBasedRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    console.log("Redirecting based on role:", userRole);

    // Điều hướng dựa trên role
    switch (userRole ? userRole.toLowerCase() : "") {
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
        // Chuyển đến trang Pending nếu không có role cụ thể
        navigate("/pending", { 
          replace: true, 
          state: { 
            message: "Tài khoản của bạn đang chờ xác nhận hoặc chưa được phân quyền. Vui lòng liên hệ quản trị viên để biết thêm chi tiết." 
          } 
        });
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
