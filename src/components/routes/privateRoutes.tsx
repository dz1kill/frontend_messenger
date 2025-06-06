import { Navigate } from "react-router-dom";
import { PrivateRouteProps } from "../../types/home";

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
