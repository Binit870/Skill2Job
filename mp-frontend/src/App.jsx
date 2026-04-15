import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";

// Layouts
import LandingPage from "./layouts/LandingPage";
import PublicLayout from "./layouts/PublicLayout";
import StudentLayout from "./layouts/StudentLayout";
import RecruiterLayout from "./layouts/RecruiterLayout";

//Routes
import ProtectedRoute from "./routes/ProtectedRoute";
import NotFound from "./routes/NotFound";

// Public pages
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";

// Student pages
import Analytics from "./student/analytics/Analytics";
import MyApplications from "./student/applications/MyApplications";
import StudentDashboard from "./student/components/StudentDashboard";
import FindJobs from "./student/jobs/FindJobs";
import JobDetails from "./student/jobs/JobDetails";
import MockAssessment from "./student/mock-assessment/MockAssessment";
import MockInterview from "./student/mock-interview/MockInterview";
import StudentProfile from "./student/profiles/StudentProfile";
import StudentEditProfile from "./student/profiles/StudentEditProfile";
import MyResume from "./student/resume/MyResume";
import ResumeBuilder from "./student/resume/ResumeBuilder";
import ResumeView from "./student/resume/ResumeView";

// Recruiter pages
import RecruiterApplications from "./recruiter/applications/RecruiterApplications";
import RecruiterDashboard from "./recruiter/components/RecruiterDashboard";
import MyJobs from "./recruiter/jobs/MyJobs";
import PostJob from "./recruiter/jobs/post-job/PostJob";
import EditJob from "./recruiter/jobs/edit-job/EditJob";
import RecruiterProfile from "./recruiter/profiles/RecruiterProfile";
import RecruiterEditProfile from "./recruiter/profiles/RecruiterEditProfile";

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
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
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