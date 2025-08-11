import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { checkUser } from "@/utils/ApiFunction";

function AuthSuccess() {
  const navigate = useNavigate();

  const { data: userData, error } = useQuery({
    queryKey: ["user"],
    queryFn: checkUser,
    retry: false,
  });

  useEffect(() => {
    if (userData) {
      console.log("Check user response:", userData);
      localStorage.setItem("user", JSON.stringify(userData));
      navigate("/");
    } else if (error) {
      console.error("Error checking user:", error);
      navigate(`${process.env.FRONTEND_URL}/login`);
    }
  }, [userData, error, navigate]);

  return <div>Loading...</div>;
}

export default AuthSuccess;
