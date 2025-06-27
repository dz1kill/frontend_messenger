import React, { useEffect, useRef, useState } from "react";

import styles from "../../styles/sidebar.module.css";
import ChatItem from "./item";
import { RootState } from "../../store/store";
import { useAppSelector } from "../../libs/redux/hooks";
import { REQ_LIST_LAST_MESSAGE } from "../../utils/constants";

const Sidebar: React.FC = () => {
  const chatListRef = useRef<HTMLDivElement>(null);
  const prevLengthRef = useRef(0);
  const [paginationState, setPaginationState] = useState({
    cursor: null as string | null,
    isLoading: false,
  });
  const { socket, isConnected } = useAppSelector(
    (state: RootState) => state.socket
  );
  const { lastMessagesChat, lastPageLoaded, hasFetchedOnceChat } =
    useAppSelector((state: RootState) => state.chats);

  useEffect(() => {
    if (socket && isConnected && !hasFetchedOnceChat) {
      setPaginationState((prev) => {
        socket.send(
          JSON.stringify({
            ...REQ_LIST_LAST_MESSAGE,
            params: {
              limit: REQ_LIST_LAST_MESSAGE.params.limit,
              cursorCreatedAt: null,
            },
          })
        );
        return {
          ...prev,
          isLoading: true,
        };
      });
    }
  }, [socket, isConnected, hasFetchedOnceChat]);

  const handleScroll = () => {
    if (!chatListRef.current || paginationState.isLoading || lastPageLoaded)
      return;

    const { scrollTop, scrollHeight, clientHeight } = chatListRef.current;
    const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 5;

    if (isNearBottom && socket && isConnected) {
      setPaginationState((prev) => ({
        ...prev,
        isLoading: true,
      }));
      socket.send(
        JSON.stringify({
          ...REQ_LIST_LAST_MESSAGE,
          params: {
            limit: REQ_LIST_LAST_MESSAGE.params.limit,
            cursorCreatedAt: paginationState.cursor,
          },
        })
      );
    }
  };

  useEffect(() => {
    if (!hasFetchedOnceChat) return;
    if (lastMessagesChat.length === 0) {
      setPaginationState((prev) => ({
        ...prev,
        isLoading: false,
      }));
      return;
    }
    const lastMsg = lastMessagesChat[lastMessagesChat.length - 1];

    setPaginationState((prev) => ({
      ...prev,
      isLoading: false,
      cursor: lastMsg.createdAt,
    }));

    prevLengthRef.current = lastMessagesChat.length;
  }, [lastMessagesChat, hasFetchedOnceChat]);

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h2>Chats</h2>
      </div>

      <div
        className={styles.chatList}
        onScroll={handleScroll}
        ref={chatListRef}
      >
        {lastMessagesChat.map((chat) => (
          <ChatItem key={chat.messageId} {...chat} />
        ))}
        {paginationState.isLoading && (
          <div className={styles.spinnerContainer}>
            <div className={styles.spinner}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
