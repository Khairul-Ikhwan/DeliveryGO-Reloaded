import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { sendRequest } from "../../helpers/send-helper";

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //   const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await sendRequest("/api/users/login", "POST", {
        userEmail: email,
        userPassword: password,
      });

      console.log(response);

      localStorage.setItem("token", response.token);
      alert("Login Successful!");
      // Navigate to a new page if needed
      // navigate('/dashboard');
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <h3>Hello there, let's log you in!</h3>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </>
  );
}
