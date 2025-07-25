import React from "react";

import styles from "../../styles/sidebar_item.module.css";
import { useAppDispatch, useAppSelector } from "../../hooks/redux_hooks";
import { targetConversation } from "../../store/chat/slice";
import { FormatDataListLastMessage } from "../../types/chat";
import { formatDate } from "./helper";
import { RootState } from "../../store/store";

const ChatItem: React.FC<FormatDataListLastMessage> = ({
  name,
  content,
  companionName,
  companionLastName,
  companionId,
  groupId,
  groupName,
  createdAt,
}) => {
  const { currentConversation } = useAppSelector(
    (state: RootState) => state.chats
  );

  const dispatch = useAppDispatch();
  const handleClick = () => {
    dispatch(
      targetConversation({
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

  const isSelected =
    currentConversation &&
    ((groupId && currentConversation.groupId === groupId) ||
      (!groupId && currentConversation.companionId === companionId));

  return (
    <div
      className={`${styles.chatItem} ${isSelected ? styles.selected : ""}`}
      onClick={handleClick}
    >
      <div className={styles.avatar}> {groupId ? "👥" : "👤"}</div>
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
