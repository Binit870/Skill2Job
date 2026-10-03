import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  UploadCloud, FileText, PlusCircle, FileCheck2,
  Sparkles, ShieldCheck, ArrowRight,
} from "lucide-react";
import API from "../../utils/api";

const BUILD_FEATURES = [
  "Professional templates ready to use",
  "Guided section-by-section editor",
  "Export as PDF in one click",
  "ATS-friendly formatting",
];

const ANALYZE_FEATURES = [
  "ATS compatibility score",
  "Skill gap analysis",
  "Actionable improvement tips",
  "Keyword optimization",
];

function FeatureCard({ icon: Icon, iconAccent, title, desc, features, dotAccent, cta }) {
  return (
    <div className="bg-white border border-mist rounded-3xl shadow-card hover:shadow-card-hover transition-shadow duration-300 p-6 sm:p-8 flex flex-col">
      <div className="flex items-start gap-4 mb-6">
        <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center ${iconAccent}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="font-display text-base font-bold text-ink mb-0.5">{title}</p>
          <p className="text-xs text-ink/45 leading-relaxed">{desc}</p>
        </div>
      </div>

      <ul className="flex flex-col gap-2.5 mb-7 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2.5 text-xs text-ink/60">
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotAccent}`} />
            {f}
          </li>
        ))}
      </ul>

      {cta}
    </div>
  );
}

const MyResume = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [drag, setDrag] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a PDF file first");
    const fd = new FormData();
    fd.append("resume", file);
    try {
      setLoading(true);
      const r = await API.post("/api/resume/analyze", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Resume analyzed successfully!");
      navigate("/student/analyze", { state: r.data });
    } catch {
      toast.error("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f?.type === "application/pdf") setFile(f);
    else toast.error("Only PDF files are supported");
  };

  return (
    <div className="min-h-screen bg-paper py-8 px-4 sm:py-12 sm:px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase text-pine mb-3">
            <ShieldCheck className="w-3.5 h-3.5" /> Career Tools
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink leading-tight">
            Resume <span className="text-pine">Center</span>
          </h1>
          <p className="text-sm text-ink/50 mt-2 max-w-md leading-relaxed">
            Build a professional resume from scratch or upload yours for instant ML-powered feedback.
          </p>
        </div>

        {/* Two cards side-by-side */}
        <div className="grid sm:grid-cols-2 gap-5">
          <FeatureCard
            icon={PlusCircle}
            iconAccent="bg-pine/10 text-pine"
            title="Resume Builder"
            desc="Create a polished resume using our guided editor"
            features={BUILD_FEATURES}
            dotAccent="bg-pine/50"
            cta={
              <button
                onClick={() => navigate("/student/resume-builder")}
                className="w-full py-3.5 rounded-xl bg-ink hover:bg-ink/85 text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <PlusCircle className="w-4 h-4" /> Build My Resume
                <ArrowRight className="w-4 h-4 ml-auto" />
              </button>
            }
          />

          <FeatureCard
            icon={Sparkles}
            iconAccent="bg-gold/10 text-gold"
            title="Resume Analyzer"
            desc="Get instant feedback on your existing resume"
            features={ANALYZE_FEATURES}
            dotAccent="bg-gold"
            cta={
              <button
                onClick={() => document.getElementById("mr-drop-input")?.click()}
                className="w-full py-3.5 rounded-xl bg-pine hover:bg-moss text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <UploadCloud className="w-4 h-4" /> Upload & Analyze
              </button>
            }
          />
        </div>

        {/* Upload Zone */}
        <div className="bg-white border border-mist rounded-3xl shadow-card hover:shadow-card-hover transition-shadow duration-300 p-6 sm:p-8 mt-5">
          <div className="flex items-center gap-4 mb-7 pb-6 border-b border-mist flex-wrap">
            <div className="w-12 h-12 shrink-0 rounded-xl flex items-center justify-center bg-gold/10 text-gold">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-display text-base font-bold text-ink">Upload Your Resume</p>
              <p className="text-xs text-ink/45">PDF format · Max 5 MB</p>
            </div>
            <span className="ml-auto inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-gold bg-gold/10 border border-gold/25 px-3 py-1 rounded-full">
              <Sparkles className="w-3 h-3" /> AI Powered
            </span>
          </div>

          <label>
            <input
              id="mr-drop-input"
              type="file"
              accept=".pdf"
              hidden
              onChange={(e) => setFile(e.target.files[0])}
            />
            <div
              onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={handleDrop}
              className={`block border-[1.5px] border-dashed rounded-2xl px-6 py-10 text-center cursor-pointer transition-colors mb-5
                ${file
                  ? "border-pine border-solid bg-pine/8"
                  : drag
                    ? "border-pine bg-pine/8"
                    : "border-ink/20 bg-paper/60 hover:border-pine hover:bg-pine/8"
                }`}
            >
              <div className={`w-13 h-13 mx-auto mb-3.5 rounded-xl bg-white shadow-card flex items-center justify-center ${file ? "text-pine" : "text-ink/35"}`}>
                <UploadCloud className="w-6 h-6" />
              </div>
              {file ? (
                <>
                  <div className="inline-flex items-center gap-1.5 bg-ink text-white px-3.5 py-1.5 rounded-full text-xs font-semibold mb-1.5 max-w-full truncate">
                    <FileText className="w-3.5 h-3.5 shrink-0" /> {file.name}
                  </div>
                  <p className="text-xs text-ink/40">Click to replace · drag a new file anytime</p>
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold text-ink mb-1">Drag your PDF here</p>
                  <p className="text-xs text-ink/40">or click to browse your files</p>
                </>
              )}
            </div>
          </label>

          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className="w-full py-3.5 rounded-xl bg-pine hover:bg-moss disabled:bg-pine/40 disabled:cursor-not-allowed text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Analyzing your resume…
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Get ML Feedback
                <ArrowRight className="w-4 h-4 ml-auto" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyResume;
