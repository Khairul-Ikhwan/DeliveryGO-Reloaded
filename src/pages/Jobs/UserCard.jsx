import { useState, useEffect } from "react";
import { format } from "date-fns";
import { sendRequest } from "../../helpers/send-helper";
import "../../styles/jobs.css";

export default function UserCard({
  job,
  onButtonClick,
  onButtonClick2,
  buttonText,
  buttonText2,
  className,
}) {
  const [driverDetails, setDriverDetails] = useState(null);
  const [showAddressUnit, setShowAddressUnit] = useState(false);

  const {
    id,
    type_id,
    pickup_address_street,
    pickup_address_unit,
    pickup_address_postal,
    pickup_address_building_name,
    delivery_address_street,
    delivery_address_unit,
    delivery_address_postal,
    delivery_address_building_name,
    job_comments,
    total_distance,
    price,
    items,
    items_img,
    status,
    time,
    date,
    user_id,
    driver_id,
  } = job;

  useEffect(() => {
    if (status === "Assigned") {
      fetchDriverDetails(driver_id);
    }
    setShowAddressUnit(status === "Assigned");
  }, [status, driver_id]);

  const fetchDriverDetails = async (driverId) => {
    try {
      const data = await sendRequest(
        `/api/drivers/find-driver/${driverId}`,
        "GET"
      );
      setDriverDetails(data.driver);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const convertTo12HourFormat = (timeString) => {
    const formattedTime = format(
      new Date(`1970-01-01T${timeString}`),
      "h:mm a"
    );
    return formattedTime;
  };

  return (
    <>
      <div className={`job-card ${status === "Cancelled" ? "cancelled" : ""}`}>
        <header>
          <h3>{type_id}</h3>
          <h3>{new Date(date).toLocaleDateString()}</h3>
        </header>
        <span>
          <h3>Job ID:</h3>
          <p>{id}</p>
        </span>
        <div className="address-field">
          <span>
            <h4>Pickup Address:</h4> <br />
            {pickup_address_street} <br />
            {showAddressUnit && pickup_address_unit
              ? `${pickup_address_unit}, `
              : ""}
            S{pickup_address_postal} <br />
            {pickup_address_building_name}
          </span>
          <p>|</p>
          <span>
            <h4>Delivery Address:</h4> <br />
            {delivery_address_street} <br />
            {showAddressUnit && delivery_address_unit
              ? `${delivery_address_unit}, `
              : ""}
            S{delivery_address_postal} <br />
            {delivery_address_building_name}
          </span>
        </div>
        <div className="misc-info">
          <p>
            Distance: <br />
            {parseFloat(total_distance).toFixed(1)} km
          </p>
          <p>|</p>
          <p>
            Price: <br />${parseFloat(price).toFixed(2)}
          </p>
          <p>|</p>
          <p>
            Time: <br />
            {convertTo12HourFormat(time)}
          </p>
        </div>
        <div className="user-field">
          {status === "Assigned" || status === "Complete" ? (
            driverDetails ? (
              <>
                <p>Driver: {driverDetails.driverName}</p>
                <p>Contact: {driverDetails.driverPhone}</p>
              </>
            ) : (
              <p>Driver Details Not Available</p>
            )
          ) : status === "Cancelled" ? (
            <p>Job Cancelled</p>
          ) : (
            <p>Driver Details Available When Assigned</p>
          )}
        </div>
        {status !== "Cancelled" && (
          <div className="jobs-button">
            {buttonText ? (
              <button onClick={() => onButtonClick(job.id)}>
                {buttonText}
              </button>
            ) : null}
            {buttonText2 ? (
              <button onClick={() => onButtonClick(job.id)}>
                {buttonText2}
              </button>
            ) : null}
          </div>
        )}
      </div>
    </>
  );
}
