import { useNavigate } from "react-router-dom";

export default function LogOutButton({ path }) {
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return <button onClick={handleLogOut}>Log Out</button>;
}
