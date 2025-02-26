import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Layout/Sidebar";
import BookingSchedule from "./pages/BookingSchedule";
import BookingScheduleDetails from "./pages/BookingScheduleDetails";

import Workshop from "./pages/Workshop";
import WorkshopList from "./pages/WorkshopList";
import WorkshopStaff from "./pages/WorkshopStaff";
import WorkshopCheck from './pages/WorkshopCheck';
import AudienceList from './pages/AudienceList';
import MainLayout from "./components/Layout/MainLayout";
import Schedule from "./pages/Schedule";
import BlogManagement from "./pages/BlogManagement";
import CreateBlog from "./pages/CreateBlog";


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
          <Route path="/workshop-master" element={<Workshop />} />
          <Route path="/workshop-company" element={<WorkshopList />} />
          <Route path="/workshop-staff" element={<WorkshopStaff />} />
          <Route path="/workshopcheck" element={<WorkshopCheck />} />
          <Route path="/audience" element={<AudienceList />} />
        </Route>
        <Route path="/blog-management" element={<BlogManagement />} />
        <Route path="/create-blog" element={<CreateBlog />} />
        
      </Routes>
    </Router>
  );
}

export default App;
