import Dashboard from "../pages/manager/Dashboard";
import Schedule from "../pages/master/Schedule";
import BookingSchedule from "../pages/staff/BookingSchedule";
import BookingScheduleDetails from "../pages/BookingScheduleDetails";
import Workshop from "../pages/master/Workshop";
import WorkshopList from "../pages/manager/WorkshopList";
import WorkshopStaff from "../pages/staff/WorkshopStaff";
import WorkshopCheck from "../pages/manager/WorkshopCheck";
import WorkshopManager from "../pages/manager/WorkshopManager";
import AudienceList from "../pages/staff/AudienceList";
import CourseMaster from "../pages/master/CourseMaster";
import Chapter from "../pages/master/Chapter";
import Quiz from "../pages/master/Quiz";
import CourseManagement from "../pages/staff/CourseManagement";
import ConsultingOnline from "../pages/master/ConsultingOnline";
import ConsultingOffline from "../pages/master/ConsultingOffline";
import KoiFishManagement from "../pages/staff/KoiFishManagement";
import KoiPondManagement from "../pages/staff/KoiPondManagement";
import Feedback from "../pages/Feedback";
import Certificate from "../pages/Certificate";
import Master from "../pages/staff/Master";
import Customer from "../pages/staff/Customer";
import Notifications from "../pages/staff/Notifications";
import ConsultationHistory from "../pages/staff/ConsultationHistory";
import Question from "../pages/master/Question";
import Profile from "../pages/Profile";
import Attachment from "../pages/manager/Attachment";
import AttachmentDetail from "../pages/manager/AttachmentDetail";
import Contract from "../pages/manager/Contract";
import ContractDetail from "../pages/manager/ContractDetail";
import Document from "../pages/manager/Document";
import DocumentDetail from "../pages/manager/DocumentDetail";
import ConsultingContract from "../pages/staff/ConsultingContract";
import DocumentList from "../pages/master/DocumentList";
import AttachmentList from "../pages/master/AttachmentList";
export const mainRoutes = [
  {
    path: "manager/dashboard",
    element: <Dashboard />,
  },
  {
    path: "master/schedule",
    element: <Schedule />,
  },
  {
    path: "staff/booking-schedule",
    element: <BookingSchedule />,
  },
  {
    path: "booking-schedule/:id",
    element: <BookingScheduleDetails />,
  },
  {
    path: "master/workshop-master",
    element: <Workshop />,
  },
  {
    path: "manager/workshop-list",
    element: <WorkshopList />,
  },
  {
    path: "staff/workshop-staff",
    element: <WorkshopStaff />,
  },
  {
    path: "manager/workshop-manager",
    element: <WorkshopManager />,
  },
  {
    path: "manager/workshopcheck",
    element: <WorkshopCheck />,
  },
  {
    path: "staff/audience/:workshopId",
    element: <AudienceList />,
  },
  {
    path: "master/course-master",
    element: <CourseMaster />,
  },
  {
    path: "master/course-chapters/:courseId",
    element: <Chapter />,
  },
  {
    path: "master/course-quiz/:courseId",
    element: <Quiz />,
  },
  {
    path: "master/quiz/:quizId/questions",
    element: <Question />,
  },
  {
    path: "staff/course-management",
    element: <CourseManagement />,
  },
  {
    path: "master/consulting-online",
    element: <ConsultingOnline />,
  },
  {
    path: "master/consulting-offline",
    element: <ConsultingOffline />,
  },
  {
    path: "staff/koi-fish-management",
    element: <KoiFishManagement />,
  },
  {
    path: "staff/koi-pond-management",
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
    path: "staff/master-management",
    element: <Master />,
  },
  {
    path: "staff/customer-management",
    element: <Customer />,
  },
  {
    path: "staff/consultation-history",
    element: <ConsultationHistory />,
  },
  {
    path: "profile",
    element: <Profile />,
  },
  {
    path: "manager/attachment",
    element: <Attachment />,
  },
  {
    path: "manager/attachment/:id",
    element: <AttachmentDetail />,
  },
  {
    path: "manager/contract",
    element: <Contract />,
  },
  {
    path: "manager/contract/:id",
    element: <ContractDetail />,
  },
  {
    path: "manager/document",
    element: <Document />,
  },
  {
    path: "manager/document/:id",
    element: <DocumentDetail />,
  },
  {
    path: "staff/contracts",
    element: <ConsultingContract />,
  },
  {
    path: "master/document",
    element: <DocumentList />,
  },
  {
    path: "master/attachments",
    element: <AttachmentList />,
  },
  {
    path: "staff/notifications",
    element: <Notifications />,
  },
];
