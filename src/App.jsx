import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout/MainLayout";
import RoleBasedRedirect from "./components/RoleBasedRedirect";
import { mainRoutes } from "./routes/mainRoutes";
import { adminRoutes } from "./routes/adminRoutes";
import Login from "./pages/Login";
import Pending from "./pages/Pending";
// Import các component khác nếu cần

function App() {
  // Kiểm tra xem đã có token chưa
  const hasToken = localStorage.getItem("accessToken");

  return (
    <Routes>
      {/* Đường dẫn gốc sẽ chuyển hướng về login nếu chưa có token */}
      <Route
        path="/"
        element={
          hasToken ? <RoleBasedRedirect /> : <Navigate to="/login" replace />
        }
      />

      {/* Đường dẫn đăng nhập */}
      <Route path="/login" element={<Login />} />

      {/* Đường dẫn trang chờ xác nhận tài khoản */}
      <Route path="/pending" element={<Pending />} />

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

        {/* Admin Routes */}
        {adminRoutes.map((route) => (
          <Route
            key={route.path}
            path={`admin/${route.path}`}
            element={
              <ProtectedRoute roles={["admin"]}>{route.element}</ProtectedRoute>
            }
          />
        ))}
      </Route>

      {/* Route mặc định sẽ chuyển về login nếu chưa có token */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

// Component bảo vệ route dựa trên role
const ProtectedRoute = ({ children, roles }) => {
  const userRole = localStorage.getItem("userRole") || "staff";
  const hasToken = localStorage.getItem("accessToken");

  // Nếu chưa có token, chuyển về trang login
  if (!hasToken) {
    return <Navigate to="/login" replace />;
  }

  // Kiểm tra role
  if (!roles || roles.includes(userRole)) {
    return children;
  }

  return <RoleBasedRedirect />;
};

export default App;
