import React from "react";

import Header from "../header /header";
import Sidebar from "../sidebar/sidebar";
import { MessageProcessor } from "../processor/processor";

const Home: React.FC = () => {
  return (
    <>
      <MessageProcessor />
      <Header />
      <Sidebar />
    </>
  );
};

export default Home;
