import React from "react";
import { Routes, Route } from "react-router-dom";

import LoginForm from "../auth/login_form";
import SignUpForm from "../auth/sign_up_form";
import Home from "../home/home";
import { ROUTES } from "../../router/routes";
import PrivateRoute from "./private_routes";
import PublicRoute from "./public_routes";
import Profile from "../profile/profile";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<PrivateRoute />}>
        <Route path={ROUTES.APP.HOME} element={<Home />}>
          <Route path={ROUTES.APP.PROFILE.ROOT} element={<Profile />} />
        </Route>
      </Route>

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
