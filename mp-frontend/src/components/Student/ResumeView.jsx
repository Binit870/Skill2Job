import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Printer, Github, Linkedin, Globe } from "lucide-react";
import { useRef } from "react";
import html2pdf from "html2pdf.js";

const ResumeView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const resumeRef = useRef();
  
  const stateData = location.state?.resume;
  const resume = stateData?.data || stateData;

  const handleDownload = () => {
    const element = resumeRef.current;
    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `${resume?.fullName || 'resume'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, letterRendering: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const formatUrl = (url) => {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
  };

  const degreeLabels = {
    highschool: "High School",
    bachelor: "Bachelor's",
    master: "Master's",
    phd: "PhD",
    diploma: "Diploma",
    other: "Other"
  };

  if (!resume) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-red-500 mb-4">No resume data found!</p>
          <button onClick={() => navigate("/student/resume")} className="bg-indigo-600 text-white px-4 py-2 rounded">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Action Buttons */}
        <div className="flex justify-between items-center mb-4 bg-white p-4 rounded-lg shadow">
          <button onClick={() => navigate("/student/resume")} className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
            <ArrowLeft size={20} /> Back
          </button>
          <div className="flex gap-2">
            <button onClick={handleDownload} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              <Download size={18} /> Download PDF
            </button>
            <button onClick={() => window.print()} className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
              <Printer size={18} /> Print
            </button>
          </div>
        </div>

        {/* Resume Template */}
        <div ref={resumeRef} className="bg-white rounded-xl shadow-lg p-8 print:p-4 font-sans max-w-3xl mx-auto">
          
          {/* Name */}
          <div className="text-center mb-2">
            <h1 className="text-3xl font-bold text-gray-900 uppercase">
              {resume.fullName?.toUpperCase() || "YOUR NAME"}
            </h1>
          </div>

          {/* Contact Info */}
          <div className="text-center text-sm text-gray-600 mb-4">
            {[resume.address, resume.phone, resume.email].filter(Boolean).join(' | ')}
          </div>

          {/* Social Links */}
          {(resume.github || resume.linkedin || resume.portfolio) && (
            <div className="flex justify-center gap-6 mb-6 flex-wrap border-t border-b border-gray-200 py-4">
              {resume.github && (
                <a href={formatUrl(resume.github)} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-700 hover:text-indigo-600 transition-colors group">
                  <Github size={18} className="text-gray-700 group-hover:text-indigo-600" />
                  <span className="border-b border-dotted border-gray-400">GitHub</span>
                </a>
              )}
              {resume.linkedin && (
                <a href={formatUrl(resume.linkedin)} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-colors group">
                  <Linkedin size={18} className="text-blue-600 group-hover:text-blue-700" />
                  <span className="border-b border-dotted border-gray-400">LinkedIn</span>
                </a>
              )}
              {resume.portfolio && (
                <a href={formatUrl(resume.portfolio)} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-700 hover:text-purple-600 transition-colors group">
                  <Globe size={18} className="text-purple-600 group-hover:text-purple-700" />
                  <span className="border-b border-dotted border-gray-400">Portfolio</span>
                </a>
              )}
            </div>
          )}

          {/* Summary */}
          {resume.summary && (
            <>
              <div className="mb-6">
                <h2 className="text-base font-bold text-gray-800 uppercase tracking-wide mb-3">PROFESSIONAL SUMMARY</h2>
                <p className="text-sm text-gray-700 leading-relaxed">{resume.summary}</p>
              </div>
              <hr className="border-t border-gray-300 my-4" />
            </>
          )}

          {/* Education */}
          {resume.education?.length > 0 && resume.education[0]?.institution && (
            <>
              <div className="mb-6">
                <h2 className="text-base font-bold text-gray-800 uppercase tracking-wide mb-3">EDUCATION</h2>
                {resume.education.map((edu, idx) => (
                  <div key={`view-edu-${idx}`} className="mb-4">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-gray-800">
                        {degreeLabels[edu.degreeType] || edu.degreeType} {edu.institution && `in ${edu.institution}`}
                      </h3>
                      {(edu.startYear || edu.endYear) && (
                        <span className="text-sm text-gray-600">{edu.startYear} - {edu.endYear}</span>
                      )}
                    </div>
                    {edu.cgpa && <p className="text-sm text-gray-600 mt-1">CGPA: {edu.cgpa}</p>}
                  </div>
                ))}
              </div>
              <hr className="border-t border-gray-300 my-4" />
            </>
          )}

          {/* Experience */}
          {resume.experience?.length > 0 && resume.experience[0] && (
            <>
              <div className="mb-6">
                <h2 className="text-base font-bold text-gray-800 uppercase tracking-wide mb-3">EXPERIENCE</h2>
                {resume.experience.map((exp, idx) => (
                  <div key={`view-exp-${idx}`} className="mb-3">
                    <p className="text-sm text-gray-700">• {exp}</p>
                  </div>
                ))}
              </div>
              <hr className="border-t border-gray-300 my-4" />
            </>
          )}

          {/* Skills */}
          {resume.skills?.length > 0 && resume.skills[0] && (
            <>
              <div className="mb-6">
                <h2 className="text-base font-bold text-gray-800 uppercase tracking-wide mb-3">SKILLS</h2>
                <div className="flex flex-wrap gap-2">
                  {resume.skills.map((skill, idx) => (
                    <span key={`view-skill-${idx}`} className="bg-gray-100 px-3 py-1.5 rounded-full text-sm text-gray-700">{skill}</span>
                  ))}
                </div>
              </div>
              <hr className="border-t border-gray-300 my-4" />
            </>
          )}

          {/* Projects */}
          {resume.projects?.length > 0 && resume.projects[0] && (
            <>
              <div className="mb-6">
                <h2 className="text-base font-bold text-gray-800 uppercase tracking-wide mb-3">PROJECTS</h2>
                {resume.projects.map((proj, idx) => (
                  <div key={`view-proj-${idx}`} className="mb-3">
                    <p className="text-sm text-gray-700">• {proj}</p>
                  </div>
                ))}
              </div>
              <hr className="border-t border-gray-300 my-4" />
            </>
          )}

          {/* Achievements */}
          {resume.achievements?.length > 0 && resume.achievements[0] && (
            <>
              <div className="mb-6">
                <h2 className="text-base font-bold text-gray-800 uppercase tracking-wide mb-3">ACHIEVEMENTS</h2>
                {resume.achievements.map((ach, idx) => (
                  <div key={`view-ach-${idx}`} className="mb-3">
                    <p className="text-sm text-gray-700">• {ach}</p>
                  </div>
                ))}
              </div>
              <hr className="border-t border-gray-300 my-4" />
            </>
          )}

          {/* Leadership */}
          {resume.leadership?.length > 0 && resume.leadership[0] && (
            <>
              <div className="mb-6">
                <h2 className="text-base font-bold text-gray-800 uppercase tracking-wide mb-3">LEADERSHIP</h2>
                {resume.leadership.map((lead, idx) => (
                  <div key={`view-lead-${idx}`} className="mb-3">
                    <p className="text-sm text-gray-700">• {lead}</p>
                  </div>
                ))}
              </div>
              <hr className="border-t border-gray-300 my-4" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeView;