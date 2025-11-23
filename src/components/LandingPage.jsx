import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center">
      <h1>Welcome</h1>
      <button onClick={() => navigate("/register")}>Register =</button>
    </div>
  );
}

export default LandingPage;
