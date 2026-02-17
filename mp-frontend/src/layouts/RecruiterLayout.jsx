import RecruiterSidebar from "../components/Recruiter/RecruiterSidebar";
import RecruiterNavbar from "../components/Recruiter/RecruiterNavbar";
import { Outlet } from "react-router-dom";

export default function RecruiterLayout() {
  return (
    <div className="h-screen flex overflow-hidden bg-white">
      {/* Sidebar */}
      <RecruiterSidebar />

      {/* Right Section */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <RecruiterNavbar />

        {/* Content */}
        <div className="flex-1 overflow-auto bg-gray-50 p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

