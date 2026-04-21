import Navbar from "../public/Navbar";
import Footer from "../public/Footer";
import { Outlet, useLocation } from "react-router-dom";

export default function PublicLayout() {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/login" 
    || location.pathname === "/signup"
    || location.pathname === "/contact"
    || location.pathname === "/forgot-password"
    || location.pathname.startsWith("/reset-password");

    const hideFooter =
    location.pathname === "/login" 
    || location.pathname === "/signup"
    || location.pathname === "/contact"
    || location.pathname === "/forgot-password"
    || location.pathname.startsWith("/reset-password");

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Outlet />
      {!hideFooter && <Footer />}
    </>
  );
}
