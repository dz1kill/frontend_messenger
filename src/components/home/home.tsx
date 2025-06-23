import React from "react";

import Header from "../header /header";
import Sidebar from "../sidebar/sidebar";
import { MessageProcessor } from "../processor/processor";
import ConversationWindow from "../conversation_window/conversation_window";
import styles from "../../styles/home.module.css";

const Home: React.FC = () => {
  return (
    <>
      <MessageProcessor />
      <Header />
      <div className={styles.appContainer}>
        <Sidebar />
        <ConversationWindow />
      </div>
    </>
  );
};

export default Home;
