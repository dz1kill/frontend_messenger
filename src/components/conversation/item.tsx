import styles from "../../styles/conversation_item.module.css";
import { FormaLatestMessageDialog } from "../../types/chat";

const ConversationItem: React.FC<any> = ({ sender, content, time }) => {
  return (
    <div
      className={`${styles.message} ${
        sender === "user" ? styles.userMessage : styles.contactMessage
      }`}
    >
      <div className={styles.messageContent}>{content}</div>
      <div className={styles.time}>
        {time.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </div>
  );
};

export default ConversationItem;
