import React, { useDeferredValue, useEffect, useRef, useState } from "react";

import styles from "../../styles/sidebar.module.css";
import ChatItem from "./item";
import { RootState } from "../../store/store";
import {
  LIST_LAST_MESSAGE_PAGE,
  TYPE_LIST_LAST_MESSAGE,
} from "../../utils/constants";
import { useAppDispatch, useAppSelector } from "../../hooks/redux_hooks";
import { useSocket } from "../../hooks/use_socket";
import SearchItem from "./search_list";
import { searchUserAndGroup } from "../../store/use_cases/slice";

const Sidebar: React.FC = () => {
  const chatListRef = useRef<HTMLDivElement>(null);
  const prevLengthRef = useRef(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [loadingState, setLoadingState] = useState({
    cursor: null as string | null,
    isLoading: false,
  });
  const { lastMessagesChat, lastPageLoadedChat, hasFetchedOnceChat } =
    useAppSelector((state: RootState) => state.chats);
  const { searchUsersAndGroupResult } = useAppSelector(
    (state: RootState) => state.useCases
  );
  const { sendSocketMessage, isReadySocket } = useSocket();
  const deferredQuery = useDeferredValue(searchQuery);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isReadySocket && !hasFetchedOnceChat) {
      setLoadingState((prev) => {
        sendSocketMessage({
          type: TYPE_LIST_LAST_MESSAGE,
          params: {
            limit: LIST_LAST_MESSAGE_PAGE,
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
    if (isSearchOpen) return;
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
        type: TYPE_LIST_LAST_MESSAGE,
        params: {
          limit: LIST_LAST_MESSAGE_PAGE,
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

  useEffect(() => {
    if (deferredQuery.trim()) {
      dispatch(searchUserAndGroup({ searchText: deferredQuery }));
    }
  }, [deferredQuery, dispatch]);

  const groupChats = searchUsersAndGroupResult.filter((chat) => chat.groupId);
  const personalChats = searchUsersAndGroupResult.filter(
    (chat) => !chat.groupId
  );

  const handleBlur = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h2>{!isSearchOpen && "Чаты"}</h2>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Поиск..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsSearchOpen(e.target.value.length > 0);
          }}
        />
      </div>

      <div
        className={styles.chatList}
        onScroll={handleScroll}
        ref={chatListRef}
      >
        {lastMessagesChat.length === 0 &&
          !isSearchOpen &&
          !loadingState.isLoading && (
            <div className={styles.emptyState}>
              <p>У вас пока нет диалогов</p>
            </div>
          )}
        {!isSearchOpen &&
          lastMessagesChat.map((chat) => (
            <ChatItem key={chat.messageId} {...chat} />
          ))}
        {isSearchOpen && (
          <>
            {personalChats.length > 0 && (
              <>
                <div className={styles.sectionTitle}>Личные чаты</div>
                {personalChats.map((chat) => (
                  <SearchItem key={chat.userId} {...chat} onBlur={handleBlur} />
                ))}
              </>
            )}
            {groupChats.length > 0 && (
              <>
                <div className={styles.sectionTitle}>Группы</div>
                {groupChats.map((chat) => (
                  <SearchItem
                    key={chat.groupId}
                    {...chat}
                    onBlur={handleBlur}
                  />
                ))}
              </>
            )}

            {!groupChats?.length && !personalChats?.length && (
              <div className={styles.noResults}>Ничего не найдено</div>
            )}
          </>
        )}

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
