import React, { useEffect, useRef, useState } from "react";
import styles from "../../styles/conversation.module.css";
import ConversationItem from "./item";
import { useAppDispatch, useAppSelector } from "../../hooks/redux_hooks";
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

import {
  setIsLastPageLoadedConversation,
  targetConversation,
} from "../../store/chat/slice";
import { useSocket } from "../../hooks/use_socket";

const Conversation: React.FC = () => {
  const {
    currentConversation,
    latestMessageDialog,
    latestMessageGroup,
    isLastPageLoadedConversation,
  } = useAppSelector((state: RootState) => state.chats);
  const [loadingState, setLoadingState] = useState({
    isLoading: false,
  });
  const dispatch = useAppDispatch();
  const userId = Number(localStorage.getItem("userId"));
  const prevMessageIdRef = useRef(currentConversation?.messageId);
  const { sendSocketMessage, isReadySocket } = useSocket();
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const scrollOffsetRef = useRef<number | null>(null);

  useEffect(() => {
    const isCurrentConversationChanged =
      currentConversation?.messageId !== prevMessageIdRef.current;
    if (isCurrentConversationChanged) {
      dispatch(setIsLastPageLoadedConversation(false));
    }
  }, [latestMessageDialog, latestMessageGroup, dispatch, currentConversation]);

  useEffect(() => {
    const isCurrentConversationChanged =
      currentConversation?.messageId !== prevMessageIdRef.current;

    if (!isCurrentConversationChanged) return;

    prevMessageIdRef.current = currentConversation?.messageId;
    const isFirstLoaded = checkFirstLoad(
      currentConversation,
      latestMessageDialog,
      latestMessageGroup
    );
    if (!isReadySocket || !userId || isFirstLoaded || !currentConversation)
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
    sendSocketMessage(request);
  }, [
    currentConversation,
    isReadySocket,
    latestMessageDialog,
    latestMessageGroup,
    userId,
    sendSocketMessage,
  ]);

  useEffect(() => {
    const isFirstLoaded = checkFirstLoad(
      currentConversation,
      latestMessageDialog,
      latestMessageGroup
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
    if (!newCursor || currentConversation.cursorCreatedAt === newCursor) {
      return;
    }
    dispatch(
      targetConversation({
        ...currentConversation,
        cursorCreatedAt: newCursor,
      })
    );
  }, [
    latestMessageDialog,
    latestMessageGroup,
    currentConversation,
    dispatch,
    isLastPageLoadedConversation,
  ]);

  const messages = currentConversation?.groupId
    ? getMsgConversationGroup(currentConversation, latestMessageGroup)
    : getMsgConversationDialog(currentConversation, latestMessageDialog);

  useEffect(() => {
    if (loadingState.isLoading) return;
    const isFirstLoaded = checkFirstLoad(
      currentConversation,
      latestMessageDialog,
      latestMessageGroup
    );
    const container = messagesContainerRef.current;
    if (!container) return;
    if (scrollOffsetRef.current !== null && isFirstLoaded) {
      container.scrollTop =
        container.scrollHeight -
        container.clientHeight -
        scrollOffsetRef.current;
    } else {
      container.scrollTop = container.scrollHeight;
    }
  }, [
    latestMessageDialog,
    latestMessageGroup,
    loadingState.isLoading,
    currentConversation,
  ]);

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        messagesContainerRef.current;
      const atTop = scrollTop <= 20;

      scrollOffsetRef.current = scrollHeight - scrollTop - clientHeight;

      if (
        !currentConversation ||
        !isReadySocket ||
        loadingState.isLoading ||
        !atTop ||
        isLastPageLoadedConversation
      )
        return;

      const isFirstLoaded = checkFirstLoad(
        currentConversation,
        latestMessageDialog,
        latestMessageGroup
      );
      if (!isFirstLoaded) return;
      let request;
      if (currentConversation.companionId) {
        request = {
          ...REQ_LATEST_MESSAGE_DIALOG,
          params: {
            receiverId: currentConversation.companionId,
            limit: REQ_LATEST_MESSAGE_DIALOG.params.limit,
            cursorCreatedAt: currentConversation.cursorCreatedAt,
          },
        };
      }
      if (currentConversation.groupId) {
        request = {
          ...REQ_LATEST_MESSAGE_GROUP,
          params: {
            groupId: currentConversation.groupId,
            limit: REQ_LATEST_MESSAGE_GROUP.params.limit,
            cursorCreatedAt: currentConversation.cursorCreatedAt,
          },
        };
      }
      if (!request) return;
      setLoadingState((prev) => ({
        ...prev,
        isLoading: true,
      }));
      sendSocketMessage(request);
    }
  };

  return (
    <div className={styles.conversationWindow}>
      <div className={styles.conversationHeader}>
        <h2>{currentConversation ? currentConversation.name : ""}</h2>
      </div>
      <div
        className={styles.messagesContainer}
        ref={messagesContainerRef}
        onScroll={handleScroll}
      >
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
