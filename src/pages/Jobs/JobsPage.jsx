import React, { useState, useEffect } from "react";
import JobsCard from "./JobsCard";
import { sendRequest } from "../../helpers/send-helper";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    try {
      setLoading(true);
      const data = await sendRequest("/api/jobs/getJobs", "GET");
      setJobs(data.jobs);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setLoading(false);
    }
  }

  const handleRefreshClick = () => {
    setLoading(true);
    fetchJobs();
  };

  async function handleAssignDriver(jobId) {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        // Handle the case where the token is not available or expired
        console.error("Invalid or expired token");
        setLoading(false);
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await sendRequest(
        "/api/jobs/assign",
        "POST",
        { jobId },
        headers
      );
      handleRefreshClick();
      setLoading(false);
    } catch (error) {
      console.error("Error assigning driver:", error);
      setLoading(false);
    }
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredJobs = filter
    ? jobs.filter((job) => job.type_id === filter)
    : jobs;

  return (
    <>
      <div>
        <h3>This is the jobs page</h3>
        <div>
          <label>Filter by Job Type:</label>
          <select value={filter} onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="Car">Car</option>
            <option value="Motorcycle">Motorcycle</option>
            <option value="Van">Van</option>
            {/* Add more job types as options */}
          </select>
        </div>
        <button onClick={handleRefreshClick} disabled={loading}>
          {loading ? "Loading..." : "Refresh Jobs"}
        </button>
        {loading ? (
          <p>Loading jobs...</p>
        ) : filteredJobs.length === 0 ? (
          <p>No Jobs available</p>
        ) : (
          <div className="job-container">
            {filteredJobs.map((job) => (
              <JobsCard
                key={job.id}
                job={job}
                onAssignDriver={handleAssignDriver}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
