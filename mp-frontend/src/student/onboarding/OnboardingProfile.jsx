import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { UploadCloud, PlusCircle, ArrowRight, SkipForward, Sparkles } from "lucide-react";
import API from "../../utils/api";
import { applyAnalysisToProfile } from "../../utils/applyAnalysisToProfile";

const auth = () => ({ Authorization: `Bearer ${sessionStorage.getItem("token")}` });

export default function OnboardingProfile() {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelected = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF resume");
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("resume", file);
      const { data: analysisResult } = await API.post("/api/resume/analyze", fd, {
        headers: { ...auth(), "Content-Type": "multipart/form-data" },
      });

      // Also attach the actual resume file to the profile, in addition to
      // whatever fields applyAnalysisToProfile fills in from the analysis.
      const resumeFd = new FormData();
      resumeFd.append("resume", file);
      await API.put("/api/profile/student", resumeFd, {
        headers: { ...auth(), "Content-Type": "multipart/form-data" },
      });

      await applyAnalysisToProfile(analysisResult, auth());

      toast.success("Profile created from your resume!");
      navigate("/student-dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Couldn't process that resume. You can set up your profile manually instead.");
      navigate("/student/edit-profile");
    } finally {
      setUploading(false);
    }
  };

  const handleSkip = () => navigate("/student-dashboard");

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">

        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-pine/8 border border-pine/20 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-pine" />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink mb-2">
            Let's set up your profile
          </h1>
          <p className="text-sm text-ink/50">
            Have a resume already, or want to build one now? Either way takes a minute.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="group text-left bg-white rounded-3xl border-2 border-pine/20 hover:border-pine/40 shadow-card hover:shadow-card-hover transition-all p-6 sm:p-7 disabled:opacity-60"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              hidden
              onChange={handleFileSelected}
            />
            <div className="w-12 h-12 rounded-2xl bg-pine/8 flex items-center justify-center mb-5 group-hover:bg-pine group-hover:text-white text-pine transition-colors">
              <UploadCloud className="w-6 h-6" />
            </div>
            <h2 className="font-display text-lg font-bold text-ink mb-1.5">
              {uploading ? "Analyzing your resume…" : "Upload your resume"}
            </h2>
            <p className="text-sm text-ink/50 leading-relaxed mb-4">
              Our AI reads your resume and builds your profile automatically — skills, experience, everything.
            </p>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-pine">
              {uploading ? (
                <span className="w-3.5 h-3.5 rounded-full border-2 border-pine/30 border-t-pine animate-spin" />
              ) : (
                <>Choose PDF <ArrowRight className="w-3.5 h-3.5" /></>
              )}
            </span>
          </button>

          <button
            onClick={() => navigate("/student/resume-builder?onboarding=true")}
            disabled={uploading}
            className="group text-left bg-white rounded-3xl border border-mist hover:border-ink/20 shadow-card hover:shadow-card-hover transition-all p-6 sm:p-7 disabled:opacity-60"
          >
            <div className="w-12 h-12 rounded-2xl bg-ink/5 flex items-center justify-center mb-5 group-hover:bg-ink group-hover:text-white text-ink/50 transition-colors">
              <PlusCircle className="w-6 h-6" />
            </div>
            <h2 className="font-display text-lg font-bold text-ink mb-1.5">
              Don't have one? Build it now
            </h2>
            <p className="text-sm text-ink/50 leading-relaxed mb-4">
              Fill in a guided resume builder — we'll turn it into your profile when you're done.
            </p>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink/60">
              Start building <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>
        </div>

        <button
          onClick={handleSkip}
          disabled={uploading}
          className="w-full mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-ink/40 hover:text-ink/60 transition-colors disabled:opacity-50"
        >
          <SkipForward className="w-3.5 h-3.5" /> Skip for now
        </button>
      </div>
    </div>
  );
}