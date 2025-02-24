import React from "react";
const StatusBadge = ({ status, isOnline }) => {
  if (isOnline !== undefined) {
    return (
      <span
        className={`px-2 py-1 text-sm rounded-full ${
          isOnline ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
        }`}
      >
        {isOnline ? "Online" : "Offline"}
      </span>
    );
  }

  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800",
    done: "bg-green-100 text-green-800",
    cancel: "bg-red-100 text-red-800",
    scheduled: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={`px-2 py-1 text-sm rounded-full ${
        statusStyles[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge;
