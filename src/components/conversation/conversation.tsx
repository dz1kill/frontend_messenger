import React from "react";
import styles from "../../styles/conversation.module.css";
import ConversationItem from "./item";
import { useAppSelector } from "../../libs/redux/hooks";
import { RootState } from "../../store/store";

const Conversation: React.FC = () => {
  const { currentConversation, latestMessageDialog, latestMessageGroup } =
    useAppSelector((state: RootState) => state.chats);

  return (
    <div className={styles.conversationWindow}>
      <div className={styles.conversationHeader}>
        <h2>{currentConversation ? currentConversation.name : ""}</h2>
      </div>
      <div className={styles.messagesContainer}>
        {latestMessageGroup.map((chat) => (
          <ConversationItem key={chat.messageId} {...chat} />
        ))}
      </div>

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
