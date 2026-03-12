import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/jobs/${id}`
        );

        setJob(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchJob();
  }, [id]);

  if (!job) return <p className="p-6">Loading job...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <div className="bg-white p-8 rounded-xl shadow-md max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">

          <div>
            <h1 className="text-3xl font-bold">
              {job.title}
            </h1>

            <p className="text-gray-600">
              {job.company} • {job.location}
            </p>
          </div>

          <img
            src={
              job.companyLogo ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            className="w-16 h-16 rounded-lg border"
          />
        </div>

        {/* JOB INFO */}
        <div className="grid grid-cols-2 gap-6 text-gray-700 mb-6">

          <p><strong>Job Type:</strong> {job.jobType}</p>

          <p>
            <strong>Experience:</strong>{" "}
            {job.experienceMin} - {job.experienceMax} yrs
          </p>

          <p>
            <strong>Salary:</strong> ₹{job.salaryMin} - ₹{job.salaryMax}
          </p>

          <p>
            <strong>Vacancies:</strong> {job.vacancies}
          </p>

        </div>

        {/* DESCRIPTION */}
        <div className="mb-6">

          <h2 className="text-xl font-semibold mb-2">
            Job Description
          </h2>

          <p className="text-gray-700">
            {job.description}
          </p>

        </div>

        {/* SKILLS */}
        {job.skills?.length > 0 && (
          <div className="mb-6">

            <h2 className="text-xl font-semibold mb-3">
              Required Skills
            </h2>

            <div className="flex flex-wrap gap-2">

              {job.skills.map((skill, i) => (
                <span
                  key={i}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}

            </div>

          </div>
        )}

        {/* APPLY BUTTON */}
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Apply Now
        </button>

      </div>

    </div>
  );
}