import React from "react";
import { Routes, Route } from "react-router-dom";

import LoginForm from "../auth/LoginForm";
import SignUpForm from "../auth/SignUpForm";
import Home from "../home/home";
import { ROUTES } from "../../router/routes";
import PrivateRoute from "./privateRoutes";

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
      <Route path={ROUTES.APP.LOGIN} element={<LoginForm />} />
      <Route path={ROUTES.APP.REGISTER} element={<SignUpForm />} />
    </Routes>
  );
};

export default AppRoutes;
