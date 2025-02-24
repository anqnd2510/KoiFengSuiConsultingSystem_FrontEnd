import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Layout/Sidebar";
import BookingSchedule from "./pages/BookingSchedule";
import BookingScheduleDetails from "./pages/BookingScheduleDetails";

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1">
          <Routes>
            <Route path="/booking-schedule" element={<BookingSchedule />} />
            <Route
              path="/booking-schedule/:id"
              element={<BookingScheduleDetails />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
