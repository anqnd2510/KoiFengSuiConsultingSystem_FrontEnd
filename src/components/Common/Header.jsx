import React from "react";
import PropTypes from "prop-types";
import { Avatar, Dropdown, Button } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";

const Header = ({ title, description, className = "" }) => {
  // Các items trong dropdown menu
  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Hồ sơ",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      danger: true,
    },
  ];

  // Xử lý sự kiện đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
  };

  // Xử lý các sự kiện menu
  const handleMenuClick = (e) => {
    if (e.key === "logout") {
      handleLogout();
    } else if (e.key === "profile") {
      window.location.href = "/profile";
    }
  };

  return (
    <div className={`bg-[#B89D71] p-4 flex justify-between items-center ${className}`}>
      <div>
        <h1 className="text-white text-xl font-semibold">
          {title}
        </h1>
        {description && (
          <p className="text-white/80 text-sm">
            {description}
          </p>
        )}
      </div>

      {/* Phần profile user và logout */}
      <div className="flex items-center">
        <Dropdown
          menu={{ 
            items: userMenuItems,
            onClick: handleMenuClick
          }}
          placement="bottomRight"
          trigger={["click"]}
        >
          <div className="flex items-center cursor-pointer bg-white/10 rounded-full py-1 px-3 hover:bg-white/20 transition-all">
            <Avatar size={32} icon={<UserOutlined />} />
            <span className="ml-2 text-white font-medium hidden md:inline-block">Tài khoản</span>
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  className: PropTypes.string,
};

export default Header; 