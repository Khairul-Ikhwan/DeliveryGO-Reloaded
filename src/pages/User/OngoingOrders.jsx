import { useEffect, useState } from "react";
import UserCard from "../Jobs/UserCard";

export default function OngoingOrders() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
        setJobs(data.jobs);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  async function handleCancel() {
    alert("Job Cancelled");
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
              buttonText={"Cancel Order"}
              onButtonClick={handleCancel}
            />
          ))}
        </div>
      )}
    </div>
  );
}
