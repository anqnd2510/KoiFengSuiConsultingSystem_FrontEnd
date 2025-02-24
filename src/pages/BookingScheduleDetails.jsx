import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BookingScheduleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    consultationId: "CONS-001",
    customerName: "John Smith",
    link: "https://meet.google.com/abc-defg-hij",
    date: "2024-03-15",
    time: "08:00-10:00",
    method: "Online",
    description: "Tư vấn xây nhà ở ven sông Sài Gòn view Landmark81",
    note: "Nền xây nhà hướng Bắc",
  });

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handlePageChange = (page) => {
    console.log("Page changed to:", page);
  };

  const handleReturn = () => {
    navigate("/booking-schedule");
  };

  return (
    <div>
      <div className="bg-[#B89D71] p-4">
        <h1 className="text-white text-xl">Booking Schedule Management</h1>
        <p className="text-white/80 mt-1">
          Reports and overview of your workshops
        </p>
      </div>

      <div className="p-8">
        <button
          onClick={handleReturn}
          className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <span>←</span> Back to Booking Schedule
        </button>

        <div className="bg-white rounded p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl">Booking Schedule Details</h2>
            <div className="relative"></div>
          </div>
          {/* Error Message */}
          <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-3 rounded mb-8">
            <span className="flex items-center gap-3">
              <span className="text-red-600">⚠</span>
              Error
            </span>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-x-24">
              <div className="space-y-6">
                <div className="flex items-center">
                  <label className="w-36 text-gray-700">Consultation ID</label>
                  <input
                    type="text"
                    value={formData.consultationId}
                    onChange={handleInputChange("consultationId")}
                    className="border bg-gray-100 flex-1 py-2 px-3"
                  />
                </div>

                <div className="flex items-center">
                  <label className="w-36 text-gray-700">Customer Name</label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={handleInputChange("customerName")}
                    className="border bg-gray-100 flex-1 py-2 px-3"
                  />
                </div>

                <div className="flex items-center">
                  <label className="w-36 text-gray-700">Link</label>
                  <input
                    type="text"
                    value={formData.link}
                    onChange={handleInputChange("link")}
                    className="border bg-gray-100 flex-1 py-2 px-3"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center">
                  <label className="w-36 text-gray-700">Date</label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={handleInputChange("date")}
                    className="border bg-gray-100 flex-1 py-2 px-3"
                  />
                </div>

                <div className="flex items-center">
                  <label className="w-36 text-gray-700">Time</label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={handleInputChange("time")}
                    className="border bg-gray-100 flex-1 py-2 px-3"
                  />
                </div>

                <div className="flex items-center">
                  <label className="w-36 text-gray-700">Phương thức</label>
                  <input
                    type="text"
                    value={formData.method}
                    onChange={handleInputChange("method")}
                    className="border bg-gray-100 flex-1 py-2 px-3"
                  />
                </div>
              </div>
            </div>

            <div className="flex mt-8">
              <label className="w-36 text-gray-700">Description</label>
              <textarea
                value={formData.description}
                onChange={handleInputChange("description")}
                className="border bg-gray-100 flex-1 h-28 py-2 px-3"
              />
            </div>

            <div className="flex mt-8">
              <label className="w-36 text-gray-700">Note</label>
              <textarea
                value={formData.note}
                onChange={handleInputChange("note")}
                className="border bg-gray-100 flex-1 h-28 py-2 px-3"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingScheduleDetails;
