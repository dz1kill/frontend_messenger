import React from "react";
import { Routes, Route } from "react-router-dom";

import LoginForm from "../user/LoginForm";
import SignUpForm from "../user/SignUpForm";
import Home from "../home/home";
import { ROUTES } from "../../utils/routes";

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
