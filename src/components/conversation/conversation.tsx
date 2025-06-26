import React, { useEffect, useRef } from "react";
import styles from "../../styles/conversation.module.css";
import ConversationItem from "./item";
import { useAppSelector } from "../../libs/redux/hooks";
import { RootState } from "../../store/store";
import {
  checkFirstLoad,
  formatDateLabel,
  getMessagesForCurrentConversationDialog,
  getMessagesForCurrentConversationGroup,
  shouldShowDate,
} from "./helper";
import {
  REQ_LATEST_MESSAGE_DIALOG,
  REQ_LATEST_MESSAGE_GROUP,
} from "../../utils/constants";

const Conversation: React.FC = () => {
  const { currentConversation, latestMessageDialog, latestMessageGroup } =
    useAppSelector((state: RootState) => state.chats);
  const { socket, isConnected } = useAppSelector(
    (state: RootState) => state.socket
  );
  const userId = Number(localStorage.getItem("userId"));
  const socketRef = useRef(socket);
  const isConnectedRef = useRef(isConnected);
  const userIdRef = useRef(userId);
  const latestMessageDialogRef = useRef(latestMessageDialog);
  const latestMessageGroupRef = useRef(latestMessageGroup);

  useEffect(() => {
    socketRef.current = socket;
    isConnectedRef.current = isConnected;
    userIdRef.current = userId;
    latestMessageDialogRef.current = latestMessageDialog;
    latestMessageGroupRef.current = latestMessageGroup;
  }, [socket, isConnected, userId, latestMessageDialog, latestMessageGroup]);

  useEffect(() => {
    const isFirstLoaded = checkFirstLoad(
      currentConversation,
      latestMessageDialogRef.current,
      latestMessageGroupRef.current
    );
    if (
      !socketRef.current ||
      !isConnectedRef.current ||
      !userIdRef.current ||
      !currentConversation ||
      isFirstLoaded
    )
      return;

    const request = currentConversation.companionId
      ? {
          ...REQ_LATEST_MESSAGE_DIALOG,
          params: {
            receiverId: currentConversation.companionId,
            limit: REQ_LATEST_MESSAGE_DIALOG.params.limit,
            cursorCreatedAt: null,
          },
        }
      : {
          ...REQ_LATEST_MESSAGE_GROUP,
          params: {
            groupId: currentConversation.groupId,
            limit: REQ_LATEST_MESSAGE_GROUP.params.limit,
            cursorCreatedAt: null,
          },
        };

    socketRef.current.send(JSON.stringify(request));
  }, [currentConversation]);

  const messages = currentConversation?.groupId
    ? getMessagesForCurrentConversationGroup(
        currentConversation,
        latestMessageGroup
      )
    : getMessagesForCurrentConversationDialog(
        currentConversation,
        latestMessageDialog
      );

  return (
    <div className={styles.conversationWindow}>
      <div className={styles.conversationHeader}>
        <h2>{currentConversation ? currentConversation.name : ""}</h2>
      </div>
      <div className={styles.messagesContainer}>
        {Array.isArray(messages) &&
          messages.map((chat, index) => (
            <React.Fragment key={chat.messageId}>
              {shouldShowDate(messages, index) && (
                <div className={styles.dateDivider}>
                  {formatDateLabel(new Date(chat.createdAt))}
                </div>
              )}
              <ConversationItem {...chat} />
            </React.Fragment>
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
