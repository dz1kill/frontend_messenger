import { Navigate, useNavigate } from "react-router-dom";
import React, { JSX, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { resetSocketState } from "../../store/socket/slice";
import { ROUTES } from "../../router/routes";

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
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
      <Navigate to={ROUTES.APP.LOGIN} replace />;
    }
  }, [connectionError, navigate, dispatch]);

  if (!token) {
    <Navigate to={ROUTES.APP.LOGIN} replace />;
  }

  return children;
};

export default PrivateRoute;
