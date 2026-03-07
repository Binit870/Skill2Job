// import StudentNavbar from "../components/Student/StudentNavbar";
// import StudentSidebar from "../components/Student/StudentSidebar";
// import { Outlet } from "react-router-dom";

// export default function StudentLayout() {
//   return (
//    <div className="h-screen flex overflow-hidden bg-white">
//       {/* Sidebar */}
//       <StudentSidebar />
//        {/* Right Section */}
//       <div className="flex-1 flex flex-col">
//         <StudentNavbar />
//         {/* Content */}
//         <div className="flex-1 overflow-auto bg-gray-50 p-6">
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// }
import StudentNavbar from "../components/Student/StudentNavbar";
import StudentSidebar from "../components/Student/StudentSidebar";
import { Outlet } from "react-router-dom";

export default function StudentLayout() {
  return (
    <div className="h-screen flex bg-gray-100">

      {/* Sidebar */}
      <StudentSidebar />

      {/* Right Section */}
      <div className="flex-1 flex flex-col">

        {/* Navbar */}
        <StudentNavbar />

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm p-6 min-h-[calc(100vh-120px)]">
            <Outlet />
          </div>
        </div>

      </div>
    </div>
  );
}
