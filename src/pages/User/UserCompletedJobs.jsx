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

  return (
    <div>
      <div className="header">Ongoing Orders</div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="job-container">
          {jobs.map((job) => (
            <UserCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
