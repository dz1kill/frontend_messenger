import React from "react";
import { Routes, Route } from "react-router-dom";

import LoginForm from "../login/LoginForm";
import SignUpForm from "../login/SignUpForm";
import Home from "../home/home";
import { ROUTES } from "../../router/routes";

const App = () => {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path={`${ROUTES.LOGIN}`} element={<LoginForm />} />
      <Route path={`${ROUTES.REGISTER}`} element={<SignUpForm />} />
    </Routes>
  );
};

export default App;
