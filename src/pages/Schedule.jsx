import Calendar from "../components/Schedule/Calendar";
import Header from "../components/Common/Header";
import Error from "../components/Common/Error";
import { useState } from "react";

const MOCK_BOOKINGS = [
  {
    id: 1,
    date: 2,
    isCurrentMonth: true,
    customerName: "John Smith",
    phoneNumber: "0123456789",
    description: "nhà đẹp xe sang",
    address: "ABC, HCM City",
    time: "8:00-10:00",
    link: "zalo-you-bro",
    isOnline: true,
    isOffline: false,
  },
  {
    id: 2,
    date: 2,
    isCurrentMonth: true,
    customerName: "anh Duy An",
    phoneNumber: "0912875712",
    description: "how to pass SEP490",
    address: "ABC, HCM City",
    time: "8:00-10:00",
    link: "zalo-you-bro",
    isOnline: false,
    isOffline: true,
  },
];

const Schedule = () => {
  const [error, setError] = useState(null);

  return (
    <div className="flex min-h-screen">
      <div className="flex-1">
        <Header 
          title="Lịch hẹn"
          description="Lịch đặt hẹn cho chuyên gia"
        />

        <main className="p-6">
          {error && <Error message={error} />}
          <Calendar bookings={MOCK_BOOKINGS} />
        </main>
      </div>
    </div>
  );
};

export default Schedule;
