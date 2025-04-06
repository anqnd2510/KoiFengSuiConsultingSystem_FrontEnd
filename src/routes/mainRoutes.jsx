import Dashboard from "../pages/manager/Dashboard";
import Schedule from "../pages/master/Schedule";
import BookingSchedule from "../pages/staff/BookingSchedule";
import BookingScheduleDetails from "../pages/master/BookingScheduleDetails";
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
import ConsultationPackage from "../pages/staff/ConsultationPackage";
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
import BookingManagement from "../pages/manager/BookingManagement";
export const mainRoutes = [
  {
    path: "manager/dashboard",
    element: <Dashboard />,
    roles: ["manager"],
  },
  {
    path: "master/schedule",
    element: <Schedule />,
    roles: ["master"],
  },
  {
    path: "staff/booking-schedule",
    element: <BookingSchedule />,
    roles: ["staff"],
  },
  {
    path: "master/booking-schedule/:id",
    element: <BookingScheduleDetails />,
    roles: ["master"],
  },
  {
    path: "master/workshop-master",
    element: <Workshop />,
    roles: ["master"],
  },
  {
    path: "manager/workshop-list",
    element: <WorkshopList />,
    roles: ["manager"],
  },
  {
    path: "staff/workshop-staff",
    element: <WorkshopStaff />,
    roles: ["staff"],
  },
  {
    path: "manager/workshop-manager",
    element: <WorkshopManager />,
    roles: ["manager"],
  },
  {
    path: "manager/workshopcheck",
    element: <WorkshopCheck />,
    roles: ["manager"],
  },
  {
    path: "staff/audience/:workshopId",
    element: <AudienceList />,
    roles: ["staff"],
  },
  {
    path: "master/course-master",
    element: <CourseMaster />,
    roles: ["master"],
  },
  {
    path: "master/course-chapters/:courseId",
    element: <Chapter />,
    roles: ["master"],
  },
  {
    path: "master/course-quiz/:courseId",
    element: <Quiz />,
    roles: ["master"],
  },
  {
    path: "master/quiz/:quizId/questions",
    element: <Question />,
    roles: ["master"],
  },
  {
    path: "staff/course-management",
    element: <CourseManagement />,
    roles: ["staff"],
  },
  {
    path: "master/consulting-online",
    element: <ConsultingOnline />,
    roles: ["master"],
  },
  {
    path: "master/consulting-offline",
    element: <ConsultingOffline />,
    roles: ["master"],
  },
  {
    path: "staff/koi-fish-management",
    element: <KoiFishManagement />,
    roles: ["staff"],
  },
  {
    path: "staff/koi-pond-management",
    element: <KoiPondManagement />,
    roles: ["staff"],
  },
  {
    path: "feedback",
    element: <Feedback />,
    roles: ["staff", "master", "manager"],
  },
  {
    path: "certificate",
    element: <Certificate />,
    roles: ["staff", "master", "manager"],
  },
  {
    path: "staff/master-management",
    element: <Master />,
    roles: ["staff"],
  },
  {
    path: "staff/customer-management",
    element: <Customer />,
    roles: ["staff"],
  },
  {
    path: "staff/consultation-history",
    element: <ConsultationHistory />,
    roles: ["staff"],
  },
  {
    path: "staff/consultation-package",
    element: <ConsultationPackage />,
    roles: ["staff"],
  },
  {
    path: "profile",
    element: <Profile />,
    roles: ["staff", "master", "manager"],
  },
  {
    path: "manager/attachment",
    element: <Attachment />,
    roles: ["manager"],
  },
  {
    path: "manager/attachment/:id",
    element: <AttachmentDetail />,
    roles: ["manager"],
  },
  {
    path: "manager/contract",
    element: <Contract />,
    roles: ["manager"],
  },
  {
    path: "manager/contract/:id",
    element: <ContractDetail />,
    roles: ["manager"],
  },
  {
    path: "manager/document",
    element: <Document />,
    roles: ["manager"],
  },
  {
    path: "manager/document/:id",
    element: <DocumentDetail />,
    roles: ["manager"],
  },
  {
    path: "staff/contracts",
    element: <ConsultingContract />,
    roles: ["staff"],
  },
  {
    path: "master/document",
    element: <DocumentList />,
    roles: ["master"],
  },
  {
    path: "master/attachments",
    element: <AttachmentList />,
    roles: ["master"],
  },
  {
    path: "staff/notifications",
    element: <Notifications />,
    roles: ["staff"],
  },
  {
    path: "manager/booking-management",
    element: <BookingManagement />,
    roles: ["manager"],
  },
];
