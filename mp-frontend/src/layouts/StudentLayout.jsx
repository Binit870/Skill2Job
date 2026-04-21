import StudentNavbar from "../student/dashboard/StudentNavbar";
import StudentSidebar from "../student/dashboard/StudentSidebar";
import { Outlet } from "react-router-dom";
import { useState } from "react";

export default function StudentLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="h-screen flex bg-white">
      {/* Sidebar wrapper — overflow-visible so toggle button can peek out */}
      <div className="relative z-10 flex-shrink-0">
        <StudentSidebar
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <StudentNavbar onMenuClick={() => setMobileOpen(true)} />

        <div className="flex-1 overflow-auto bg-gray-50 p-3 md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}