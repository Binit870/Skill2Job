import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

import ProtectedRoute from "./pages/routes/ProtectedRoute";

import LandingPage from "./pages/PublicPages/LandingPage";
import Login from "./pages/PublicPages/Login";
import Signup from "./pages/PublicPages/Signup";
import NotFound from "./pages/routes/NotFound";

import StudentDashboard from "./pages/StudentPages/StudentDashboard";
import FindJobs from "./pages/StudentPages/FindJobs";
import MyApplications from "./pages/StudentPages/MyApplications";

import Analytics from "./pages/StudentPages/Analytics";
import MyResume from "./components/StudentComponents/Resume/MyResume";
import ResumeBuilder from "./components/StudentComponents/Resume/ResumeBuilder";
import StudentProfile from "./components/StudentComponents/Profiles/StudentProfile";
import StudentEditProfile from "./components/StudentComponents/Profiles/StudentEditProfile";
import MockInterview from "./components/StudentComponents/MockInterview/MockInterview";
import MockAssessment from "./components/StudentComponents/MockAssessment/MockAssessment";
import JobDetails from "./components/StudentComponents/Jobs/JobDetails";
import ResumeView from "./components/StudentComponents/Resume/ResumeView";

import RecruiterDashboard from "./pages/RecruiterPages/RecruiterDashboard";
import RecruiterEditProfile from "./components/RecruiterComponents/Profiles/RecruiterEditProfile";
import RecruiterProfile from "./components/RecruiterComponents/Profiles/RecruiterProfile";
import MyJobs from "./components/RecruiterComponents/Jobs/MyJobs";
import PostJob from "./pages/RecruiterPages/PostJob";
import RecruiterApplications from "./pages/RecruiterPages/RecruiterApplications";
import EditJob from "./components/RecruiterComponents/Jobs/EditJob";

import PublicLayout from "./layouts/PublicLayout";
import StudentLayout from "./layouts/StudentLayout";
import RecruiterLayout from "./layouts/RecruiterLayout";


// 👇 GLOBAL ERROR HANDLER - Chrome extension errors ke liye
// Yeh error sirf console me dikhta hai, app functionality par koi asar nahi
if (typeof window !== 'undefined') {
  // Original console.error ko save karo
  const originalConsoleError = console.error;

  // console.error ko override karo
  console.error = (...args) => {
    // Extension-related errors ko ignore karo
    if (args[0]?.includes?.('listener indicated an asynchronous response') ||
      args[0]?.includes?.('message channel closed') ||
      args[0]?.includes?.('Extension context invalidated')) {
      return; // In errors ko ignore karo
    }
    // Baaki errors normally show karo
    originalConsoleError.apply(console, args);
  };
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Toast notifications */}
        <Toaster position="top-right" reverseOrder={false} />

        <Routes>
          {/* ========== PUBLIC ROUTES ========== */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

          {/* ========== STUDENT ROUTES ========== */}
          {/* Student Profile - separate route */}
          <Route
            path="/student/profile"
            element={
              <ProtectedRoute role="student">
                <StudentProfile />
              </ProtectedRoute>
            }
          />

          {/* Student Layout - all other student routes */}
          <Route
            element={
              <ProtectedRoute role="student">
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/student/jobs" element={<FindJobs />} />
            <Route path="/student/edit-profile" element={<StudentEditProfile />} />
          
            <Route path="/student/jobs/:id" element={<JobDetails />} />
            <Route path="/student/resume" element={<MyResume />} />
            <Route path="/student/resume-builder" element={<ResumeBuilder />} />
            <Route path="/student/analyze" element={<Analytics />} />
            <Route path="/student/mock-interview" element={<MockInterview />} />
            <Route path="/student/mock-assesment" element={<MockAssessment />} />
            <Route path="/student/resume-view" element={<ResumeView />} />
            <Route path="/student/my-applications" element={<MyApplications />} />
          </Route>

          {/* ========== RECRUITER ROUTES ========== */}
          {/* Recruiter Profile - separate route */}
          <Route
            path="/recruiter/profile"
            element={
              <ProtectedRoute role="recruiter">
                <RecruiterProfile />
              </ProtectedRoute>
            }
          />

          {/* Recruiter Layout - all other recruiter routes */}
          <Route
            element={
              <ProtectedRoute role="recruiter">
                <RecruiterLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
            <Route path="/recruiter/post-job" element={<PostJob />} />
            <Route path="/recruiter/my-jobs" element={<MyJobs />} />
            <Route path="/recruiter/edit-job/:id" element={<EditJob />} />
            <Route path="/recruiter/edit-profile" element={<RecruiterEditProfile />} />

            <Route path="/recruiter/candidates-applications" element={<RecruiterApplications />} />
          </Route>

          {/* 404 Page - catch all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}