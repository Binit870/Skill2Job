import StudentNavbar from "../components/StudentComponents/StudentNavbar";
import StudentSidebar from "../components/StudentComponents/StudentSidebar";
import { Outlet } from "react-router-dom";
import { useState } from "react";

export default function StudentLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="h-screen flex bg-gray-100 overflow-hidden">

      {/* Sidebar */}
      <StudentSidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Right Section */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Navbar */}
        <StudentNavbar onMenuClick={() => setMobileOpen(true)} />

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-3 md:p-6">
          <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm p-4 md:p-6 min-h-[calc(100vh-120px)]">
            <Outlet />
          </div>
        </div>

      </div>
    </div>
  );
}