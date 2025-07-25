import { Navigate, Outlet, useNavigate } from "react-router-dom";
import React, { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../../hooks/redux_hooks";
import { RootState } from "../../store/store";
import { resetSocketState } from "../../store/socket/slice";
import { resetChatsState } from "../../store/chat/slice";
import { ROUTES } from "../../router/routes";

const PrivateRoute: React.FC = () => {
  const dispatch = useAppDispatch();
  const { error: connectionError } = useAppSelector(
    (state: RootState) => state.socket
  );
  const userId = localStorage.getItem("userId");
  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName");
  const navigate = useNavigate();

  useEffect(() => {
    if (token && userId && email && userName) {
      dispatch({ type: "socket/connect" });
    } else {
      dispatch(resetSocketState());
      dispatch(resetChatsState());
      localStorage.clear();
      <Navigate to={ROUTES.APP.LOGIN} replace />;
    }
  }, [dispatch, token, userId, email, userName]);

  useEffect(() => {
    if (connectionError?.includes("4001")) {
      dispatch(resetSocketState());
      dispatch(resetChatsState());
      navigate(ROUTES.APP.LOGIN, { replace: true });
    }
  }, [connectionError, navigate, dispatch]);

  if (!(token && userId && email && userName)) {
    return <Navigate to={ROUTES.APP.LOGIN} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
