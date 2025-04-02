import BlogManagement from "../pages/BlogManagement";
import CreateBlog from "../pages/CreateBlog";
import Login from "../pages/Login";

export const publicRoutes = [
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
];
