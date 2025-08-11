import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await axios.get(
          "https://ai-blogapp.onrender.com/api/auth/checkUser",
          { withCredentials: true }
        );

        console.log("Check user response:", response.data);

        if (response.data?.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
          navigate(`/`);
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error checking user:", error);
        navigate("/login");
      }
    };

    checkUser();
  }, [navigate]);

  return <div>Loading...</div>;
}

export default AuthSuccess;
