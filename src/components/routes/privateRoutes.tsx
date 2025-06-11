import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PrivateRouteProps } from "../../types/home";
import { RootState } from "../../store/store";
import { resetSocketState } from "../../store/socket/slice";

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const dispatch = useDispatch();
  const { error: connectionError } = useSelector(
    (state: RootState) => state.socket
  );
  const [token] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    dispatch({ type: "socket/connect" });
  }, [dispatch]);

  useEffect(() => {
    if (connectionError?.includes("4001")) {
      dispatch(resetSocketState());
      navigate("/login", { replace: true });
    }
  }, [connectionError, navigate, dispatch]);

  if (!token) {
    navigate("/login", { replace: true });
  }

  return children;
};

export default PrivateRoute;
