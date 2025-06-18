import React from "react";
import styles from "../../styles/chat_item.module.css";

interface ChatItemProps {
  name: string;
  lastMessage: string;
  time: string;
}

const ChatItem: React.FC<ChatItemProps> = ({ name, lastMessage, time }) => {
  return (
    <div className={styles.chatItem}>
      <div className={styles.avatar}>👤</div>
      <div className={styles.chatInfo}>
        <div className={styles.topRow}>
          <span className={styles.name}>{name}</span>
          <span className={styles.time}>{time}</span>
        </div>
        <div className={styles.bottomRow}>
          <p className={styles.lastMessage}>{lastMessage}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatItem;
