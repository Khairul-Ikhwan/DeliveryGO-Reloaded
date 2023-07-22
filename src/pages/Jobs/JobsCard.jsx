import "../../styles/jobs.css";
import { format } from "date-fns";

export default function JobsCard({ job, onAssignDriver }) {
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
  } = job;

  const convertTo12HourFormat = (timeString) => {
    const formattedTime = format(
      new Date(`1970-01-01T${timeString}`),
      "h:mm a"
    );
    return formattedTime;
  };

  return (
    <>
      <div className="job-card">
        <h3>Job ID:</h3>
        <p>{id}</p>
        <p>Job Type: {type_id}</p>
        <p>
          Pickup Address: {pickup_address_street}, {pickup_address_unit},{" "}
          {pickup_address_postal}, {pickup_address_building_name}
        </p>
        <p>
          Delivery Address: {delivery_address_street}, {delivery_address_unit},{" "}
          {delivery_address_postal}, {delivery_address_building_name}
        </p>
        <p>Total Distance: {parseFloat(total_distance).toFixed(1)} km</p>
        <p>Price: ${parseFloat(price).toFixed(2)}</p>
        <p>Time: {convertTo12HourFormat(time)}</p>
        <p>Date: {new Date(date).toLocaleDateString()}</p>
        <button onClick={() => onAssignDriver(job.id)}>Accept Job</button>
      </div>
    </>
  );
}
