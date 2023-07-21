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
      console.error("Password mismatch");
      return;
    }

    try {
      const response = await sendRequest(
        "/api/drivers/create",
        "POST",
        formData
      );
      localStorage.setItem("token", response.token);
      navigate("/driver/dashboard");
      console.log("Driver created successfully");
      console.log(response);
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
        <header>Let's Sign You Up!</header>
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
            placeholder="Contact"
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
        <button type="submit" disabled={isSubmitDisabled}>
          Register
        </button>

        <p>
          <NavLink to="/driver/login">Have an account? Login Instead!</NavLink>
        </p>
      </form>
    </div>
  );
}