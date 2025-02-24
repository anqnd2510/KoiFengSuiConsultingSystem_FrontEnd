import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Layout/Sidebar";
import BookingSchedule from "./pages/BookingSchedule";
import BookingScheduleDetails from "./pages/BookingScheduleDetails";

import Workshop from "./pages/Workshop";
import WorkshopList from "./pages/WorkshopList";

import MainLayout from "./components/Layout/MainLayout";
import Schedule from "./pages/Schedule";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Schedule />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="/booking-schedule" element={<BookingSchedule />} />
          <Route
            path="/booking-schedule/:id"
            element={<BookingScheduleDetails />}
          />
          <Route path="/workshop" element={<Workshop />} />
          <Route path="/workshoplist" element={<WorkshopList />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
