import React, { useState, useEffect } from "react";
import { Avatar, Badge, Dropdown } from "antd";
import {
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { getCurrentUser } from "../../services/auth.service";

const Header = () => {
  // Khởi tạo với giá trị từ localStorage hoặc giá trị mặc định
  const initialUserName = localStorage.getItem("userName") || "Tài khoản";
  const [displayName, setDisplayName] = useState(initialUserName);

  useEffect(() => {
    // Hàm lấy thông tin người dùng từ API
    async function fetchUserInfo() {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      try {
        const userData = await getCurrentUser();
        if (userData && userData.fullName) {
          setDisplayName(userData.fullName);
          localStorage.setItem("userName", userData.fullName);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    }

    fetchUserInfo();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userName");
    window.location.href = "/login";
  };

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  return (
    <header className="bg-white shadow-sm h-16 flex items-center justify-end px-6">
      {/* Notifications */}
      <Badge count={5} className="mr-4">
        <BellOutlined
          style={{ fontSize: "20px" }}
          className="cursor-pointer text-gray-600"
        />
      </Badge>

      {/* User Profile */}
      <Dropdown
        menu={{ items: userMenuItems }}
        placement="bottomRight"
        trigger={["click"]}
      >
        <div className="flex items-center cursor-pointer">
          <Avatar size={32} src="/avatar.png" />
          <span className="ml-2 text-gray-700">{displayName}</span>
        </div>
      </Dropdown>
    </header>
  );
};

export default Header;
