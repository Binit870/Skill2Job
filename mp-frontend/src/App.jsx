import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

import ProtectedRoute from "./pages/ProtectedRoute";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

import StudentDashboard from "./components/Student/StudentDashboard";
import FindJobs from "./components/Student/FindJobs";
import RecommendedJobs from "./components/Student/RecommendedJobs";
import MyResume from "./components/Student/MyResume";
import ResumeBuilder from "./components/Student/ResumeBuilder";
import Analytics from "./components/Student/Analytics";
import StudentProfile from "./components/Student/Profiles/StudentProfile";
import StudentEditProfile from "./components/Student/Profiles/StudentEditProfile";
import MockInterview from "./components/Student/MockInterview/MockInterview";
import JobDetails from "./components/Student/JobDetails";
import RecruiterEditProfile from "./components/Recruiter/Profiles/RecruiterEditProfile";
import RecruiterProfile from "./components/Recruiter/Profiles/RecruiterProfile";
import RecruiterDashboard from "./components/Recruiter/RecruiterDashboard";
import PostJob from "./components/Recruiter/PostJob";
import MyJobs from "./components/Recruiter/MyJobs";

import PublicLayout from "./layouts/PublicLayout";
import StudentLayout from "./layouts/StudentLayout";
import RecruiterLayout from "./layouts/RecruiterLayout";

import ResumeView from "./components/Student/ResumeView";

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
            <Route path="/student/jobs/:id" element={<JobDetails />} />
            <Route path="/student/jobs/recommend" element={<RecommendedJobs />} />
            <Route path="/student/resume" element={<MyResume />} />
            <Route path="/student/resume-builder" element={<ResumeBuilder />} />
            <Route path="/student/analyze" element={<Analytics />} />
            <Route path="/student/edit-profile" element={<StudentEditProfile />} />
            <Route path="/student/mock-interview" element={<MockInterview />} />
            <Route path="/student/resume-view" element={<ResumeView />} />
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
            <Route path="/recruiter/my" element={<MyJobs />} />
            <Route path="/recruiter/edit-profile" element={<RecruiterEditProfile />} />
          </Route>

          {/* 404 Page - catch all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}