import ConsultingOffline from "../pages/ConsultingOffline";
import BlogManagement from "../pages/BlogManagement";
import CreateBlog from "../pages/CreateBlog";
import Login from "../pages/Login";
import Contract from "../pages/Contract";
import ContractDetail from "../pages/ContractDetail";
import Notifications from "../pages/Notifications";

export const publicRoutes = [
  {
    path: "/consulting-offline",
    element: <ConsultingOffline />,
  },
  {
    path: "/blog-management",
    element: <BlogManagement />,
  },
  {
    path: "/create-blog",
    element: <CreateBlog />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/contract",
    element: <Contract />,
  },
  {
    path: "/contract/:id",
    element: <ContractDetail />,
  },
  {
    path: "/notifications",
    element: <Notifications />,
  },
  
];