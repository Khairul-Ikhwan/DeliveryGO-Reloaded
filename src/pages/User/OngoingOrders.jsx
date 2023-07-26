import { useEffect, useState } from "react";
import UserCard from "../Jobs/UserCard";
import { sendRequest } from "../../helpers/send-helper";

export default function OngoingOrders() {
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
        (job) => job.status === "Created" || job.status === "Assigned"
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
      console.log(jobId);
      const notifyDriverResponse = await fetch(`/api/emails/notifyDriver`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobID: jobId }),
      });

      const notifyDriverData = await notifyDriverResponse.json();

      const driverEmail = {
        email: notifyDriverData.driverEmail, // Get the user email from the response
        subject: "An Order Has Been Cancelled!",
        htmlPath: "controllers/emailTemplates/orderCancelledDriver.html",
      };

      const sendDriverEmail = await sendRequest(
        "/api/emails/sendEmail",
        "POST",
        driverEmail
      );

      const token = localStorage.getItem("token");
      const response = await fetch(`/api/jobs/cancel`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobId }),
      });

      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const checkResponse = await sendRequest(
        "/api/users/getUser",
        "POST",
        null,
        headers
      );

      const emailData = {
        email: checkResponse.user.userEmail, // Get the user email from the response
        subject: "Your Order Has Been Cancelled!",
        htmlPath: "controllers/emailTemplates/orderCancelledUser.html",
      };

      const sendEmail = await sendRequest(
        "/api/emails/sendEmail",
        "POST",
        emailData
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to cancel job.");
      }

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
      ) : jobs.length === 0 ? (
        <div className="header sub">No ongoing orders to display.</div>
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
