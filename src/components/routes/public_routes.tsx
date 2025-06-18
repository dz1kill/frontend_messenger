import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../router/routes";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { JSX, useEffect } from "react";

const PublicRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { isConnected } = useSelector((state: RootState) => state.socket);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (isConnected || token) {
      navigate(ROUTES.APP.HOME, { replace: true });
    }
  }, [isConnected, token, navigate]);

  return children;
};

export default PublicRoute;
