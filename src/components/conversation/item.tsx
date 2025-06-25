import styles from "../../styles/conversation_item.module.css";
import { FormaLatestMessageDialog } from "../../types/chat";
import { formatTime } from "./helper";

const ConversationItem: React.FC<FormaLatestMessageDialog> = ({
  sender,
  content,
  createdAt,
}) => {
  return (
    <div
      className={`${styles.message} ${
        sender === "user" ? styles.userMessage : styles.contactMessage
      }`}
    >
      <div className={styles.messageContent}>{content}</div>
      <div className={styles.time}>{formatTime(createdAt)}</div>
    </div>
  );
};

export default ConversationItem;
