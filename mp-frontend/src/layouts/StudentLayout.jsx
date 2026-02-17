import StudentNavbar from "../components/Student/StudentNavbar";
import StudentSidebar from "../components/Student/StudentSidebar";
import { Outlet } from "react-router-dom";

export default function StudentLayout() {
  return (
   <div className="h-screen flex overflow-hidden bg-white">
      {/* Sidebar */}
      <StudentSidebar />
       {/* Right Section */}
      <div className="flex-1 flex flex-col">
        <StudentNavbar />
        {/* Content */}
        <div className="flex-1 overflow-auto bg-gray-50 p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
