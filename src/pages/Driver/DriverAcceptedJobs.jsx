import { useState, useEffect } from "react";
import JobsCard from "../Jobs/JobsCard";
import { sendRequest } from "../../helpers/send-helper";
import "../../styles/acceptedJobs.css";

export default function DriverAcceptedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Invalid or expired token");
        setLoading(false);
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const data = await sendRequest(
        "/api/jobs/driverJobs",
        "GET",
        null,
        headers
      );

      setJobs(data.jobs);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching accepted jobs:", error);
      setLoading(false);
    }
  }

  function handleClick() {
    alert("Button Clicked!");
  }

  return (
    <>
      <div className="header">
        <h3>Accepted Jobs</h3>
      </div>
      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <div className="header">
          <p>You haven't accepted any jobs!</p>
        </div>
      ) : (
        <div className="job-container">
          {jobs.map((job) => (
            <JobsCard
              key={job.id}
              job={job}
              buttonText={"Mark Completed"}
              onButtonClick={handleClick}
            />
          ))}
        </div>
      )}
    </>
  );
}
