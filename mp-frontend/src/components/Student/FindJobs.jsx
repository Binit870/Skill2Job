import { useEffect, useState } from "react";
import axios from "axios";
import JobDetails from "./JobDetails";

export default function FindJobs() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/jobs",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setJobs(res.data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <h2 className="text-3xl font-bold mb-8">Find Jobs</h2>

      <div className="space-y-5">

        {jobs.map((job) => (
          <div
            key={job._id}
            onClick={() => setSelectedJob(job)}
            className="bg-white border rounded-xl p-6 hover:shadow-md transition cursor-pointer"
          >
            <div className="flex justify-between items-start">

              {/* LEFT SIDE */}
              <div className="flex-1">

                {/* TITLE */}
                <h3 className="text-xl font-semibold text-gray-800">
                  {job.title}
                </h3>

                <p className="text-gray-600 mt-1">
                  {job.company}
                </p>

                {/* JOB META */}
                <div className="flex flex-wrap gap-5 text-sm text-gray-600 mt-3">

                  <span>💼 {job.jobType}</span>

                  <span>📍 {job.location}</span>

                  <span>
                    🧑‍💻 {job.experienceMin}+
                    yrs
                  </span>

                </div>

                {/* SKILLS */}
                {job.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {job.skills.slice(0, 4).map((skill, i) => (
                      <span
                        key={i}
                        className="bg-gray-100 px-3 py-1 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}

                    {job.skills.length > 4 && (
                      <span className="text-xs text-gray-500">
                        +{job.skills.length - 4}
                      </span>
                    )}
                  </div>
                )}

                {/* FOOTER */}
                <div className="flex items-center gap-6 mt-4 text-sm text-gray-500">

                  <span>
                    Posted{" "}
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>

                  {job.deadline && (
                    <span className="text-blue-600">
                      {Math.ceil(
                        (new Date(job.deadline) - new Date()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      days left
                    </span>
                  )}

                </div>

              </div>

              {/* RIGHT SIDE */}
              <div className="flex flex-col items-end gap-4 ml-6">

                <img
                  src={
                    job.companyLogo ||
                    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  }
                  alt="logo"
                  className="w-14 h-14 rounded-lg border object-cover"
                />

                {(job.salaryMin || job.salaryMax) && (
                  <div className="bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full">
                    ₹{job.salaryMin || "?"} - ₹{job.salaryMax || "?"}
                  </div>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedJob(job);
                  }}
                  className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  View
                </button>

              </div>

            </div>
          </div>
        ))}

      </div>

      {/* JOB DETAILS MODAL */}
      {selectedJob && (
        <JobDetails
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}

    </div>
  );
}