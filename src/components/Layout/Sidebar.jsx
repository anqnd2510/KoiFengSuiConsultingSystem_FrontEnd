import React from "react";
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
  Settings,
  LogOut,
  FileText,
  File,
  Files,
} from "lucide-react";
import { Link } from "react-router-dom";
import { logout } from "../../services/auth.service";
import { message } from "antd";

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/manager/dashboard" },
  { icon: Calendar, label: "Schedule", path: "/master/schedule" },
  { icon: MessageSquare, label: "Feedback", path: "/feedback" },
  {
    icon: Users,
    label: "Customer Management",
    path: "/staff/customer-management",
  },
  { icon: Bell, label: "Notifications", path: "/staff/notifications" },
  {
    icon: ClipboardList,
    label: "Booking Schedule",
    path: "/staff/booking-schedule",
  },
  {
    icon: History,
    label: "Consultation History",
    path: "/staff/consultation-history",
  },

  {
    icon: Newspaper,
    label: "Koi Feng Shui Blog",
    path: "/blog-management",
  },
  { icon: ClipboardList, label: "Workshop", path: "/staff/workshop-staff" },
  {
    icon: ClipboardList,
    label: "Workshop List",
    path: "/manager/workshop-list",
  },
  { icon: Book, label: "Courses", path: "/course-management" },
  { icon: Award, label: "Certificate", path: "/certificate" },
  {
    icon: MessageCircle,
    label: "Consulting Online",
    path: "/master/consulting-online",
  },
  {
    icon: MessageCircle,
    label: "Consulting Offline",
    path: "/master/consulting-offline",
  },
  {
    icon: FileText,
    label: "Biên bản nghiệm thu",
    path: "/manager/attachment",
  },
  {
    icon: File,
    label: "Hợp đồng",
    path: "/manager/contract",
  },
  {
    icon: File,
    label: "Tạo hợp đồng",
    path: "/staff/contracts",
  },
  {
    icon: Files,
    label: "Hồ sơ",
    path: "/manager/document",
  },
  {
    icon: Fish,
    label: "Koi Fish ",
    path: "/staff/koi-fish-management",
  },
  {
    icon: Droplets,
    label: "Koi Pond ",
    path: "/staff/koi-pond-management",
  },
  {
    icon: User,
    label: "Master Management",
    path: "/master-management",
  },
  {
    icon: User,
    label: "Course Master",
    path: "/course-master",
  },
  {
    icon: User,
    label: "Workshop Master",
    path: "/workshop-master",
  },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await logout();
      if (response) {
        message.success("Đăng xuất thành công");
        // Chuyển về trang login sau khi đăng xuất
        navigate("/login");
      }
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
      message.error("Có lỗi xảy ra khi đăng xuất");
      // Vẫn chuyển về trang login nếu có lỗi
      navigate("/login");
    }
  };

  const isActive = (path) => {
    if (path === "/master/consulting-offline") {
      return (
        location.pathname === "/master/consulting-offline" ||
        location.pathname.startsWith("/master/consulting-offline/")
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

  return (
    <div className="w-64 bg-[#90B77D] min-h-screen relative">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-8">
          <img
            src="https://s3-alpha-sig.figma.com/img/ecfb/7109/593e32c422a65fcfe85b222299384fb2?Expires=1741564800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=rY8NCrfNmOymGEcakAG42elPBrUzYDk2-dc-3JQoJicbl3Lrse-esdQslnOBnmMyMJ7gQH~ZWVL2Gs8Qg2eGfK00YZ0OySm6FAAgfM8O6ALm8BP9BUSpG~yl8q-mTm~8r9I0MUNXqc8UFtwJS4QUH~Dbscjcmg9ymTn4Fu6WGtaLg37-0LvO3HPJGTY~iknJAvA~XNj4XbzOrXBDF3UGuovMTM5oH1jGCwmLNEi8g3pu~ElgHlUiung8sGdPdrmHNeOxo8jf5o20hj-O57bD1fCYAt3EpVLKGnYocHgPW2EJ70l6tCb3n2EhWvyD8QhoWTxCznmMIqX-zJZoitieDw__"
            alt="Koi Phong Thủy"
            className="w-16 h-16"
          />
          <h1 className="text-xl font-bold text-white">KOI PHONG THỦY</h1>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
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

      <div className="absolute bottom-4 left-4 flex items-center gap-2 w-[calc(100%-2rem)]">
        <Link
          to="/profile"
          className={`flex items-center gap-3 px-4 py-2 rounded-lg flex-1 ${
            location.pathname === "/profile"
              ? "bg-[#42855B] text-white"
              : "text-gray-800 hover:bg-[#42855B] hover:text-white"
          }`}
        >
          <div className="flex items-center gap-3 flex-1">
            <img
              src="avatar.jpg"
              alt="User"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span>anh Duy An</span>
          </div>
          <Settings size={18} />
        </Link>

        <button
          onClick={handleLogout}
          className="p-2 rounded-lg text-gray-800 hover:bg-[#42855B] hover:text-white transition-colors duration-200"
          title="Đăng xuất"
        >
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
