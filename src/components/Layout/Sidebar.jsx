import React from "react";
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
  { icon: Calendar, text: "Schedule", href: "#" },
  { icon: MessageSquare, text: "Feedback", href: "#" },
  { icon: Users, text: "Customer Management", href: "#" },
  { icon: Bell, text: "Notifications", href: "#" },
  { icon: ClipboardList, text: "Booking Schedule", href: "/booking-schedule" },
  { icon: History, text: "Consultation History", href: "#" },
  { icon: ClipboardList, text: "Workshop", href: "/workshop" },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-[#90BC95] min-h-screen p-4">
      <div className="flex items-center gap-2 mb-8">
        <img src="/logo.png" alt="Logo" className="w-12 h-12 rounded-full" />
        <h2 className="text-white font-semibold">KOI PHONG THỦY</h2>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.text}
              to={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-white hover:bg-white/10 transition-colors ${
                location.pathname === item.href ? "bg-white/20" : ""
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.text}</span>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-4 left-4 flex items-center gap-2">
        <img
          src="/placeholder.svg?height=32&width=32"
          alt="User"
          className="w-8 h-8 rounded-full"
        />
        <span className="text-white text-sm">anh DuyAn trường F</span>
      </div>
    </div>
  );
};

export default Sidebar;
