import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import styles from "../../styles/conversation.module.css";
import ConversationItem from "./item";
import { useAppDispatch, useAppSelector } from "../../hooks/redux_hooks";
import { RootState } from "../../store/store";
import {
  dataToChatState,
  checkFirstLoad,
  formatDateLabel,
  getMsgConversationDialog,
  getMsgConversationGroup,
  getNewCursor,
  shouldShowDate,
  dataToDialogState,
  dataToGroupState,
} from "./helper";
import {
  LATEST_MESSAGE_DIALOG_PAGE,
  LATEST_MESSAGE_GROUP_PAGE,
  TYPE_GROUP_MESSAGE,
  TYPE_LATEST_MESSAGE_DIALOG,
  TYPE_LATEST_MESSAGE_GROUP,
  TYPE_PRIVATE_MESSAGE,
} from "../../utils/constants";
import {
  latestMessageDialogReceived,
  latestMessageGroupReceived,
  listLastMessageReceived,
  setIsLastPageLoadedConversation,
  targetConversation,
} from "../../store/chat/slice";
import { useSocket } from "../../hooks/use_socket";
import DropdownMenu from "./dropdown";
import DeleteDialog from "./delete_chat";
import { CurrentViewState } from "../../types/conversation";
import LeaveGroup from "./leave_group";
import DropGroup from "./delete_group";
import AddMemberGroup from "./аdd_member_group";

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
  const userId = localStorage.getItem("userId");
  const prevChatKeyRef = useRef<string | undefined>("");
  const { sendSocketMessage, isReadySocket } = useSocket();
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const scrollOffsetRef = useRef<number | null>(null);
  const [inputData, setInputData] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<CurrentViewState>("");

  const messages = currentConversation?.groupId
    ? getMsgConversationGroup(currentConversation, latestMessageGroup)
    : getMsgConversationDialog(currentConversation, latestMessageDialog);

  useEffect(() => {
    const currentChatKey = currentConversation?.groupId
      ? `group_${currentConversation.groupId}`
      : currentConversation?.companionId
      ? `dialog_${currentConversation.companionId}`
      : undefined;

    if (currentChatKey !== prevChatKeyRef.current) {
      dispatch(setIsLastPageLoadedConversation(false));
    }
  }, [latestMessageDialog, latestMessageGroup, dispatch, currentConversation]);

  useEffect(() => {
    const currentChatKey = currentConversation?.groupId
      ? `group_${currentConversation.groupId}`
      : currentConversation?.companionId
      ? `dialog_${currentConversation.companionId}`
      : undefined;

    if (currentChatKey === prevChatKeyRef.current) {
      return;
    }
    prevChatKeyRef.current = currentChatKey;
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
        type: TYPE_LATEST_MESSAGE_DIALOG,
        params: {
          receiverId: currentConversation.companionId,
          limit: LATEST_MESSAGE_DIALOG_PAGE,
          cursorCreatedAt: null,
        },
      };
    }
    if (currentConversation.groupId && currentConversation.groupName) {
      request = {
        type: TYPE_LATEST_MESSAGE_GROUP,
        params: {
          groupName: currentConversation.groupName,
          groupId: currentConversation.groupId,
          limit: LATEST_MESSAGE_GROUP_PAGE,
          cursorCreatedAt: null,
        },
      };
    }
    if (!request) return;

    sendSocketMessage(request);

    setLoadingState((prev) => ({
      ...prev,
      isLoading: true,
    }));
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

    if (isLastPageLoadedConversation) {
      setLoadingState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }

    const isReadyToFetch = !!currentConversation && isFirstLoaded;

    if (!isReadyToFetch) return;

    const newCursor = getNewCursor(
      currentConversation,
      latestMessageDialog,
      latestMessageGroup
    );

    if (!newCursor || currentConversation.cursorCreatedAt === newCursor) {
      return;
    }
    setLoadingState((prev) => ({
      ...prev,
      isLoading: false,
    }));

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
      scrollOffsetRef.current = null;
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
      const atTop = scrollTop <= 25;

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
          type: TYPE_LATEST_MESSAGE_DIALOG,
          params: {
            receiverId: currentConversation.companionId,
            limit: LATEST_MESSAGE_DIALOG_PAGE,
            cursorCreatedAt: currentConversation.cursorCreatedAt,
          },
        };
      }
      if (currentConversation.groupId && currentConversation.groupName) {
        request = {
          type: TYPE_LATEST_MESSAGE_GROUP,
          params: {
            groupName: currentConversation.groupName,
            groupId: currentConversation.groupId,
            limit: LATEST_MESSAGE_GROUP_PAGE,
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

  const handlSendMessage = () => {
    const messageId = uuidv4();

    if (!currentConversation || !inputData) return;

    dispatch(
      listLastMessageReceived(
        dataToChatState(currentConversation, inputData, messageId)
      )
    );

    let request;
    if (currentConversation.companionId) {
      dispatch(
        latestMessageDialogReceived(
          dataToDialogState(currentConversation, inputData, messageId)
        )
      );
      request = {
        type: TYPE_PRIVATE_MESSAGE,
        params: {
          messageId,
          receiverId: currentConversation.companionId,
          content: inputData,
        },
      };
    }

    if (currentConversation.groupId && currentConversation.groupName) {
      dispatch(
        latestMessageGroupReceived(
          dataToGroupState(currentConversation, inputData, messageId)
        )
      );
      request = {
        type: TYPE_GROUP_MESSAGE,
        params: {
          messageId,
          groupName: currentConversation.groupName,
          groupId: currentConversation.groupId,
          content: inputData,
        },
      };
    }

    if (!request) return;
    sendSocketMessage(request);

    setInputData("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!inputData.trim()) return;
      handlSendMessage();
    }
  };

  return (
    <div className={styles.conversationWindow}>
      {currentConversation && (
        <div className={styles.conversationHeader}>
          <h2>
            {currentConversation.companionLastName
              ? `${currentConversation.name} ${currentConversation.companionLastName}`
              : currentConversation.name}
          </h2>
          <div className={styles.menuContainer}>
            <button
              className={styles.menuButton}
              onClick={() => setIsDropdownOpen(true)}
            >
              <span className={styles.menuIcon}></span>
              <span className={styles.menuIcon}></span>
              <span className={styles.menuIcon}></span>
            </button>

            {isDropdownOpen && (
              <DropdownMenu
                isGroup={!!currentConversation.groupId}
                onClose={() => setIsDropdownOpen(false)}
                onDeleteChat={() => setCurrentView("deleteDialog")}
                onLeaveGroup={() => setCurrentView("leaveGroup")}
                onDeleteGroup={() => setCurrentView("deleteGroup")}
                onAddMemberGroup={() => setCurrentView("addMemberGroup")}
              />
            )}
            {currentView === "addMemberGroup" && (
              <AddMemberGroup
                onClose={() => setCurrentView("")}
                onCancel={() => setCurrentView("")}
              />
            )}
            {currentView === "deleteDialog" && (
              <DeleteDialog
                onClose={() => setCurrentView("")}
                onCancel={() => setCurrentView("")}
                onFulfilled={() => setCurrentView("")}
              />
            )}
            {currentView === "leaveGroup" && (
              <LeaveGroup
                onClose={() => setCurrentView("")}
                onCancel={() => setCurrentView("")}
                onFulfilled={() => setCurrentView("")}
              />
            )}
            {currentView === "deleteGroup" && (
              <DropGroup
                onClose={() => setCurrentView("")}
                onCancel={() => setCurrentView("")}
                onFulfilled={() => setCurrentView("")}
              />
            )}
          </div>
        </div>
      )}

      {!currentConversation ? (
        <div className={styles.emptyChat}>
          Пожалуйста, выберите кому написать...
        </div>
      ) : (
        <>
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
            {messages.length === 0 && !loadingState.isLoading && (
              <div className={styles.emptyChat}>
                <p>Напишите сообщение, чтобы начать диалог</p>
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
              name="message"
              value={inputData}
              placeholder="Написать сообщение..."
              autoComplete="off"
              className={styles.inputField}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setInputData(e.target.value)
              }
              onKeyDown={handleKeyDown}
            />
            <button
              className={`${styles.sendButton} ${
                !inputData.trim() ? styles.disabledButton : ""
              }`}
              disabled={!inputData.trim()}
              onClick={handlSendMessage}
            >
              Отправить
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Conversation;
