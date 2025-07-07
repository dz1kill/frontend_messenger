import { Navigate, useLocation } from "react-router-dom";
import React, { useEffect } from "react";

import { ROUTES } from "../../router/routes";

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const fromPage = location.state?.from?.pathname || ROUTES.APP.HOME;

  useEffect(() => {
    if (token) {
      window.history.pushState(null, "", fromPage);
    }
  }, [token, fromPage]);

  return token ? <Navigate to={fromPage} replace /> : <>{children}</>;
};

export default PublicRoute;
