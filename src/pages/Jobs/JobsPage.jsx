import { useState, useEffect } from "react";
import JobsCard from "./JobsCard";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    try {
      setTimeout(async () => {
        const response = await fetch("/api/jobs/getJobs");
        const data = await response.json();
        setJobs(data.jobs);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setLoading(false);
    }
  }

  const handleRefreshClick = () => {
    setLoading(true);
    fetchJobs();
  };

  return (
    <>
      <div>
        <h3>This is the jobs page</h3>
        <button onClick={handleRefreshClick} disabled={loading}>
          {loading ? "Loading..." : "Refresh Jobs"}
        </button>
        {loading ? (
          <p>Loading jobs...</p>
        ) : (
          <div className="job-container">
            {jobs.map((job) => (
              <JobsCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
