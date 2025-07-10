import React, { useEffect, useRef, useState } from "react";

import styles from "../../styles/sidebar.module.css";

import ChatItem from "./item";
import { RootState } from "../../store/store";
import { REQ_LIST_LAST_MESSAGE } from "../../utils/constants";
import { useAppSelector } from "../../hooks/redux_hooks";
import { useSocket } from "../../hooks/use_socket";
import SearchModal from "./search_modal";

const Sidebar: React.FC = () => {
  const chatListRef = useRef<HTMLDivElement>(null);
  const prevLengthRef = useRef(0);
  const [loadingState, setLoadingState] = useState({
    cursor: null as string | null,
    isLoading: false,
  });
  const { lastMessagesChat, lastPageLoadedChat, hasFetchedOnceChat } =
    useAppSelector((state: RootState) => state.chats);
  const { sendSocketMessage, isReadySocket } = useSocket();

  useEffect(() => {
    if (isReadySocket && !hasFetchedOnceChat) {
      setLoadingState((prev) => {
        sendSocketMessage({
          ...REQ_LIST_LAST_MESSAGE,
          params: {
            limit: REQ_LIST_LAST_MESSAGE.params.limit,
            cursorCreatedAt: null,
          },
        });
        return {
          ...prev,
          isLoading: true,
        };
      });
    }
  }, [isReadySocket, hasFetchedOnceChat, sendSocketMessage]);

  const handleScroll = () => {
    if (!chatListRef.current || loadingState.isLoading || lastPageLoadedChat)
      return;
    const { scrollTop, scrollHeight, clientHeight } = chatListRef.current;
    const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 5;
    if (isNearBottom && isReadySocket) {
      setLoadingState((prev) => ({
        ...prev,
        isLoading: true,
      }));
      sendSocketMessage({
        ...REQ_LIST_LAST_MESSAGE,
        params: {
          limit: REQ_LIST_LAST_MESSAGE.params.limit,
          cursorCreatedAt: loadingState.cursor,
        },
      });
    }
  };

  useEffect(() => {
    if (!hasFetchedOnceChat) return;
    if (lastMessagesChat.length === 0) {
      setLoadingState((prev) => ({
        ...prev,
        isLoading: false,
      }));
      return;
    }
    const lastMsg = lastMessagesChat[lastMessagesChat.length - 1];
    setLoadingState((prev) => ({
      ...prev,
      isLoading: false,
      cursor: lastMsg.createdAt,
    }));
    prevLengthRef.current = lastMessagesChat.length;
  }, [lastMessagesChat, hasFetchedOnceChat]);

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h2>Чаты</h2>
        <SearchModal />
      </div>

      <div
        className={styles.chatList}
        onScroll={handleScroll}
        ref={chatListRef}
      >
        {lastMessagesChat.map((chat) => (
          <ChatItem key={chat.messageId} {...chat} />
        ))}
        {loadingState.isLoading && (
          <div className={styles.spinnerContainer}>
            <div className={styles.spinner}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
