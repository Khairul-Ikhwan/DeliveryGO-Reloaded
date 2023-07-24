import { useEffect, useState } from "react";
import UserCard from "../Jobs/UserCard";

export default function UserCompletedJobs() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/jobs/userJobs", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      // Filter jobs with status "Created" or "Assigned"
      const filteredJobs = data.jobs.filter(
        (job) => job.status === "Complete" || job.status === "Cancelled"
      );
      setJobs(filteredJobs);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setIsLoading(false);
    }
  };

  async function handleCancel(jobId) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/jobs/cancel`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to cancel job.");
      }

      // Call fetchJobs again to update the job list
      await fetchJobs();

      const data = await response.json();
      alert("Job Successfully Deleted");
      return data.job;
    } catch (error) {
      console.error("Error cancelling job:", error);
      throw error;
    }
  }

  return (
    <div>
      <div className="header">Ongoing Orders</div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="job-container">
          {jobs.map((job) => (
            <UserCard
              key={job.id}
              job={job}
            />
          ))}
        </div>
      )}
    </div>
  );
}
