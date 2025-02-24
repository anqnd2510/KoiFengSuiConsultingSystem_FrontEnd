import React from "react";
import { NavLink } from "react-router-dom";
import {
  Calendar,
  MessageSquare,
  Users,
  Bell,
  ClipboardList,
  History,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { icon: Calendar, label: "Schedule", path: "/schedule" },
  { icon: MessageSquare, label: "Feedback", path: "/feedback" },
  { icon: Users, label: "Customer Management", path: "/customer-management" },
  { icon: Bell, label: "Notifications", path: "/notifications" },
  {
    icon: ClipboardList,
    label: "Booking Schedule",
    path: "/booking-schedule",
  },
  {
    icon: History,
    label: "Consultation History",
    path: "/consultation-history",
  },
  { icon: ClipboardList, label: "Workshop", path: "/workshop" },
];

const Sidebar = () => {
  const location = useLocation();

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
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg ${
                  isActive
                    ? "bg-[#42855B] text-white"
                    : "text-gray-800 hover:bg-[#42855B] hover:text-white"
                }`
              }
            >
              {React.createElement(item.icon)}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="absolute bottom-4 left-4 flex items-center gap-2">
        <img src="avatar.jpg" alt="User" className="w-8 h-8 rounded-full" />
        <span className="text-white">anh Duy An</span>
      </div>
    </div>
  );
};

export default Sidebar;
