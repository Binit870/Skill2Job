import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { lazy, Suspense } from "react";
import { AuthProvider } from "./context/AuthContext";

// Public pages — LandingPage is the most common entry point (and what
// crawlers/first-time visitors see), so it stays in the main bundle.
// Everything else is lazy-loaded per route to keep the initial JS payload
// small, which improves first paint / Core Web Vitals (a real SEO factor).
import LandingPage from "./public/LandingPage";
import ScrollToTop from "./public/ScrollToTop";
const About = lazy(() => import("./public/About"));
const Contact = lazy(() => import("./public/Contact"));
const Faq = lazy(() => import("./public/Faq"));
const Features = lazy(() => import("./public/Features"));
const HowItWorks = lazy(() => import("./public/HowItWorks"));
const PrivacyPolicy = lazy(() => import("./public/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./public/TermsOfService"));

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import StudentLayout from "./layouts/StudentLayout";
import RecruiterLayout from "./layouts/RecruiterLayout";

//Routes
import ProtectedRoute from "./routes/ProtectedRoute";
import NotFound from "./routes/NotFound";

// Auth pages
const Login = lazy(() => import("./auth/Login"));
const Signup = lazy(() => import("./auth/Signup"));
const ForgotPassword = lazy(() => import("./auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./auth/ResetPassword"));

// Student pages
const Analytics = lazy(() => import("./student/analytics/Analytics"));
const MyApplications = lazy(() => import("./student/applications/MyApplications"));
const StudentDashboard = lazy(() => import("./student/dashboard/StudentDashboard"));
const FindJobs = lazy(() => import("./student/jobs/FindJobs"));
const SavedJobs = lazy(() => import("./student/jobs/SavedJobs"));
const JobDetails = lazy(() => import("./student/jobs/JobDetails"));
const MockAssessment = lazy(() => import("./student/mock-assessment/MockAssessment"));
const MockInterview = lazy(() => import("./student/mock-interview/MockInterview"));
const StudentProfile = lazy(() => import("./student/profiles/StudentProfile"));
const StudentEditProfile = lazy(() => import("./student/profiles/StudentEditProfile"));
const MyResume = lazy(() => import("./student/resume/MyResume"));
const ResumeBuilder = lazy(() => import("./student/resume/ResumeBuilder"));
const ResumeView = lazy(() => import("./student/resume/ResumeView"));
const OnboardingProfile = lazy(() => import("./student/onboarding/OnboardingProfile"));

// Recruiter pages
const RecruiterApplications = lazy(() => import("./recruiter/applications/RecruiterApplications"));
const RecruiterAnalytics = lazy(() => import("./recruiter/analytics/RecruiterAnalytics"));
const RecruiterDashboard = lazy(() => import("./recruiter/components/RecruiterDashboard"));
const MyJobs = lazy(() => import("./recruiter/jobs/MyJobs"));
const PostJob = lazy(() => import("./recruiter/jobs/post-job/PostJob"));
const EditJob = lazy(() => import("./recruiter/jobs/edit-job/EditJob"));
const RecruiterProfile = lazy(() => import("./recruiter/profiles/RecruiterProfile"));
const RecruiterEditProfile = lazy(() => import("./recruiter/profiles/RecruiterEditProfile"));

// Shown briefly while a lazy-loaded route's JS chunk downloads
const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-paper">
    <div className="w-8 h-8 border-2 border-pine border-t-transparent rounded-full animate-spin" />
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        {/* Toast notifications */}
        <Toaster position="top-right" reverseOrder={false} />

        <Suspense fallback={<RouteFallback />}>
          <Routes>
            {/* ========== PUBLIC ROUTES ========== */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/features" element={<Features />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/contact" element={<Contact />} />

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
            <Route path="/student/onboarding" element={
              <ProtectedRoute role="student">
                <OnboardingProfile />
              </ProtectedRoute>
            } />

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
              <Route path="/student/saved-jobs" element={<SavedJobs />} />
              <Route path="/student/edit-profile" element={<StudentEditProfile />} />

              <Route path="/student/jobs/:id" element={<JobDetails />} />
              <Route path="/student/resume" element={<MyResume />} />
              <Route path="/student/resume-builder" element={<ResumeBuilder />} />
              <Route path="/student/analyze" element={<Analytics />} />
              <Route path="/student/mock-interview" element={<MockInterview />} />
              <Route path="/student/mock-assessment" element={<MockAssessment />} />
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
              <Route path="/recruiter/analytics" element={<RecruiterAnalytics />} />
            </Route>

            {/* 404 Page - catch all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}