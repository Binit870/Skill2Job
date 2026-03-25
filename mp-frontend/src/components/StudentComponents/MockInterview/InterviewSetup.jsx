// import { useState } from "react";
// import { generateQuestions } from "../../../services/mockInterviewService";

// export default function InterviewSetup({ setRole, setQuestions, setStep }) {
//   const [selectedRole, setSelectedRole] = useState("Frontend Developer");
//   const [loading, setLoading] = useState(false);

//   const startInterview = async () => {
//     try {
//       setLoading(true);
//       const data = await generateQuestions({
//         role: selectedRole,
//         difficulty: "medium",
//       });

//       setRole(selectedRole);
//       setQuestions(data.questions);
//       setStep("interview");
//     } catch (err) {
//       alert("Failed to generate questions");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto bg-white shadow-xl rounded-2xl p-8">
//       <h2 className="text-2xl font-bold mb-6 text-center">
//         Start Mock Interview
//       </h2>

//       <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
//   <option value="">Select a role</option>

//   <optgroup label="Development">
//     <option>Frontend Developer</option>
//     <option>Backend Developer</option>
//     <option>Full Stack Developer</option>
//   </optgroup>

//   <optgroup label="Data & AI">
//     <option>Data Scientist</option>
//     <option>Machine Learning Engineer</option>
//   </optgroup>

//   <optgroup label="Infrastructure & Cloud">
//     <option>DevOps Engineer</option>
//     <option>Cloud Engineer</option>
//   </optgroup>

//   <optgroup label="Security & Database">
//     <option>Cybersecurity Analyst</option>
//     <option>Database Administrator</option>
//   </optgroup>
// </select>

//       <button
//         onClick={startInterview}
//         className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
//       >
//         {loading ? "Generating..." : "Start Interview"}
//       </button>
//     </div>
//   );
// }
import { useState } from "react";
import { generateQuestions } from "../../../services/mockInterviewService";

export default function InterviewSetup({ setRole, setQuestions, setStep }) {
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);

  const startInterview = async () => {
    if (!selectedRole) {
      alert("Please select a role");
      return;
    }

    try {
      setLoading(true);
      const data = await generateQuestions({
        role: selectedRole,
        difficulty: "medium",
      });

      setRole(selectedRole);
      setQuestions(data.questions);
      setStep("interview");
    } catch (err) {
      alert("Failed to generate questions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-gray-200">

      {/* TITLE */}
      <h2 className="text-2xl font-bold text-center text-gray-800">
        Start Mock Interview
      </h2>

      {/* FORM */}
      <div className="mt-6 space-y-5">

        {/* LABEL */}
        <label className="block text-sm font-medium text-gray-600">
          {/* Please Select Your Desired Role */}
        </label>

        {/* DROPDOWN */}
        <select
  value={selectedRole}
  onChange={(e) => setSelectedRole(e.target.value)}
  className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 
             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
>
  <option value="" disabled hidden className="text-gray-400">
    Select a role
  </option>

  <optgroup label="Development" className="text-gray-900">
    <option className="text-gray-900">Frontend Developer</option>
    <option className="text-gray-900">Backend Developer</option>
    <option className="text-gray-900">Full Stack Developer</option>
  </optgroup>

  <optgroup label="Data & AI" className="text-gray-900">
    <option className="text-gray-900">Data Scientist</option>
    <option className="text-gray-900">Machine Learning Engineer</option>
  </optgroup>

  <optgroup label="Infrastructure & Cloud" className="text-gray-900">
    <option className="text-gray-900">DevOps Engineer</option>
    <option className="text-gray-900">Cloud Engineer</option>
  </optgroup>

  <optgroup label="Security & Database" className="text-gray-900">
    <option className="text-gray-900">Cybersecurity Analyst</option>
    <option className="text-gray-900">Database Administrator</option>
  </optgroup>
</select>

        {/* BUTTON */}
        <button
          onClick={startInterview}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium 
                     hover:bg-blue-700 active:scale-[0.98] 
                     transition-all duration-200 shadow-md"
        >
          {loading ? "Generating..." : "Start Interview"}
        </button>
      </div>
    </div>
  );
}