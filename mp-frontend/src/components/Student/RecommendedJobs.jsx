import { useEffect, useState } from "react";
import axios from "axios";

export default function RecommendedJobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    axios.get("/api/jobs/recommended")
      .then(res => setJobs(res.data));
  }, []);

  return (
    <div>
      <h2>Recommended Jobs</h2>
      {jobs.map(job => (
        <div key={job._id}>
          <h3>{job.title}</h3>
          <p>{job.company}</p>
          <p>{job.location}</p>
        </div>
      ))}
    </div>
  );
}
