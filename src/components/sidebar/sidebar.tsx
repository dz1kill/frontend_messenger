import React, { useEffect, useRef, useState } from "react";

import styles from "../../styles/sidebar.module.css";
import ChatItem from "./item";
import { RootState } from "../../store/store";
import { REQ_LIST_LAST_MESSAGE } from "../../utils/constants";
import { useAppSelector } from "../../hooks/redux_hooks";
import { useSocket } from "../../hooks/use_socket";
import { mockChats } from "./data";
import SearchItem from "./search_list";

const Sidebar: React.FC = () => {
  const chatListRef = useRef<HTMLDivElement>(null);
  const prevLengthRef = useRef(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
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

  const groupChats = mockChats.filter((chat) => chat.isGroup);
  const personalChats = mockChats.filter((chat) => !chat.isGroup);
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h2>{!isSearchModalOpen && "Чаты"}</h2>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Поиск..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsSearchModalOpen(e.target.value.length > 0);
          }}
          onBlur={() => {
            setIsSearchModalOpen(false);
            setSearchQuery("");
          }}
        />
      </div>

      <div
        className={styles.chatList}
        onScroll={handleScroll}
        ref={chatListRef}
      >
        {!isSearchModalOpen &&
          lastMessagesChat.map((chat) => (
            <ChatItem key={chat.messageId} {...chat} />
          ))}
        {isSearchModalOpen && (
          <>
            {personalChats.length > 0 && (
              <>
                <div className={styles.sectionTitle}>Личные чаты</div>
                {personalChats.map((chat) => (
                  <SearchItem key={chat.id} {...chat} />
                ))}
              </>
            )}
            {groupChats.length > 0 && (
              <>
                <div className={styles.sectionTitle}>Группы</div>
                {groupChats.map((chat) => (
                  <SearchItem key={chat.id} {...chat} />
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
