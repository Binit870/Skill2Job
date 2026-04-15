import Navbar from "./Navbar";
import { Outlet, useLocation } from "react-router-dom";

export default function PublicLayout() {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/signup"
    || location.pathname === "/forgot-password"
    || location.pathname.startsWith("/reset-password");

  return (
    <>
    {!hideNavbar && <Navbar />}
    
      <Outlet />
    </>
  );
}
