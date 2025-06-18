import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import styles from "../../styles/sidebar.module.css";
import ChatItem from "../chatItem/chat_item";
import { RootState } from "../../store/store";
import { REQ_LIST_LAST_MESSAGE } from "./constants";

const Sidebar: React.FC = () => {
  const chatListRef = useRef<HTMLDivElement>(null);
  const prevLengthRef = useRef(0);
  const [infiniteScroll, setInfiniteScroll] = useState({
    cursor: null as string | null,
    isLoading: false,
  });
  const { socket, isConnected } = useSelector(
    (state: RootState) => state.socket
  );
  const { lastMessages, firstLoadingData, lastPageLoaded } = useSelector(
    (state: RootState) => state.chats
  );

  useEffect(() => {
    if (socket && isConnected && !firstLoadingData) {
      setInfiniteScroll((prev) => {
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
  }, [socket, isConnected, firstLoadingData]);

  const handleScroll = () => {
    if (!chatListRef.current || infiniteScroll.isLoading || lastPageLoaded)
      return;

    const { scrollTop, scrollHeight, clientHeight } = chatListRef.current;
    const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 5;

    if (isNearBottom && socket && isConnected) {
      setInfiniteScroll((prev) => ({
        ...prev,
        isLoading: true,
      }));
      socket.send(
        JSON.stringify({
          ...REQ_LIST_LAST_MESSAGE,
          params: {
            limit: REQ_LIST_LAST_MESSAGE.params.limit,
            cursorCreatedAt: infiniteScroll.cursor,
          },
        })
      );
    }
  };

  useEffect(() => {
    if (!firstLoadingData) return;

    const lastMsg = lastMessages[lastMessages.length - 1];

    setInfiniteScroll((prev) => ({
      ...prev,
      isLoading: false,
      cursor: lastMsg.createdAt,
    }));

    prevLengthRef.current = lastMessages.length;
  }, [lastMessages, firstLoadingData]);

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
        {lastMessages.map((chat) => (
          <ChatItem
            key={chat.id}
            name={chat.name}
            lastMessage={chat.lastMessage}
            time={chat.time}
          />
        ))}
        {infiniteScroll.isLoading && (
          <div className={styles.spinnerContainer}>
            <div className={styles.spinner}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
