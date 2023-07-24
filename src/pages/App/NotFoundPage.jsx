import { useNavigate } from "react-router";
import { useEffect } from "react";

export default function NotFoundPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="page not-found">
      <div>
        <h1>
          {`Page not found`}
          <br />
          {`Redirecting to homepage...`}
        </h1>
      </div>
    </div>
  );
}
