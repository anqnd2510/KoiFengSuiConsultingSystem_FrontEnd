import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // Chuyển về trang login nếu chưa đăng nhập
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
