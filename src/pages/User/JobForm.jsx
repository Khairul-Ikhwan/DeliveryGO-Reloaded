import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "../../styles/forms.css";
import { sendRequest } from "../../helpers/send-helper";
import dayjs from "dayjs";
import MagicButton from "../../components/Buttons/MagicButton";
import Search from "../../components/Blocks/PlacesAutocomplete";

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
    recPrice: "",
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
        recPrice: computedPrice,
        totalDistance: distanceValue,
      }));
    } catch (error) {
      console.error("Error checking price:", error);
      if (error.message === "Network Error") {
        console.error(
          "Network error occurred. Check your internet connection."
        );
      } else {
        alert("Please ensure postal codes are correct!");
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

    const checkUser = async (token) => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = await sendRequest(
          "/api/users/getUser",
          "POST",
          null,
          headers
        );

        const emailData = {
          email: response.user.userEmail, // Get the user email from the response
          subject: "Your Order Has Been Created!",
          htmlPath: "controllers/emailTemplates/orderCreated.html",
        };

        const sendEmail = await sendRequest(
          "/api/emails/sendEmail",
          "POST",
          emailData
        );

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

    const token = localStorage.getItem("token");
    if (token) {
      checkUser(token);
    } else {
      console.error("No token found in local storage");
      setIsLoadingSubmit(false);
    }
  };

  const handlePickupSuggestionSelected = (street, postal, building) => {
    setJobData((prevJobData) => ({
      ...prevJobData,
      pickupStreet: street,
      pickupPostal: postal,
    }));
  };

  const handleDeliverySuggestionSelected = (street, postal, building) => {
    setJobData((prevJobData) => ({
      ...prevJobData,
      deliveryStreet: street,
      deliveryPostal: postal,
    }));
  };

  const handlePickupValueChange = (value) => {
    setJobData((prevJobData) => ({
      ...prevJobData,
      pickupStreet: value,
    }));
  };

  const handleDeliveryValueChange = (value) => {
    setJobData((prevJobData) => ({
      ...prevJobData,
      deliveryStreet: value,
    }));
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
                <label>Street Address</label>
                <Search
                  onSuggestionSelected={handlePickupSuggestionSelected}
                  onValueChange={handlePickupValueChange}
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
                <label>Street Address</label>
                <Search
                  onSuggestionSelected={handleDeliverySuggestionSelected}
                  onValueChange={handleDeliveryValueChange}
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
                type="number"
                name="price"
                placeholder="Your Price"
                onChange={handleChange}
                value={jobData.price}
                required
              />
              <h4>Recommended Price: ${jobData.recPrice}</h4>
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
