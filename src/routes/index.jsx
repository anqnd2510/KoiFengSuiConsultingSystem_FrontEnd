import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
import Workshop from "../pages/Workshop";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "workshop",
        element: <Workshop />,
      },
    ],
  },
]);

export default router; 