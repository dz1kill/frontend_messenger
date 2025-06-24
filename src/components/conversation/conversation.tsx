import React from "react";
import styles from "../../styles/conversation.module.css";
import ConversationItem from "./item";
import { data } from "./data";
import { useAppSelector } from "../../libs/redux/hooks";
import { RootState } from "../../store/store";

const Conversation: React.FC = () => {
  const { currentConversation } = useAppSelector(
    (state: RootState) => state.chats
  );

  return (
    <div className={styles.conversationWindow}>
      <div className={styles.conversationHeader}>
        <h2>{currentConversation ? currentConversation.name : ""}</h2>
      </div>
      <ConversationItem messages={data} />
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

export default Conversation;
