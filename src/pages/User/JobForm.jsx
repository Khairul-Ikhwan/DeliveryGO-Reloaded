import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "../../styles/forms.css";
import { sendRequest } from "../../helpers/send-helper";
import dayjs from "dayjs";
import MagicButton from "../../components/Buttons/MagicButton";

export default function JobForm() {
  const [showPickup, setShowPickup] = useState(false);
  const [showDelivery, setShowDelivery] = useState(false);
  const [showPriceAndDistance, setShowPriceAndDistance] = useState(false);
  const [showMisc, setShowMisc] = useState(false);
  const [isLoadingPrice, setIsLoadingPrice] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const navigate = useNavigate();

  const [jobData, setJobData] = useState({
    jobType: "Motorcycle",
    userId: "",
    pickupStreet: "",
    pickupUnit: "",
    pickupPostal: "",
    pickupBuilding: "",
    deliveryStreet: "",
    deliveryUnit: "",
    deliveryPostal: "",
    deliveryBuilding: "",
    jobComments: "",
    totalDistance: 0,
    price: 0,
    items: "",
    itemsImg: "",
    status: "Created",
    time: "",
    date: "",
  });

  const currentDate = dayjs().format("YYYY-MM-DD");

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await sendRequest("/api/users/getUser", "POST", null, {
          Authorization: `Bearer ${token}`,
        });

        const { id } = response.user;
        setJobData((prevJobData) => ({
          ...prevJobData,
          userId: id,
        }));
      } catch (error) {
        console.error("Error fetching user details:", error);
        if (error.message === "Network Error") {
          console.error(
            "Network error occurred. Check your internet connection."
          );
        } else {
          alert("Error fetching user details:", error);
        }
      }
    };

    fetchUserDetails();
  }, []);

  const handleCheckPrice = async (e) => {
    setIsLoadingPrice(true);
    const data = {
      deliveryPostal: jobData.deliveryPostal,
      pickupPostal: jobData.pickupPostal,
      jobTypeName: jobData.jobType,
    };

    try {
      await delay(500);
      const response = await sendRequest("/api/jobs/getDistance", "POST", data);
      const { computedPrice, distanceValue } = response;
      setJobData((prevJobData) => ({
        ...prevJobData,
        price: computedPrice,
        totalDistance: distanceValue,
      }));
    } catch (error) {
      console.error("Error checking price:", error);
      if (error.message === "Network Error") {
        console.error(
          "Network error occurred. Check your internet connection."
        );
      } else {
        alert("Error checking price:", error);
      }
    } finally {
      setIsLoadingPrice(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData((prevJobData) => ({ ...prevJobData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoadingSubmit(true);

    try {
      const createJobResponse = await sendRequest(
        "/api/jobs/create",
        "POST",
        jobData
      );
      navigate("/user/dashboard/active-jobs");
    } catch (error) {
      console.error("Error creating job:", error);
      alert("Please ensure all fields are filled in");
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  return (
    <div className="forms-container">
      <form>
        <header>Delivery Request Form</header>

        <div>
          <label htmlFor="jobType">Job Type:</label>
          <select
            id="jobType"
            name="jobType"
            value={jobData.jobType}
            onChange={handleChange}
          >
            <option value="Motorcycle">Motorcycle</option>
            <option value="Car">Car</option>
            <option value="Van">Van</option>
          </select>
        </div>

        <div className="accordion">
          <div
            className="accordion-header"
            onClick={() => setShowPickup(!showPickup)}
          >
            <h3>Pickup Details</h3>
            <div className="accordion-icon">+</div>
          </div>
          {showPickup && (
            <div className="accordion-content">
              <div>
                <input
                  type="text"
                  name="pickupStreet"
                  placeholder="Pickup Street"
                  value={jobData.pickupStreet}
                  onChange={handleChange}
                />
              </div>
              <div>
                <input
                  type="text"
                  name="pickupUnit"
                  placeholder="Pickup Unit"
                  value={jobData.pickupUnit}
                  onChange={handleChange}
                />
              </div>
              <div>
                <input
                  type="text"
                  name="pickupPostal"
                  placeholder="Pickup Postal"
                  value={jobData.pickupPostal}
                  onChange={handleChange}
                />
              </div>
              <div>
                <input
                  type="text"
                  name="pickupBuilding"
                  placeholder="Pickup Building"
                  value={jobData.pickupBuilding}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}
        </div>

        <div className="accordion">
          <div
            className="accordion-header"
            onClick={() => setShowDelivery(!showDelivery)}
          >
            <h3>Delivery Details</h3>
            <div className="accordion-icon">+</div>
          </div>
          {showDelivery && (
            <div className="accordion-content">
              <div>
                <input
                  type="text"
                  name="deliveryStreet"
                  placeholder="Delivery Street"
                  value={jobData.deliveryStreet}
                  onChange={handleChange}
                />
              </div>
              <div>
                <input
                  type="text"
                  name="deliveryUnit"
                  placeholder="Delivery Unit"
                  value={jobData.deliveryUnit}
                  onChange={handleChange}
                />
              </div>
              <div>
                <input
                  type="text"
                  name="deliveryPostal"
                  placeholder="Delivery Postal"
                  value={jobData.deliveryPostal}
                  onChange={handleChange}
                />
              </div>
              <div>
                <input
                  type="text"
                  name="deliveryBuilding"
                  placeholder="Delivery Building"
                  value={jobData.deliveryBuilding}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}
        </div>

        <div className="accordion">
          <div
            className="accordion-header"
            onClick={() => setShowPriceAndDistance(!showPriceAndDistance)}
          >
            <h3>Price and Distance</h3>
            <div className="accordion-icon">
              {showPriceAndDistance ? "-" : "+"}
            </div>
          </div>
          {showPriceAndDistance && (
            <div className="accordion-content">
              <h3>Total Distance: {jobData.totalDistance}km</h3>
              <input
                type="text"
                placeholder="Your Price"
                onChange={handleChange}
                required
              />
              <h4>Recommended Price: ${jobData.price}</h4>
              <MagicButton
                label="Check Price"
                onClick={handleCheckPrice}
                isLoading={isLoadingPrice}
              />
            </div>
          )}
        </div>

        <div className="accordion">
          <div
            className="accordion-header"
            onClick={() => setShowMisc(!showMisc)}
          >
            <h3>Additional Fields</h3>
            <div className="accordion-icon">{showMisc ? "-" : "+"}</div>
          </div>
          {showMisc && (
            <div className="accordion-content">
              <div>
                <textarea
                  name="jobComments"
                  placeholder="Job Comments"
                  value={jobData.jobComments}
                  onChange={handleChange}
                />
              </div>
              <div>
                <input
                  type="text"
                  name="items"
                  placeholder="Items"
                  value={jobData.items}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Time</label>
                <input
                  type="time"
                  name="time"
                  placeholder="Time"
                  value={jobData.time}
                  onChange={handleChange}
                  step="1800"
                />
              </div>
              <div>
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  placeholder="Date"
                  value={jobData.date}
                  onChange={handleChange}
                  min={currentDate}
                />
              </div>
            </div>
          )}
        </div>

        <div className="button-container magic">
          <MagicButton
            label="Submit"
            onClick={handleSubmit}
            isLoading={isLoadingSubmit}
          />
        </div>
      </form>
    </div>
  );
}
