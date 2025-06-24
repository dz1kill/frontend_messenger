import React from "react";
import styles from "../../styles/sidebar_item.module.css";
import { useAppDispatch } from "../../libs/redux/hooks";
import { conversation } from "../../store/chat/slice";
import { FormatDataListLastMessage } from "../../types/chat";

const ChatItem: React.FC<FormatDataListLastMessage> = (data) => {
  const {
    name,
    lastMessage,
    time,
    senderId,
    senderName,
    receiverId,
    receiverName,
    groupId,
    groupName,
  } = data;
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(
      conversation({
        name,
        senderId,
        senderName,
        receiverId,
        receiverName,
        groupId,
        groupName,
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
          <p className={styles.lastMessage}>{lastMessage}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatItem;
