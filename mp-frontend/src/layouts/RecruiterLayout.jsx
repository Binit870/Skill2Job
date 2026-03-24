import RecruiterSidebar from "../components/RecruiterComponents/RecruiterSidebar";
import RecruiterNavbar from "../components/RecruiterComponents/RecruiterNavbar";
import { Outlet } from "react-router-dom";
import { useState } from "react";

export default function RecruiterLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden bg-white">
      <RecruiterSidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <RecruiterNavbar onMenuClick={() => setMobileOpen(true)} />

        <div className="flex-1 overflow-auto bg-gray-50 p-3 md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}