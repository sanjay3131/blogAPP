import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkUser } from "@/utils/ApiFunction";

export default function AuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyLogin = async () => {
      try {
        const response = await checkUser();
        if (response.status === 200) {
          navigate("/user");
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Verification failed:", error);
        navigate("/login");
      }
    };

    verifyLogin();
  }, []);

  return <div>Verifying login...</div>;
}
