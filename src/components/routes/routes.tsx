import React from "react";
import { Routes, Route } from "react-router-dom";

import LoginForm from "../auth/login_form";
import SignUpForm from "../auth/sign_up_form";
import Home from "../home/home";
import { ROUTES } from "../../router/routes";
import PrivateRoute from "./private_routes";
import PublicRoute from "./public_routes";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        index
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path={ROUTES.APP.LOGIN}
        element={
          <PublicRoute>
            <LoginForm />
          </PublicRoute>
        }
      />
      <Route
        path={ROUTES.APP.REGISTER}
        element={
          <PublicRoute>
            <SignUpForm />
          </PublicRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
