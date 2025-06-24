import React from "react";
import styles from "../../styles/sidebar_item.module.css";
import { useAppDispatch, useAppSelector } from "../../libs/redux/hooks";
import { conversation } from "../../store/chat/slice";
import { FormatDataListLastMessage } from "../../types/chat";
import { RootState } from "../../store/store";
import {
  REQ_LATEST_MESSAGE_DIALOG,
  REQ_LATEST_MESSAGE_GROUP,
} from "../../utils/constants";

const ChatItem: React.FC<FormatDataListLastMessage> = ({
  name,
  content,
  time,
  senderId,
  senderName,
  receiverId,
  receiverName,
  groupId,
  groupName,
}) => {
  const dispatch = useAppDispatch();
  const { socket, isConnected } = useAppSelector(
    (state: RootState) => state.socket
  );
  const userId = Number(localStorage.getItem("userId"));
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
        content,
      })
    );
    if (!socket || !isConnected || !userId) return;
    if (!groupId) {
      socket.send(
        JSON.stringify({
          ...REQ_LATEST_MESSAGE_DIALOG,
          params: {
            receiverId: senderId === userId ? receiverId : senderId,
            limit: REQ_LATEST_MESSAGE_DIALOG.params.limit,
            cursorCreatedAt: null,
          },
        })
      );
    } else {
      socket.send(
        JSON.stringify({
          ...REQ_LATEST_MESSAGE_GROUP,
          params: {
            groupId: groupId,
            limit: REQ_LATEST_MESSAGE_GROUP.params.limit,
            cursorCreatedAt: null,
          },
        })
      );
    }
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
