import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const INDIAN_STATES = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh", "Other"];

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    fn: "", e: "", ph: "", ad: "", sm: "", gh: "", li: "", pf: "",
    ed: [{ degreeType: "bachelor", institution: "", state: "", startYear: "", endYear: "", cgpa: "" }],
    ex: [""], sk: [""], pr: [""], ach: [""], lead: [""]
  });

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axios.get("http://localhost:5000/api/resume", { headers: { Authorization: `Bearer ${token}` } });
        if (res.data?.success) {
          const d = res.data.data;
          setFormData({
            fn: d.fullName || "", e: d.email || "", ph: d.phone || "", ad: d.address || "", sm: d.summary || "",
            gh: d.github || "", li: d.linkedin || "", pf: d.portfolio || "",
            ed: d.education?.length ? d.education : formData.ed,
            ex: d.experience?.length ? d.experience : [""], sk: d.skills?.length ? d.skills : [""],
            pr: d.projects?.length ? d.projects : [""], ach: d.achievements?.length ? d.achievements : [""],
            lead: d.leadership?.length ? d.leadership : [""]
          });
        }
      } catch (err) { console.log("No existing resume"); }
    };
    fetchResume();
  }, []);

  // Education Fix: Date selection update logic
  const handleEduChange = (index, field, value) => {
    const updatedEd = [...formData.ed];
    updatedEd[index] = { ...updatedEd[index], [field]: value };
    setFormData({ ...formData, ed: updatedEd });
  };

  const handleChange = (e, section, index) => {
    if (section === "main") return setFormData({ ...formData, [e.target.name]: e.target.value });
    const updated = [...formData[section]];
    updated[index] = e.target.value;
    setFormData({ ...formData, [section]: updated });
  };

  const addField = (sec, isEdu = false) => setFormData({ ...formData, [sec]: [...formData[sec], isEdu ? { degreeType: "bachelor", institution: "", state: "", startYear: "", endYear: "", cgpa: "" } : ""] });
  const removeField = (sec, index) => formData[sec].length > 1 && setFormData({ ...formData, [sec]: formData[sec].filter((_, i) => i !== index) });

  const saveResume = async () => {
    if (!formData.fn.trim() || !formData.e.trim()) return toast.error("Name & Email required!");
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const cleanData = {
        fullName: formData.fn.trim(), email: formData.e.trim(), phone: formData.ph, address: formData.ad, 
        summary: formData.sm, github: formData.gh, linkedin: formData.li, portfolio: formData.pf,
        education: formData.ed.filter(edu => edu.institution),
        experience: formData.ex.filter(i => i.trim()), skills: formData.sk.filter(i => i.trim()),
        projects: formData.pr.filter(i => i.trim()), achievements: formData.ach.filter(i => i.trim()), leadership: formData.lead.filter(i => i.trim())
      };
      const res = await axios.post("http://localhost:5000/api/resume/create", cleanData, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data?.success) { toast.success("Saved! 🎉"); navigate("/student/resume"); }
    } catch (err) { toast.error("Save failed"); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold text-indigo-700">Resume Builder</h1>
            <button onClick={() => setShowPreview(!showPreview)} className="text-xs bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full font-bold transition-all hover:bg-indigo-100">
              {showPreview ? "Hide" : "Show"} Live Preview
            </button>
          </div>

          <div className="space-y-6">
            {/* Personal Details */}
            <section>
              <h2 className="text-sm font-bold mb-3 border-b pb-1 text-gray-700">Personal Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input name="fn" placeholder="Full Name *" value={formData.fn} onChange={(e) => handleChange(e, "main")} className="border p-2 rounded text-xs w-full focus:border-indigo-500 outline-none" />
                <input name="e" placeholder="Email *" value={formData.e} onChange={(e) => handleChange(e, "main")} className="border p-2 rounded text-xs w-full focus:border-indigo-500 outline-none" />
                <input name="ph" placeholder="Phone" value={formData.ph} onChange={(e) => handleChange(e, "main")} className="border p-2 rounded text-xs w-full focus:border-indigo-500 outline-none" />
                <input name="ad" placeholder="City, State" value={formData.ad} onChange={(e) => handleChange(e, "main")} className="border p-2 rounded text-xs w-full focus:border-indigo-500 outline-none" />
                <input name="gh" placeholder="GitHub URL" value={formData.gh} onChange={(e) => handleChange(e, "main")} className="border p-2 rounded text-xs w-full focus:border-indigo-500 outline-none" />
                <input name="li" placeholder="LinkedIn URL" value={formData.li} onChange={(e) => handleChange(e, "main")} className="border p-2 rounded text-xs w-full focus:border-indigo-500 outline-none" />
                <input name="pf" placeholder="Portfolio URL (Optional)" value={formData.pf} onChange={(e) => handleChange(e, "main")} className="border p-2 rounded text-xs w-full md:col-span-2 focus:border-indigo-500 outline-none" />
              </div>
            </section>

            {/* Education Section */}
            <section>
              <h2 className="text-sm font-bold mb-3 border-b pb-1 text-gray-700">Education</h2>
              {formData.ed.map((edu, i) => (
                <div key={i} className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200 relative">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1">DEGREE TYPE</label>
                      <select value={edu.degreeType} onChange={e => handleEduChange(i, "degreeType", e.target.value)} className="w-full border p-2 rounded text-xs bg-white focus:border-indigo-500 outline-none">
                        <option value="highschool">High School</option>
                        <option value="bachelor">Bachelor's</option>
                        <option value="master">Master's</option>
                        <option value="phd">PhD</option>
                        <option value="diploma">Diploma</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1">INSTITUTION</label>
                      <input placeholder="University / School Name" value={edu.institution} onChange={e => handleEduChange(i, "institution", e.target.value)} className="w-full border p-2 rounded text-xs focus:border-indigo-500 outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1">STATE</label>
                      <select value={edu.state} onChange={e => handleEduChange(i, "state", e.target.value)} className="w-full border p-2 rounded text-xs bg-white focus:border-indigo-500 outline-none">
                        <option value="">Select State</option>
                        {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1 text-indigo-600">START DATE</label>
                      <input type="date" value={edu.startYear} onChange={e => handleEduChange(i, "startYear", e.target.value)} className="w-full border p-2 rounded text-xs focus:border-indigo-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1 text-red-500">END DATE</label>
                      <input type="date" value={edu.endYear} onChange={e => handleEduChange(i, "endYear", e.target.value)} className="w-full border p-2 rounded text-xs focus:border-indigo-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1">CGPA / %</label>
                      <input placeholder="e.g. 9.0" value={edu.cgpa} onChange={e => handleEduChange(i, "cgpa", e.target.value)} className="w-full border p-2 rounded text-xs focus:border-indigo-500 outline-none" />
                    </div>
                  </div>
                  {i > 0 && <button onClick={() => removeField("ed", i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md">×</button>}
                </div>
              ))}
              <button onClick={() => addField("ed", true)} className="text-xs text-indigo-600 font-bold hover:underline">+ Add More Education</button>
            </section>

            {/* Experience & Skills */}
            {[['ex', 'Experience'], ['sk', 'Skills'], ['pr', 'Projects']].map(([key, title]) => (
              <section key={key}>
                <h2 className="text-sm font-bold mb-2 text-gray-700">{title}</h2>
                {formData[key].map((v, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input value={v} onChange={e => handleChange(e, key, i)} className="flex-1 border p-2 rounded text-xs focus:border-indigo-500 outline-none" placeholder={`Enter your ${title.toLowerCase()}...`} />
                    {i > 0 && <button onClick={() => removeField(key, i)} className="text-red-500 font-bold px-2">×</button>}
                  </div>
                ))}
                <button onClick={() => addField(key)} className="text-xs text-indigo-600 font-bold hover:underline">+ Add {title}</button>
              </section>
            ))}

            <button onClick={saveResume} disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg active:scale-[0.98]">
              {loading ? "Saving Changes..." : "Save Resume"}
            </button>
          </div>
        </div>

        {/* Live Preview Sidebar */}
        {showPreview && (
          <div className="lg:w-1/3 h-fit sticky top-4 bg-white p-6 rounded-xl shadow-2xl border-t-4 border-indigo-600">
            <h3 className="text-center font-bold text-gray-800 mb-6 uppercase tracking-widest text-sm border-b pb-2">Resume Preview</h3>
            <div className="space-y-6 text-[11px]">
              <div className="text-center border-b pb-4">
                <h2 className="text-xl font-black uppercase tracking-tighter text-gray-900">{formData.fn || "Full Name"}</h2>
                <div className="text-gray-500 mt-1 space-y-1">
                  <p>{formData.e} {formData.ph && `| ${formData.ph}`}</p>
                  <p>{formData.ad}</p>
                  <div className="flex justify-center gap-3 text-indigo-600 font-medium mt-2">
                    {formData.gh && <span className="underline">GitHub</span>}
                    {formData.li && <span className="underline">LinkedIn</span>}
                    {formData.pf && <span className="underline">Portfolio</span>}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-indigo-600 border-b mb-3 uppercase tracking-wider">Education</h4>
                {formData.ed.map((edu, i) => edu.institution && (
                  <div key={i} className="mb-4">
                    <div className="flex justify-between items-start font-bold text-gray-800">
                      <span className="w-2/3">{edu.institution} {edu.state && `(${edu.state})`}</span>
                      <span className="text-[9px] text-gray-500">{edu.startYear} to {edu.endYear}</span>
                    </div>
                    <p className="italic text-gray-600 uppercase text-[9px] mt-1">{edu.degreeType} {edu.cgpa && `| CGPA: ${edu.cgpa}`}</p>
                  </div>
                ))}
              </div>
              
              {/* Optional: Summary Preview */}
              {formData.sm && (
                <div>
                  <h4 className="font-bold text-indigo-600 border-b mb-2 uppercase tracking-wider">Summary</h4>
                  <p className="text-gray-600 leading-relaxed text-justify">{formData.sm}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeBuilder;