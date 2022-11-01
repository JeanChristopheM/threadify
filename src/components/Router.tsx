import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./LandingPage";
import Layout from "./Layout";
import NewProject from "./NewProject";
import OldProject from "./OldProject";

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
    errorElement: <p>Page not found</p>,
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
