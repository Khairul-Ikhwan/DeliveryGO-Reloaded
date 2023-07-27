import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { sendRequest } from "../../helpers/send-helper";
import LogOutButton from "../../components/Login/LogOutButton";
import "../../styles/details.css";

export default function DriverDetails() {
  const [driver, setDriver] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedDriver, setUpdatedDriver] = useState({});
  const navigate = useNavigate();

  async function fetchDriverDetails() {
    try {
      const token = localStorage.getItem("token");
      const response = await sendRequest(
        "/api/drivers/find-driver",
        "POST",
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      const { driverName, driverEmail, driverPhone, driverPfp } =
        response.driver;
      setDriver({ driverName, driverEmail, driverPhone, driverPfp });
      setUpdatedDriver({ driverEmail, driverPhone });
    } catch (error) {
      console.error("Error fetching driver details:", error);
      if (error.message === "Network Error") {
        console.error(
          "Network error occurred. Check your internet connection."
        );
      } else {
        navigate("/driver");
      }
    }
  }

  async function updateDriverDetails(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await sendRequest("/api/drivers/update", "POST", updatedDriver, {
        Authorization: `Bearer ${token}`,
      });
      setDriver((prevDriver) => ({ ...prevDriver, ...updatedDriver }));
      setEditMode(false);
    } catch (error) {
      console.error("Error updating driver details:", error);
      if (error.message === "Network Error") {
        console.error(
          "Network error occurred. Check your internet connection."
        );
      } else {
        alert("Update Failed");
      }
    }
  }

  useEffect(() => {
    fetchDriverDetails();
  }, [navigate]);

  if (!driver) {
    return <header>Loading...</header>;
  }

  return (
    <div className="details">
      <img src={driver.driverPfp} alt="Profile" />
      <h3>Welcome {driver.driverName}!</h3>
      {editMode ? (
        <form onSubmit={updateDriverDetails}>
          <label>
            Email:
            <input
              type="email"
              value={updatedDriver.driverEmail}
              onChange={(e) =>
                setUpdatedDriver({
                  ...updatedDriver,
                  driverEmail: e.target.value,
                })
              }
            />
          </label>
          <label>
            Phone:
            <input
              type="tel"
              value={updatedDriver.driverPhone}
              onChange={(e) =>
                setUpdatedDriver({
                  ...updatedDriver,
                  driverPhone: e.target.value,
                })
              }
            />
          </label>
          <button type="submit">Update</button>
          <button type="button" onClick={() => setEditMode(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <>
          <p>Email: {driver.driverEmail}</p>
          <p>Phone: {driver.driverPhone}</p>
          <button onClick={() => setEditMode(true)}>Edit</button>
        </>
      )}
      <LogOutButton path="/" />
    </div>
  );
}
