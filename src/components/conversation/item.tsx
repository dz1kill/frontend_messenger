import styles from "../../styles/conversation_item.module.css";
import { ConversationItemProps } from "../../types/conversation";

const ConversationItem: React.FC<ConversationItemProps> = ({
  messages,
}: ConversationItemProps) => {
  return (
    <div className={styles.messagesContainer}>
      {messages.map((message) => (
        <div
          key={message.id}
          className={`${styles.message} ${
            message.sender === "user"
              ? styles.userMessage
              : styles.contactMessage
          }`}
        >
          <div className={styles.messageContent}>{message.text}</div>
          <div className={styles.time}>
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConversationItem;
