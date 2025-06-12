import { JSX } from "react";
import { Navigate } from "react-router-dom";

const isAdmin = () => localStorage.getItem("role") === "admin";

const AdminRoute = ({ children }: { children: JSX.Element }) => {
  return isAdmin() ? children : <Navigate to="/" />;
};

export default AdminRoute;
