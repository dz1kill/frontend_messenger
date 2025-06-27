import React from "react";
import styles from "../../styles/sidebar_item.module.css";
import { useAppDispatch } from "../../libs/redux/hooks";
import { targetConversation } from "../../store/chat/slice";
import { FormatDataListLastMessage } from "../../types/chat";

const ChatItem: React.FC<FormatDataListLastMessage> = ({
  name,
  content,
  companionName,
  companionId,
  time,
  senderId,
  senderName,
  receiverId,
  receiverName,
  groupId,
  groupName,
  cursorCreatedAt,
}) => {
  const dispatch = useAppDispatch();
  const handleClick = () => {
    dispatch(
      targetConversation({
        name,
        companionName,
        companionId,
        senderId,
        senderName,
        receiverId,
        receiverName,
        groupId,
        groupName,
        content,
        cursorCreatedAt,
      })
    );
  };

  return (
    <div className={styles.chatItem} onClick={handleClick}>
      <div className={styles.avatar}>👤</div>
      <div className={styles.chatInfo}>
        <div className={styles.topRow}>
          <span className={styles.name}>{name}</span>
          <span className={styles.time}>{time}</span>
        </div>
        <div className={styles.bottomRow}>
          <p className={styles.lastMessage}>{content}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatItem;
