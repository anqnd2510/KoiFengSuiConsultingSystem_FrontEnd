import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Calendar,
  MessageSquare,
  Users,
  Bell,
  ClipboardList,
  History,
  Newspaper,
  Home,
  Book,
  MessageCircle,
  Fish,
  Droplets,
  Award,
  User,
  FileText,
  File,
  Files,
  Package,
} from "lucide-react";
import { mainRoutes } from "../../routes/mainRoutes";

const menuItems = [
  {
    icon: Home,
    label: "Dashboard",
    path: "/manager/dashboard",
    roles: ["manager"],
  },
  {
    icon: Calendar,
    label: "Lịch làm việc",
    path: "/master/schedule",
    roles: ["master"],
  },
  {
    icon: Users,
    label: "Danh sách khách hàng",
    path: "/staff/customer-management",
    roles: ["staff"],
  },
  {
    icon: ClipboardList,
    label: "Lịch tư vấn",
    path: "/staff/booking-schedule",
    roles: ["staff"],
  },
  {
    icon: History,
    label: "Lịch sử tư vấn",
    path: "/staff/consultation-history",
    roles: ["staff"],
  },
  {
    icon: Package,
    label: "Quản lý gói tư vấn",
    path: "/staff/consultation-package",
    roles: ["staff"],
  },
  {
    icon: ClipboardList,
    label: "Hội thảo",
    path: "/staff/workshop-staff",
    roles: ["staff"],
  },
  {
    icon: ClipboardList,
    label: "Hội thảo",
    path: "/manager/workshop-list",
    roles: ["manager"],
  },
  {
    icon: Book,
    label: "Khóa học",
    path: "/staff/course-management",
    roles: ["staff"],
  },
  {
    icon: MessageCircle,
    label: "Tư vấn trực tuyến",
    path: "/master/consulting-online",
    roles: ["master"],
  },
  {
    icon: MessageCircle,
    label: "Tư vấn trực tiếp",
    path: "/master/consulting-offline",
    roles: ["master"],
  },
  {
    icon: FileText,
    label: "Biên bản nghiệm thu",
    path: "/manager/attachment",
    roles: ["manager"],
  },
  {
    icon: File,
    label: "Hợp đồng",
    path: "/manager/contract",
    roles: ["manager"],
  },
  {
    icon: File,
    label: "Hợp đồng",
    path: "/staff/contracts",
    roles: ["staff"],
  },
  {
    icon: Files,
    label: "Hồ sơ",
    path: "/manager/document",
    roles: ["manager"],
  },
  {
    icon: Fish,
    label: "Cá Koi ",
    path: "/staff/koi-fish-management",
    roles: ["staff"],
  },
  {
    icon: Droplets,
    label: "Hồ cá Koi",
    path: "/staff/koi-pond-management",
    roles: ["staff"],
  },
  {
    icon: User,
    label: "Tư vấn viên",
    path: "/staff/master-management",
    roles: ["staff"],
  },
  {
    icon: User,
    label: "Khóa học",
    path: "/master/course-master",
    roles: ["master"],
  },
  {
    icon: User,
    label: "Hội thảo",
    path: "/master/workshop-master",
    roles: ["master"],
  },
  {
    icon: ClipboardList,
    label: "Quản lý đặt lịch",
    path: "/manager/booking-management",
    roles: ["manager"],
  },
  {
    icon: User,
    label: "Quản lý tài khoản",
    path: "/admin/accounts",
    roles: ["admin"],
  },
  {
    icon: ClipboardList,
    label: "Quản lý giao dịch",
    path: "/manager/order",
    roles: ["manager"],
  },
  {
    icon: ClipboardList,
    label: "Quản lý hoàn trả",
    path: "/manager/refund",
    roles: ["manager"],
  },
];

const Sidebar = () => {
  const location = useLocation();
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  // Lấy role của người dùng từ localStorage hoặc context
  useEffect(() => {
    // Sử dụng key "role" thay vì "userRole" để đồng bộ với Login.jsx
    const role = localStorage.getItem("role");
    if (role) {
      setUserRole(role);
    } else {
      // Nếu không có role, chuyển hướng về trang login
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const isActive = (path) => {
    if (path === "/master/consulting-offline") {
      return (
        location.pathname === "/master/consulting-offline" ||
        location.pathname.startsWith("/master/consulting-offline/") ||
        location.pathname === "/master/document" ||
        location.pathname === "/master/attachments"
      );
    }

    if (path === "/manager/attachment") {
      return (
        location.pathname === "/manager/attachment" ||
        location.pathname.startsWith("/manager/attachment/")
      );
    }

    if (path === "/manager/contract") {
      return (
        location.pathname === "/manager/contract" ||
        location.pathname.startsWith("/manager/contract/")
      );
    }

    if (path === "/manager/document") {
      return (
        location.pathname === "/manager/document" ||
        location.pathname.startsWith("/manager/document/")
      );
    }

    return location.pathname === path;
  };

  // Lọc menu items dựa trên role của người dùng
  const filteredMenuItems = userRole
    ? menuItems.filter((item) => item.roles && item.roles.includes(userRole))
    : [];

  return (
    <div className="w-64 bg-[#90B77D] min-h-screen">
      <div className="p-4">
        <div className="flex justify-center items-center mb-8">
          <img src="/BitKoi.png" alt="BitKoi Logo" className="w-48 h-auto" />
        </div>

        <nav className="space-y-2">
          {filteredMenuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={
                isActive(item.path)
                  ? "flex items-center gap-3 px-4 py-2 rounded-lg bg-[#42855B] text-white"
                  : "flex items-center gap-3 px-4 py-2 rounded-lg text-gray-800 hover:bg-[#42855B] hover:text-white"
              }
            >
              {React.createElement(item.icon)}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
