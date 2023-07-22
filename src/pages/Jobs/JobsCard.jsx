import "../../styles/jobs.css";
import { format } from "date-fns";

export default function JobsCard({ job, onButtonClick, buttonText }) {
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
        <header>
          <h3>{type_id}</h3>
          <h3>{new Date(date).toLocaleDateString()}</h3>
        </header>
        <span>
          <h3>Job ID:</h3>
          <p>{id}</p>
        </span>
        <div className="address-field">
          <p>
            <h4>Pickup Address:</h4> <br />
            {pickup_address_street} <br />
            {pickup_address_unit}, S{pickup_address_postal} <br />
            {pickup_address_building_name}
          </p>
          <p>|</p>
          <p>
            <h4>Delivery Address:</h4> <br />
            {delivery_address_street} <br />
            {delivery_address_unit}, S{delivery_address_postal} <br />
            {delivery_address_building_name}
          </p>
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
        <button onClick={() => onButtonClick(job.id)}>{buttonText}</button>
      </div>
    </>
  );
}
