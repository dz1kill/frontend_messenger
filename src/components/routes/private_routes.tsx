import { Navigate, useNavigate } from "react-router-dom";
import React, { JSX, useEffect } from "react";
import { RootState } from "../../store/store";
import { resetSocketState } from "../../store/socket/slice";
import { ROUTES } from "../../router/routes";
import { useAppDispatch, useAppSelector } from "../../libs/redux/hooks";

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { error: connectionError } = useAppSelector(
    (state: RootState) => state.socket
  );
  const userId = localStorage.getItem("userId");
  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (token && userId && email) {
      dispatch({ type: "socket/connect" });
    }
  }, [dispatch, token, userId, email]);

  useEffect(() => {
    if (connectionError?.includes("4001")) {
      dispatch(resetSocketState());
      navigate(ROUTES.APP.LOGIN, { replace: true });
    }
  }, [connectionError, navigate, dispatch]);

  if (!token || !userId || !email) {
    return <Navigate to={ROUTES.APP.LOGIN} replace />;
  }

  return children;
};

export default PrivateRoute;
