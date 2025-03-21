import Dashboard from "../pages/Dashboard";
import Schedule from "../pages/Schedule";
import BookingSchedule from "../pages/BookingSchedule";
import BookingScheduleDetails from "../pages/BookingScheduleDetails";
import Workshop from "../pages/Workshop";
import WorkshopList from "../pages/WorkshopList";
import WorkshopStaff from "../pages/WorkshopStaff";
import WorkshopCheck from "../pages/WorkshopCheck";
import AudienceList from "../pages/AudienceList";
import CourseMaster from "../pages/CourseMaster";
import CourseManagement from "../pages/CourseManagement";
import ConsultingOnline from "../pages/ConsultingOnline";
import KoiFishManagement from "../pages/KoiFishManagement";
import KoiPondManagement from "../pages/KoiPondManagement";
import Feedback from "../pages/Feedback";
import Certificate from "../pages/Certificate";
import Master from "../pages/Master";
import Customer from "../pages/Customer";
import ConsultationHistory from "../pages/ConsultationHistory";

export const mainRoutes = [
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "schedule",
    element: <Schedule />,
  },
  {
    path: "booking-schedule",
    element: <BookingSchedule />,
  },
  {
    path: "booking-schedule/:id",
    element: <BookingScheduleDetails />,
  },
  {
    path: "workshop-master",
    element: <Workshop />,
  },
  {
    path: "workshop-company",
    element: <WorkshopList />,
  },
  {
    path: "workshop-staff",
    element: <WorkshopStaff />,
  },
  {
    path: "workshopcheck",
    element: <WorkshopCheck />,
  },
  {
    path: "audience",
    element: <AudienceList />,
  },
  {
    path: "course-master",
    element: <CourseMaster />,
  },
  {
    path: "course-management",
    element: <CourseManagement />,
  },
  {
    path: "consulting-online",
    element: <ConsultingOnline />,
  },
  {
    path: "koi-fish-management",
    element: <KoiFishManagement />,
  },
  {
    path: "koi-pond-management",
    element: <KoiPondManagement />,
  },
  {
    path: "feedback",
    element: <Feedback />,
  },
  {
    path: "certificate",
    element: <Certificate />,
  },
  {
    path: "master-management",
    element: <Master />,
  },
  {
    path: "customer-management",
    element: <Customer />,
  },
  {
    path: "consultation-history",
    element: <ConsultationHistory />,
  },
];
