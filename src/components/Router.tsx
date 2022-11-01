import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Header from "./Header";
import LandingPage from "./LandingPage";
import Main from "./NewProject";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "new",
    element: <Main />,
  },
]);

const App = () => {
  return (
    <div id="app">
      <Header />
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
