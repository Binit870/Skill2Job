import { useEffect, useState } from "react";
import axios from "axios";

export default function FindJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

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
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return <p className="p-6">Loading jobs...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-3xl font-bold mb-8">Find Jobs</h2>

      {jobs.length === 0 && (
        <p className="text-gray-600">No jobs available.</p>
      )}

      <div className="grid gap-6">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="bg-white shadow-md rounded-xl p-6 border"
          >
            <h3 className="text-2xl font-semibold mb-4">
              {job.title}
            </h3>

            <div className="space-y-2 text-gray-700">

              <p>
                <strong>Company:</strong> {job.company}
              </p>

              {job.companyWebsite && (
                <p>
                  <strong>Company Website:</strong>{" "}
                  <a
                    href={job.companyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {job.companyWebsite}
                  </a>
                </p>
              )}

              {job.companyDescription && (
                <p>
                  <strong>About Company:</strong> {job.companyDescription}
                </p>
              )}

              <p>
                <strong>Location:</strong> {job.location}
              </p>

              <p>
                <strong>Job Type:</strong> {job.jobType}
              </p>

              <p>
                <strong>Experience Required:</strong>{" "}
                {job.experienceMin}{" "}
                {job.experienceMax
                  ? `- ${job.experienceMax}`
                  : "+"}{" "}
                years
              </p>

              {(job.salaryMin || job.salaryMax) && (
                <p>
                  <strong>Salary Range:</strong>{" "}
                  ₹{job.salaryMin || 0} - ₹{job.salaryMax || "Not specified"}
                </p>
              )}

              <p>
                <strong>Vacancies:</strong> {job.vacancies}
              </p>

              {job.deadline && (
                <p>
                  <strong>Application Deadline:</strong>{" "}
                  {new Date(job.deadline).toLocaleDateString()}
                </p>
              )}

              <p>
                <strong>Description:</strong> {job.description}
              </p>

              {job.skills?.length > 0 && (
                <p>
                  <strong>Required Skills:</strong>{" "}
                  {job.skills.join(", ")}
                </p>
              )}

              {job.contact?.email && (
                <p>
                  <strong>Contact Email:</strong> {job.contact.email}
                </p>
              )}

              <p className="text-sm text-gray-500 mt-2">
                Posted on:{" "}
                {new Date(job.createdAt).toLocaleDateString()}
              </p>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
