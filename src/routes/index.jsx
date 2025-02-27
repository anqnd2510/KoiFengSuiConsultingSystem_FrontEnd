import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";
import Workshop from "../pages/Workshop";
import Dashboard from "../pages/Dashboard";
import CourseManagement from "../pages/CourseManagement";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "workshop",
        element: <Workshop />,
      },
      {
        path: "course-management",
        element: <CourseManagement />,
      },
    ],
  },
]);

export default router;
