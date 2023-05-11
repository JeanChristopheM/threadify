import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./LandingPage";
import Layout from "./Layout";
import NewProject from "./NewProject";
import OldProject from "./OldProject";
import ErrorPage from "./404";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <LandingPage />,
      },
      {
        path: "new",
        element: <NewProject />,
      },
      {
        path: "letsgo",
        element: <OldProject />,
      },
    ],
    errorElement: <ErrorPage />,
  },
  {
    path: "/threadify/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <LandingPage />,
      },
      {
        path: "new",
        element: <NewProject />,
      },
      {
        path: "letsgo",
        element: <OldProject />,
      },
    ],
    errorElement: <ErrorPage />,
  },
]);

const App = () => {
  return (
    <div id="app">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
