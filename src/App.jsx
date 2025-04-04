import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout/MainLayout";
import RoleBasedRedirect from "./components/RoleBasedRedirect";
import { mainRoutes } from "./routes/mainRoutes";
import Login from "./pages/Login";
// Import các component khác nếu cần

function App() {
  return (
    <Routes>
      {/* Đường dẫn gốc sẽ điều hướng dựa trên role */}
      <Route path="/" element={<RoleBasedRedirect />} />

      {/* Đường dẫn đăng nhập */}
      <Route path="/login" element={<Login />} />

      {/* Các route chính trong layout */}
      <Route path="/" element={<Layout />}>
        {mainRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <ProtectedRoute roles={route.roles}>
                {route.element}
              </ProtectedRoute>
            }
          />
        ))}
      </Route>

      {/* Route mặc định nếu không tìm thấy */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Component bảo vệ route dựa trên role
const ProtectedRoute = ({ children, roles }) => {
  const userRole = localStorage.getItem("userRole") || "staff";

  if (!roles || roles.includes(userRole)) {
    return children;
  }

  // Nếu không có quyền truy cập, điều hướng về trang mặc định theo role
  return <RoleBasedRedirect />;
};

export default App;
