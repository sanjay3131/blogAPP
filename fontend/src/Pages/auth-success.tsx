import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AuthSuccess() {
  const navigate = useNavigate();

  // AuthSuccess.jsx
  useEffect(() => {
    axios
      .get(`${process.env.BACKEND_URL}/api/auth/checkUser`, {
        withCredentials: true,
      })
      .then((res) => {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/");
      })
      .catch(() => {
        navigate("/login");
      });
  }, []);

  return <div>Loading...</div>;
}

export default AuthSuccess;
