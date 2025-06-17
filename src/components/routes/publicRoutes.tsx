import { Navigate } from "react-router-dom";
import { ROUTES } from "../../router/routes";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { PublicRouteProps } from "../../types/routes";

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isConnected } = useSelector((state: RootState) => state.socket);

  const token = localStorage.getItem("token");
  if (isConnected || token) {
    return <Navigate to={ROUTES.APP.HOME} replace />;
  }
  return children;
};

export default PublicRoute;
