import React from "react";

import styles from "../../styles/sidebar_item.module.css";
import { useAppDispatch } from "../../hooks/redux_hooks";
import { targetConversation } from "../../store/chat/slice";
import { FormatDataListLastMessage } from "../../types/chat";
import { formatDate } from "./helper";

const ChatItem: React.FC<FormatDataListLastMessage> = ({
  messageId,
  name,
  content,
  companionName,
  companionLastName,
  companionId,
  groupId,
  groupName,
  createdAt,
}) => {
  const dispatch = useAppDispatch();
  const handleClick = () => {
    dispatch(
      targetConversation({
        messageId,
        name,
        companionName,
        companionId,
        companionLastName,
        groupId,
        groupName,
        content,
        cursorCreatedAt: null,
        isFirstLoaded: false,
      })
    );
  };

  return (
    <div className={styles.chatItem} onClick={handleClick}>
      <div className={styles.avatar}>👤</div>
      <div className={styles.chatInfo}>
        <div className={styles.topRow}>
          <span className={styles.name}>
            {companionLastName ? `${name} ${companionLastName}` : name}
          </span>
          <span className={styles.time}>{formatDate(createdAt)}</span>
        </div>
        <div className={styles.bottomRow}>
          <p className={styles.lastMessage}>{content}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatItem;
