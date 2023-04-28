import LandingPage from "./pages/LandingPage";
import VideoEdit from "./pages/VideoEdit";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

function App() {
  let router = createBrowserRouter([
    {path:"/",element:<LandingPage/>},
    {path:"edit/:videoId",element:<VideoEdit/>}
  ]);
  return (<RouterProvider router={router} />);
}

export default App;
