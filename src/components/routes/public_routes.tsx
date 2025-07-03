import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../router/routes";
import { RootState } from "../../store/store";
import { JSX, useEffect } from "react";
import { useAppSelector } from "../../hooks/redux_hooks";

const PublicRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { isConnected } = useAppSelector((state: RootState) => state.socket);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const email = localStorage.getItem("email");
  const userName = localStorage.getItem("userName");

  useEffect(() => {
    if (!isConnected && token && userId && email && userName) {
      navigate(ROUTES.APP.HOME, { replace: true });
    }
  }, [isConnected, token, userId, email, navigate]);

  return children;
};

export default PublicRoute;
