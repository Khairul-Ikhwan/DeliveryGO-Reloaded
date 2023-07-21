import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "../../styles/forms.css";
import { sendRequest } from "../../helpers/send-helper";
import { NavLink } from "react-router-dom";

export default function DriverSignUp() {
  useEffect(() => {
    document.title = "Driver Sign Up";

    // You can also reset the title when the component unmounts (optional)
    return () => {
      document.title = "Delivery GO | Powered by the Community";
    };
  }, []);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    driverName: "",
    driverEmail: "",
    driverPhone: "",
    driverPfp: "",
    driverPassword: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.driverPassword !== formData.confirmPassword) {
      setErrorMessage("Password mismatch");
      return;
    }

    try {
      // Check if the driver with the provided email already exists
      const checkEmailResponse = await sendRequest(
        "/api/drivers/check",
        "POST",
        { driverEmail: formData.driverEmail }
      );

      if (checkEmailResponse.message === "Driver found") {
        setErrorMessage("Email is already registered");
        return;
      } else {
        // Proceed with driver registration
        const createResponse = await sendRequest(
          "/api/drivers/create",
          "POST",
          formData
        );

        localStorage.setItem("token", createResponse.token);
        navigate("/driver/dashboard");
        console.log("Driver created successfully");
        console.log(createResponse);
      }
    } catch (error) {
      console.error("Error creating driver:", error);
    }
  };

  const isSubmitDisabled =
    formData.driverPassword !== formData.confirmPassword ||
    formData.confirmPassword === "";

  return (
    <div className="forms-container">
      <form onSubmit={handleSubmit}>
        <header>Driver Sign Up</header>
        <div>
          <input
            type="text"
            placeholder="Name"
            name="driverName"
            value={formData.driverName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email"
            name="driverEmail"
            value={formData.driverEmail}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="tel"
            placeholder="Phone Number (include +65)"
            name="driverPhone"
            value={formData.driverPhone}
            onChange={handleChange}
            required
          />
        </div>
        {/* <div>
          <input
            type="url"
            placeholder="Driver Profile Picture"
            name="driverPfp"
            value={formData.driverPfp}
            onChange={handleChange}
            required
          />
        </div> */}
        <div>
          <input
            type="password"
            placeholder="Password"
            name="driverPassword"
            value={formData.driverPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit" disabled={isSubmitDisabled}>
          Register
        </button>

        <p>
          <NavLink to="/driver/login">
            Have a driver account? Login here!
          </NavLink>
        </p>
      </form>
    </div>
  );
}
