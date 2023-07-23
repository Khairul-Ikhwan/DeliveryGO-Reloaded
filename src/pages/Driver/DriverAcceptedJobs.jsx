import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import JobsCard from "../Jobs/JobsCard";
import { sendRequest } from "../../helpers/send-helper";
import "../../styles/jobs.css";

export default function DriverAcceptedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  async function handleComplete(jobId) {
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
      const response = await sendRequest(
        "/api/jobs/complete",
        "POST",
        { jobId },
        headers
      );
      setLoading(false);
      fetchJobs();
      navigate("/driver/dashboard/active-jobs");
    } catch (error) {
      console.error("Error assigning driver:", error);
      setLoading(false);
    }
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
              onButtonClick={handleComplete}
              //   buttonText2={"Release Job"}
              //   onButtonClick2={handleClick}
            />
          ))}
        </div>
      )}
    </>
  );
}
