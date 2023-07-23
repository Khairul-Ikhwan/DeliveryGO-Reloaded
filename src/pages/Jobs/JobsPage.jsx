import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import JobsCard from "./JobsCard";
import { sendRequest } from "../../helpers/send-helper";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      const data = await sendRequest("/api/jobs/getJobs", "GET");

      // Sort the jobs based on time and date
      const sortedJobs = data.jobs.sort((a, b) => {
        const dateTimeA = `${a.date} ${a.time}`;
        const dateTimeB = `${b.date} ${b.time}`;
        return dateTimeA.localeCompare(dateTimeB);
      });

      setJobs(sortedJobs);
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
      navigate("/driver/dashboard/active-jobs");
    } catch (error) {
      console.error("Error assigning driver:", error);
      setLoading(false);
    }
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const isDateAfterToday = (date) => {
    const today = new Date();
    const jobDate = new Date(date);
    return jobDate >= today;
  };

  const filteredJobs = filter
    ? jobs.filter((job) => job.type_id === filter && isDateAfterToday(job.date))
    : jobs.filter((job) => isDateAfterToday(job.date));

  return (
    <>
      <div>
        <div className="utility-panel">
          <h3>All Available Jobs</h3>
          <div>
            <span>
              <label>Filter by Job Type: </label>
              <select value={filter} onChange={handleFilterChange}>
                <option value="">All</option>
                <option value="Car">Car</option>
                <option value="Motorcycle">Motorcycle</option>
                <option value="Van">Van</option>
              </select>
            </span>
            <span>
              <button onClick={handleRefreshClick} disabled={loading}>
                {loading ? <p>Loading Jobs...</p> : <p>Refresh Jobs</p>}
              </button>
            </span>
          </div>
        </div>

        {loading ? (
          <div className="loader"></div>
        ) : filteredJobs.length === 0 ? (
          <div className="loader">
            <p>No Jobs Available</p>
          </div>
        ) : (
          <div className="job-container">
            {filteredJobs.map((job) => (
              <JobsCard
                key={job.id}
                job={job}
                onButtonClick={handleAssignDriver}
                buttonText="Accept Job"
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
