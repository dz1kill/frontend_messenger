import React, { useDeferredValue, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

import styles from "../../styles/add_member_group.module.css";
import { useAppDispatch, useAppSelector } from "../../hooks/redux_hooks";
import { RootState } from "../../store/store";
import {
  searchUsersByNameOrEmail,
  clearSearchResults,
} from "../../store/use_cases/slice";
import { ItemSearchUsers } from "../../types/use_cases_store";
import { TYPE_ADD_MEMBER_TO_GROUP } from "../../utils/constants";
import { useSocket } from "../../hooks/use_socket";
import {
  isErrorReceived,
  latestMessageGroupReceived,
  listLastMessageReceived,
} from "../../store/chat/slice";
import {
  formatGroupMessage,
  formatGroupMessageChat,
} from "../processor/helper";
import {
  AddMemberGroupProps,
  ApiStatusAddMemberGroupProps,
} from "../../types/conversation";

const AddMemberGroup: React.FC<AddMemberGroupProps> = ({
  onClose,
  onCancel,
}) => {
  const dispatch = useAppDispatch();
  const { searchUsersResult } = useAppSelector(
    (state: RootState) => state.useCases
  );
  const { currentConversation } = useAppSelector(
    (state: RootState) => state.chats
  );
  const { socket, isConnected } = useAppSelector((state) => state.socket);
  const { sendSocketMessage, isReadySocket } = useSocket();

  const [apiStatus, setApiStatus] = useState<ApiStatusAddMemberGroupProps>({
    isLoading: false,
    isErrorServer: false,
  });
  const loaderTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<ItemSearchUsers | null>(
    null
  );
  const deferredQuery = useDeferredValue(searchQuery);

  const handleSelectUser = (user: ItemSearchUsers) => {
    setSelectedUser((prev) => (prev?.userId === user.userId ? null : user));
  };

  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
      dispatch(clearSearchResults());
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length === 0) {
      dispatch(clearSearchResults());
    }
  };

  const handleAddUser = () => {
    if (!selectedUser) return;

    const userFirstName = localStorage.getItem("userName");
    const userLastName = localStorage.getItem("userLastName");
    const messageId = uuidv4();

    if (
      !currentConversation?.groupId ||
      !currentConversation.groupName ||
      !isReadySocket
    )
      return;

    sendSocketMessage({
      type: TYPE_ADD_MEMBER_TO_GROUP,
      params: {
        groupId: currentConversation.groupId,
        groupName: currentConversation.groupName,
        userId: selectedUser.userId,
        messageId: messageId,
        message: `${userFirstName} ${userLastName ?? ""} добавил(a) в группу ${
          selectedUser.firstName
        } ${selectedUser.lastName ?? ""}`,
      },
    });

    loaderTimerRef.current = setTimeout(() => {
      setApiStatus((prev) => ({
        ...prev,
        isLoading: true,
      }));
    }, 300);
  };

  useEffect(() => {
    if (deferredQuery.trim() && currentConversation?.groupId) {
      dispatch(
        searchUsersByNameOrEmail({
          searchText: deferredQuery,
          groupId: currentConversation.groupId,
        })
      );
    } else {
      dispatch(clearSearchResults());
    }
  }, [deferredQuery, dispatch, currentConversation]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);

      if (loaderTimerRef.current) {
        clearTimeout(loaderTimerRef.current);
        loaderTimerRef.current = null;
      }

      if (data.success && data.type === TYPE_ADD_MEMBER_TO_GROUP) {
        if (data.params.isBroadcast || !data.params.item.groupId) return;

        const resultFormatMessage = formatGroupMessage(data.params.item);
        const resultFormatChat = formatGroupMessageChat(data.params.item);

        dispatch(listLastMessageReceived(resultFormatChat));
        dispatch(latestMessageGroupReceived(resultFormatMessage));

        setSelectedUser(null);
        setApiStatus((prev) => ({ ...prev, isLoading: false }));
        toast.success("Пользователь добавлен");
        setSearchQuery("");
      } else {
        dispatch(isErrorReceived(data));
        setApiStatus((prev) => ({
          ...prev,
          isLoading: false,
          isErrorServer: true,
        }));
        toast.error("Ошибка сервера");
      }
    };

    socket.addEventListener("message", handleMessage);
    return () => {
      socket.removeEventListener("message", handleMessage);
      if (loaderTimerRef.current) {
        clearTimeout(loaderTimerRef.current);
        loaderTimerRef.current = null;
      }
    };
  }, [socket, isConnected, dispatch]);

  return (
    <div className={styles.groupOverlay} onClick={handleClose}>
      {apiStatus.isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}></div>
        </div>
      )}

      <div className={styles.groupContent}>
        <header className={styles.groupHeader}>
          <h3>Добавить участника</h3>
        </header>

        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Поиск пользователей..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <div className={styles.usersList}>
          {searchUsersResult.length > 0 ? (
            searchUsersResult.map((user) => (
              <div
                key={user.userId}
                className={`${styles.userItem} ${
                  selectedUser?.userId === user.userId ? styles.selected : ""
                }`}
                onClick={() => handleSelectUser(user)}
              >
                <div className={styles.avatar}>👤</div>
                <div className={styles.userInfo}>
                  <span className={styles.userName}>
                    {user.firstName} {user.lastName}
                  </span>
                  <span className={styles.email}>{user.email}</span>
                </div>
                {selectedUser?.userId === user.userId && (
                  <div className={styles.checkmark}>✓</div>
                )}
              </div>
            ))
          ) : (
            <div className={styles.noResults}>
              {searchQuery
                ? "Пользователи не найдены"
                : "Введите имя или email для поиска"}
            </div>
          )}
        </div>

        <footer className={styles.groupFooter}>
          <button
            className={styles.cancelButton}
            onClick={() => {
              onCancel();
              dispatch(clearSearchResults());
            }}
          >
            Отмена
          </button>
          <button
            className={styles.addButton}
            onClick={handleAddUser}
            disabled={!selectedUser || apiStatus.isLoading}
          >
            Добавить
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AddMemberGroup;
