import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Printer, ExternalLink, Mail, Phone, MapPin } from "lucide-react";
import { useRef } from "react";
import html2pdf from "html2pdf.js";

const ResumeView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const resumeRef = useRef();
  
  // 👇 FIXED EXTRACTION: Preview aur Saved Data dono ko handle karne ke liye
  const stateData = location.state?.resume;
  const resume = stateData?.data || stateData; 

  const handleDownload = () => {
    const element = resumeRef.current;
    const opt = {
      margin: [0.3, 0.3, 0.3, 0.3],
      filename: `${resume?.fullName || 'resume'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 3, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const formatUrl = (url) => {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
  };

  if (!resume) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow text-center border-t-4 border-black">
          <p className="text-red-500 mb-4 font-bold">No resume data found!</p>
          <button onClick={() => navigate("/student/resume")} className="bg-black text-white px-4 py-2 rounded">Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200 py-10 px-4 print:bg-white print:p-0">
      <div className="max-w-4xl mx-auto">
        {/* Top Control Bar */}
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-md border border-gray-300 print:hidden">
          <button onClick={() => navigate("/student/resume-builder")} className="flex items-center gap-2 text-gray-700 hover:text-black font-bold transition">
            <ArrowLeft size={20} /> Back to Editor
          </button>
          <div className="flex gap-3">
            <button onClick={handleDownload} className="flex items-center gap-2 bg-black text-white px-5 py-2 rounded-md font-bold hover:bg-gray-800 shadow-lg">
              <Download size={18} /> Download PDF
            </button>
            <button onClick={() => window.print()} className="flex items-center gap-2 border-2 border-black text-black px-5 py-2 rounded-md font-bold hover:bg-gray-100">
              <Printer size={18} /> Print
            </button>
          </div>
        </div>

        {/* RESUME SHEET */}
        <div ref={resumeRef} className="bg-white shadow-2xl p-10 font-serif text-black leading-snug border-t-[12px] border-black min-h-[11in] print:shadow-none print:m-0">
          
          {/* HEADER SECTION */}
          <div className="text-center border-b-2 border-black pb-6 mb-6">
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-2 text-black">{resume.fullName || resume.fn || "Your Name"}</h1>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[13px] font-sans text-gray-600">
              {(resume.email || resume.e) && <span className="flex items-center gap-1 font-semibold"><Mail size={12} className="text-black"/> {resume.email || resume.e}</span>}
              {(resume.phone || resume.ph) && <span className="flex items-center gap-1 font-semibold"><Phone size={12} className="text-black"/> {resume.phone || resume.ph}</span>}
              {(resume.address || resume.ad) && <span className="flex items-center gap-1 font-semibold"><MapPin size={12} className="text-black"/> {resume.address || resume.ad}</span>}
            </div>
            <div className="flex justify-center gap-5 mt-3 text-sm font-sans font-bold uppercase tracking-wide">
              {(resume.linkedin || resume.li) && <a href={formatUrl(resume.linkedin || resume.li)} className="text-black hover:underline">LinkedIn</a>}
              {(resume.github || resume.gh) && <a href={formatUrl(resume.github || resume.gh)} className="text-black hover:underline">GitHub</a>}
              {(resume.portfolio || resume.pf) && <a href={formatUrl(resume.portfolio || resume.pf)} className="text-black hover:underline">Portfolio</a>}
            </div>
          </div>

          {/* SUMMARY */}
          {(resume.summary || resume.sm) && (
            <div className="mb-6">
              <h2 className="text-lg font-black uppercase border-b-2 border-gray-300 mb-2 text-black">Professional Summary</h2>
              <p className="text-[14px] leading-relaxed text-justify">{resume.summary || resume.sm}</p>
            </div>
          )}

          {/* EDUCATION */}
          {(resume.education?.length > 0 || resume.ed?.length > 0) && (
            <div className="mb-6">
              <h2 className="text-lg font-black uppercase border-b-2 border-gray-300 mb-3 text-black">Education</h2>
              {(resume.education || resume.ed).map((edu, idx) => edu.institution && (
                <div key={idx} className="mb-4">
                  <div className="flex justify-between font-bold text-[15px]">
                    <span>{edu.institution}</span>
                    <span className="text-black">{edu.startYear?.split('-')[0]} — {edu.endYear?.split('-')[0] || "Present"}</span>
                  </div>
                  <div className="flex justify-between text-[14px] italic text-gray-700">
                    <span>{edu.degreeType} | {edu.state}</span>
                    {edu.cgpa && <span className="font-bold text-black font-sans text-xs">Score: {edu.cgpa}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* EXPERIENCE */}
          {(resume.experience?.length > 0 || resume.ex?.length > 0) && (
            <div className="mb-6">
              <h2 className="text-lg font-black uppercase border-b-2 border-gray-300 mb-3 text-black">Experience</h2>
              {(resume.experience || resume.ex).map((exp, idx) => (exp.company || exp.role) && (
                <div key={idx} className="mb-5">
                  <div className="flex justify-between font-bold text-[15px]">
                    <span className="uppercase">{exp.role}</span>
                    <span className="text-black">{exp.startDate} — {exp.endDate || "Present"}</span>
                  </div>
                  <div className="flex justify-between text-[14px] italic mb-1 text-gray-700 font-semibold">
                    <span>{exp.company} | {exp.location}</span>
                    {exp.projectUrl && <a href={formatUrl(exp.projectUrl)} className="text-black flex items-center gap-1 text-xs"><ExternalLink size={10} className="text-black"/> Link</a>}
                  </div>
                  <p className="text-[13.5px] whitespace-pre-line leading-relaxed pl-3 border-l-2 border-gray-300">{exp.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* TECHNICAL SKILLS */}
          {(resume.skillsCategorized || resume.skills) && (
            <div className="mb-6">
              <h2 className="text-lg font-black uppercase border-b-2 border-gray-300 mb-2 text-black">Technical Skills</h2>
              <div className="space-y-1 font-sans">
                {Object.entries(resume.skillsCategorized || resume.skills).map(([key, val]) => val && (
                  <div key={key} className="text-[14px]">
                    <strong className="capitalize text-black">{key}:</strong> <span className="text-gray-800">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STRUCTURED PROJECTS */}
          {(resume.projects?.length > 0 || resume.pr?.length > 0) && (
            <div className="mb-6">
              <h2 className="text-lg font-black uppercase border-b-2 border-gray-300 mb-2 text-black">Key Projects</h2>
              {(resume.projects || resume.pr).map((proj, idx) => proj.name && (
                <div key={idx} className="mb-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-[14.5px]">{proj.name}</h3>
                    {proj.link && <a href={formatUrl(proj.link)} className="text-black text-xs flex items-center gap-1"><ExternalLink size={10} className="text-black"/> Project Link</a>}
                  </div>
                  <p className="text-[13px] text-gray-700 leading-relaxed">{proj.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* STRUCTURED CERTIFICATIONS */}
          {(resume.certifications?.length > 0 || resume.cer?.length > 0) && (
            <div className="mb-6">
              <h2 className="text-lg font-black uppercase border-b-2 border-gray-300 mb-2 text-black">Certifications</h2>
              <div className="grid grid-cols-1 gap-2">
                {(resume.certifications || resume.cer).map((c, i) => c.courseName && (
                  <div key={i} className="flex justify-between text-[13.5px]">
                    <div>
                      <span className="font-bold">{c.courseName}</span> — <span className="italic text-gray-600">{c.platform}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-black text-xs font-semibold">{c.issueDate}</span>
                      {c.certificateLink && <a href={formatUrl(c.certificateLink)} className="text-black"><ExternalLink size={12} className="text-black"/></a>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STRUCTURED ACHIEVEMENTS & LANGUAGES */}
          <div className="grid grid-cols-2 gap-10 mt-6">
            {(resume.achievements?.length > 0 || resume.ach || resume.achievementsStructured) && (
              <div>
                <h2 className="text-base font-black uppercase border-b-2 border-gray-300 mb-2 text-black">Achievements</h2>
                <ul className="list-disc ml-4 text-[13px] space-y-1">
                  {(resume.achievementsStructured || resume.ach || resume.achievements).map((a, i) => (
                    <div key={i}>
                      {a.academic && <li><strong className="text-black">Academic:</strong> {a.academic}</li>}
                      {a.project && <li><strong className="text-black">Project:</strong> {a.project}</li>}
                      {a.technical && <li><strong className="text-black">Technical:</strong> {a.technical}</li>}
                      {a.leadership && <li><strong className="text-black">Leadership:</strong> {a.leadership}</li>}
                    </div>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <h2 className="text-base font-black uppercase border-b-2 border-gray-300 mb-2 text-black">Language Known</h2>
              <p className="text-[13px] font-semibold">{Array.isArray(resume.languagesKnown || resume.lang) ? (resume.languagesKnown || resume.lang).join(", ") : (resume.languagesKnown || resume.lang)}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ResumeView;