import { checkUser } from "@/utils/ApiFunction";
import { JSX, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    checkUser()
      .then(() => setIsAuth(true))
      .catch(() => setIsAuth(false));
  }, []);

  if (isAuth === null) return <div>Loading...</div>;
  return isAuth ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
