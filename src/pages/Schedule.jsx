import Calendar from "../components/Schedule/Calendar";

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
  return (
    <div className="flex min-h-screen">
      <div className="flex-1">
        <header className="bg-[#B4925A] p-6">
          <h1 className="text-2xl font-semibold text-white mb-2">Lịch hẹn</h1>
          <p className="text-white/80">Lịch đặt hẹn cho chuyên gia</p>
        </header>

        <main className="p-6">
          <Calendar bookings={MOCK_BOOKINGS} />
        </main>
      </div>
    </div>
  );
};

export default Schedule;
