import styles from "../../styles/conversation_item.module.css";
import {
  FormatLatestMessageDialog,
  FormatLatestMessageGroup,
} from "../../types/chat";
import { formatTime } from "./helper";

const ConversationItem: React.FC<
  FormatLatestMessageDialog | FormatLatestMessageGroup
> = ({ sender, content, createdAt, senderName, ...props }) => {
  const isGroup = "groupId" in props;
  const senderLastName = "senderLastName" in props ? props.senderLastName : "";
  const notification =
    isGroup && "notification" in props ? props.notification : false;

  if (notification) {
    return (
      <div className={styles.systemMessage}>
        <div className={styles.notificationContent}>{content}</div>
      </div>
    );
  }

  return (
    <div
      className={`${styles.message} ${
        sender === "user" ? styles.userMessage : styles.contactMessage
      }`}
    >
      {sender !== "user" && isGroup && (
        <div className={styles.senderName}>
          {`${senderName} ${senderLastName}`}
        </div>
      )}
      <div className={styles.messageContent}>{content}</div>
      <div className={styles.time}>{formatTime(createdAt)}</div>
    </div>
  );
};

export default ConversationItem;
