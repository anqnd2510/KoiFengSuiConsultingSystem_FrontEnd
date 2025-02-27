import React from "react";
import { Avatar, Badge, Dropdown } from "antd";
import {
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const Header = () => {
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
          <span className="ml-2 text-gray-700">nguyenhotantien</span>
        </div>
      </Dropdown>
    </header>
  );
};

export default Header;
