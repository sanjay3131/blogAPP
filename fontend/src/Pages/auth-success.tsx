import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../axios/axiosInstance";

export default function AuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/auth/checkUser")
      .then((res) => {
        console.log("User authenticated:", res.data);
        navigate("/"); // go to home once cookies are confirmed
      })
      .catch((err) => {
        console.error("Auth check failed", err);
        navigate("/login");
      });
  }, []);

  return <div>Verifying login...</div>;
}
