import React, { useEffect, useRef, useState } from "react";
import styles from "../../styles/conversation.module.css";
import ConversationItem from "./item";
import { useAppDispatch, useAppSelector } from "../../libs/redux/hooks";
import { RootState } from "../../store/store";
import {
  checkFirstLoad,
  formatDateLabel,
  getMsgConversationDialog,
  getMsgConversationGroup,
  getNewCursor,
  shouldShowDate,
} from "./helper";
import {
  REQ_LATEST_MESSAGE_DIALOG,
  REQ_LATEST_MESSAGE_GROUP,
} from "../../utils/constants";

import { targetConversation } from "../../store/chat/slice";

const Conversation: React.FC = () => {
  const { currentConversation, latestMessageDialog, latestMessageGroup } =
    useAppSelector((state: RootState) => state.chats);
  const { socket, isConnected } = useAppSelector(
    (state: RootState) => state.socket
  );
  const [loadingState, setLoadingState] = useState({
    isLoading: false,
  });
  const dispatch = useAppDispatch();
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

    let request;
    if (currentConversation.companionId) {
      request = {
        ...REQ_LATEST_MESSAGE_DIALOG,
        params: {
          receiverId: currentConversation.companionId,
          limit: REQ_LATEST_MESSAGE_DIALOG.params.limit,
          cursorCreatedAt: null,
        },
      };
    }
    if (currentConversation.groupId) {
      request = {
        ...REQ_LATEST_MESSAGE_GROUP,
        params: {
          groupId: currentConversation.groupId,
          limit: REQ_LATEST_MESSAGE_GROUP.params.limit,
          cursorCreatedAt: null,
        },
      };
    }

    if (!request) return;

    setLoadingState((prev) => ({
      ...prev,
      isLoading: true,
    }));

    socketRef.current.send(JSON.stringify(request));
  }, [currentConversation]);

  useEffect(() => {
    const isFirstLoaded = checkFirstLoad(
      currentConversation,
      latestMessageDialogRef.current,
      latestMessageGroupRef.current
    );
    const isReadyToFetch = !!currentConversation && isFirstLoaded;

    if (!isReadyToFetch) return;

    const newCursor = getNewCursor(
      currentConversation,
      latestMessageDialog,
      latestMessageGroup
    );
    setLoadingState((prev) => ({
      ...prev,
      isLoading: false,
    }));

    if (currentConversation.cursorCreatedAt === newCursor) {
      return;
    }
    dispatch(
      targetConversation({
        ...currentConversation,
        cursorCreatedAt: newCursor,
      })
    );
  }, [latestMessageDialog, latestMessageGroup, currentConversation, dispatch]);

  const messages = currentConversation?.groupId
    ? getMsgConversationGroup(currentConversation, latestMessageGroup)
    : getMsgConversationDialog(currentConversation, latestMessageDialog);

  return (
    <div className={styles.conversationWindow}>
      <div className={styles.conversationHeader}>
        <h2>{currentConversation ? currentConversation.name : ""}</h2>
      </div>
      <div className={styles.messagesContainer}>
        {loadingState.isLoading && (
          <div className={styles.spinnerContainer}>
            <div className={styles.spinner}></div>
          </div>
        )}
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
