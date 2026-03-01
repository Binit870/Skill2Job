import Navbar from "../pages/Navbar";
import { Outlet, useLocation } from "react-router-dom";

export default function PublicLayout() {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/signup";

  return (
    <>
    {!hideNavbar && <Navbar />}
    
      <Outlet />
    </>
  );
}
