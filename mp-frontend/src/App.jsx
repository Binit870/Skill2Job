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
import Analytics from "./components/Student/Analytics";
import StudentProfile from "./components/Student/Profiles/StudentProfile";
import StudentEditProfile from "./components/Student/Profiles/StudentEditProfile";
import MockInterview from "./components/Student/MockInterview/MockInterview";

import RecruiterEditProfile from "./components/Recruiter/Profiles/RecruiterEditProfile";
import RecruiterProfile from "./components/Recruiter/Profiles/RecruiterProfile";
import RecruiterDashboard from "./components/Recruiter/RecruiterDashboard";
import PostJob from "./components/Recruiter/PostJob";
import MyJobs from "./components/Recruiter/MyJobs";

import PublicLayout from "./layouts/PublicLayout";
import StudentLayout from "./layouts/StudentLayout";
import RecruiterLayout from "./layouts/RecruiterLayout";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" reverseOrder={false} />

        <Routes>

          {/* Public Layout */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

          {/* ================= STUDENT ROUTES ================= */}
          <Route
            path="/student/profile"
            element={
              <ProtectedRoute role="student">
                <StudentProfile />
              </ProtectedRoute>
            }
          />

          <Route
            element={
              <ProtectedRoute role="student">
                <StudentLayout />
              </ProtectedRoute>
            }
          >

            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/student/jobs" element={<FindJobs />} />
            <Route path="/student/jobs/recommend" element={<RecommendedJobs />} />
            <Route path="/student/resume" element={<MyResume />} />
            <Route path="/student/analyze" element={<Analytics />} />
            <Route path="/student/edit-profile" element={<StudentEditProfile />} />
            <Route path="/student/mock-interview" element={<MockInterview />} />
          </Route>

          {/* ================= RECRUITER ROUTES ================= */}
          <Route
            path="/recruiter/profile"
            element={
              <ProtectedRoute role="recruiter">
                <RecruiterProfile />
              </ProtectedRoute>
            }
          />

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

          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

