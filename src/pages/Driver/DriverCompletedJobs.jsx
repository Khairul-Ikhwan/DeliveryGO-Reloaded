import { useState, useEffect } from "react";
import JobsCard from "../Jobs/JobsCard";
import { sendRequest } from "../../helpers/send-helper";

export default function DriverCompletedJobs() {
  const [completedJobs, setCompletedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompletedJobs();
  }, []);

  async function fetchCompletedJobs() {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const data = await sendRequest(
        "/api/jobs/driverComplete",
        "GET",
        null,
        headers
      );

      setCompletedJobs(data.jobs);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching completed jobs:", error);
      setLoading(false);
    }
  }

  return (
    <>
      <div className="header">
        <h3>Driver Completed Jobs</h3>
      </div>
      {loading ? (
        <p>Loading jobs...</p>
      ) : completedJobs.length === 0 ? (
        <div className="header">
          <p>No Completed Jobs</p>
        </div>
      ) : (
        <div className="job-container">
          {completedJobs.map((job) => (
            <JobsCard key={job.id} job={job} buttonText="" />
          ))}
        </div>
      )}
    </>
  );
}
