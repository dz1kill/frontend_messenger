import React from "react";
import styles from "../../styles/Sidebar.module.css";
import ChatItem from "../chatItem/chatItem";
import resServer from "./data";
import { formatChatData } from "./helper";
import { ResListLastMessage } from "../../types/sidebar";

const Sidebar: React.FC = () => {
  const chatData = formatChatData(resServer);
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h2>Chats</h2>
      </div>

      <div className={styles.chatList}>
        {chatData.map((chat) => (
          <ChatItem
            key={chat.id}
            name={chat.name}
            lastMessage={chat.lastMessage}
            time={chat.time}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
