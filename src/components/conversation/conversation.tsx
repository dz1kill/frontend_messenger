import React from "react";
import styles from "../../styles/conversation.module.css";

const ConversationWindow = () => {
  return (
    <div className={styles.conversationWindow}>
      <div className={styles.conversationHeader}>
        <h2>Иван Иванов</h2>
      </div>

      <div className={styles.messagesContainer}></div>

      <div className={styles.messageInput}>
        <input
          type="text"
          placeholder="Написать сообщение..."
          className={styles.inputField}
        />
        <button className={styles.sendButton}>Отправить</button>
      </div>
    </div>
  );
};

export default ConversationWindow;
