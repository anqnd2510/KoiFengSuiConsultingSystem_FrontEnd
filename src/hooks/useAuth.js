import { logout } from "../services/auth.service";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

// Trong component có chức năng đăng xuất
const navigate = useNavigate();

const handleLogout = async () => {
  try {
    await logout();
    message.success("Đăng xuất thành công!");
    navigate("/login");
  } catch (error) {
    message.error(
      "Đã xảy ra lỗi khi đăng xuất, nhưng bạn đã được đăng xuất khỏi hệ thống"
    );
    navigate("/login");
  }
};
