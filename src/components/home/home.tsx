import React from "react";

import Header from "../header /header";
import Sidebar from "../sidebar/sidebar";
import { MessageProcessor } from "../processor/processor";
import ConversationWindow from "../conversation/conversation";
import styles from "../../styles/home.module.css";
import { Outlet } from "react-router-dom";
import Footer from "../footer/footer";

const Home: React.FC = () => {
  return (
    <>
      <Header />
      <div className={styles.appContainer}>
        <Sidebar />
        <Outlet />
        <ConversationWindow />
      </div>
      <MessageProcessor />
      <Footer />
    </>
  );
};

export default Home;
