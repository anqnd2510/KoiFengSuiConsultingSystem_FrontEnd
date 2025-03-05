import React, { useState } from "react";
import Sidebar from "../components/Layout/Sidebar";
import Header from "../components/Common/Header";
import {
  BellOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

dayjs.extend(relativeTime);
dayjs.locale("vi");

const mockNotifications = [
  {
    id: 1,
    type: "course",
    title: "Đăng ký khóa học mới",
    message: "Nguyễn Văn A đã đăng ký khóa học Phong Thủy Cơ Bản",
    time: "2024-02-28T10:30:00",
    status: "unread",
    priority: "high",
  },
  {
    id: 2,
    type: "workshop",
    title: "Đăng ký workshop",
    message: "Trần Thị B đã đăng ký tham gia Workshop Phong Thủy Nhà Ở",
    time: "2024-02-28T09:00:00",
    status: "read",
    priority: "medium",
  },
  {
    id: 3,
    type: "blog",
    title: "Bài viết mới",
    message:
      "Admin đã đăng bài viết mới: Cách bố trí phòng khách theo phong thủy",
    time: "2 giờ trước",
    status: "unread",
  },
  {
    id: 4,
    type: "consulting",
    title: "Yêu cầu tư vấn",
    message: "Lê Văn C đã đặt lịch tư vấn phong thủy online",
    time: "1 ngày trước",
    status: "read",
  },
];

const NotificationItem = ({ notification }) => {
  const getTypeConfig = (type) => {
    const configs = {
      course: {
        icon: "fas fa-graduation-cap",
        color: "text-blue-600",
        bg: "bg-blue-50",
        borderColor: "border-blue-200",
      },
      workshop: {
        icon: "fas fa-users",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        borderColor: "border-emerald-200",
      },
      blog: {
        icon: "fas fa-newspaper",
        color: "text-purple-600",
        bg: "bg-purple-50",
        borderColor: "border-purple-200",
      },
      consulting: {
        icon: "fas fa-comments",
        color: "text-amber-600",
        bg: "bg-amber-50",
        borderColor: "border-amber-200",
      },
    };
    return configs[type];
  };

  const config = getTypeConfig(notification.type);

  return (
    <div
      className={`group p-6 transition-all duration-300 hover:bg-gray-50/80 border-l-4 ${
        notification.status === "unread"
          ? "border-l-[#B4925A]"
          : "border-l-transparent"
      }`}
    >
      <div className="flex items-start gap-5">
        <div
          className={`w-12 h-12 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300`}
        >
          <i className={`${config.icon} ${config.color} text-xl`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-gray-900 text-base">
                  {notification.title}
                </h3>
                {notification.status === "unread" && (
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs rounded-full font-medium border border-blue-100">
                    Mới
                  </span>
                )}
                {notification.priority === "high" && (
                  <span className="px-2.5 py-1 bg-red-50 text-red-600 text-xs rounded-full font-medium border border-red-100">
                    Quan trọng
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {notification.message}
              </p>
            </div>
            <div className="flex flex-col items-end gap-3">
              <span className="text-sm text-gray-500 whitespace-nowrap">
                {dayjs(notification.time).fromNow()}
              </span>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <button className="p-2 hover:bg-[#B4925A]/10 rounded-full transition-colors cursor-pointer">
                  <i className="fas fa-check text-[#B4925A]" />
                </button>
                <button className="p-2 hover:bg-[#B4925A]/10 rounded-full transition-colors cursor-pointer">
                  <i className="fas fa-eye text-[#B4925A]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Notifications = () => {
  const [activeTab, setActiveTab] = useState("all");
  const unreadCount = mockNotifications.filter(
    (n) => n.status === "unread"
  ).length;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        <Header
          title="Thông báo"
          description="Theo dõi tất cả các hoạt động từ hệ thống"
        />

        <div className="h-full flex flex-col">
          {/* Filter Section */}
          <div className="bg-white px-8 py-6 border-b border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                {unreadCount > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-[#B4925A]/5 rounded-lg border border-[#B4925A]/20">
                    <div className="relative">
                      <div className="w-2 h-2 rounded-full bg-[#B4925A]" />
                      <div className="absolute inset-0 w-2 h-2 rounded-full bg-[#B4925A] animate-ping" />
                    </div>
                    <span className="text-[#B4925A] font-medium">
                      {unreadCount} thông báo mới
                    </span>
                  </div>
                )}
                <button className="flex items-center gap-2 px-4 py-2.5 text-[#B4925A] hover:bg-[#B4925A]/10 rounded-lg transition-all duration-300 cursor-pointer">
                  <CheckCircleOutlined className="text-base" />
                  <span className="font-medium">Đánh dấu tất cả đã đọc</span>
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-4">
              {[
                { key: "all", label: "Tất cả", icon: <BellOutlined /> },
                {
                  key: "unread",
                  label: "Chưa đọc",
                  icon: <ExclamationCircleOutlined />,
                  count: unreadCount,
                },
                { key: "read", label: "Đã đọc", icon: <CheckCircleOutlined /> },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 cursor-pointer
                    ${
                      activeTab === tab.key
                        ? "bg-[#B4925A] text-white shadow-lg shadow-[#B4925A]/20"
                        : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-[#B4925A]/30"
                    }`}
                >
                  {tab.icon}
                  <span className="font-medium">{tab.label}</span>
                  {tab.count > 0 && (
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${
                        activeTab === tab.key
                          ? "bg-white text-[#B4925A]"
                          : "bg-[#B4925A] text-white"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto px-8 py-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
              {mockNotifications
                .filter(
                  (n) =>
                    activeTab === "all" ||
                    (activeTab === "unread" && n.status === "unread") ||
                    (activeTab === "read" && n.status === "read")
                )
                .map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
