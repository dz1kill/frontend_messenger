import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import styles from "../../styles/leave.group.module.css";
import { useAppDispatch, useAppSelector } from "../../hooks/redux_hooks";
import { RootState } from "../../store/store";
import { LeaveGroupProps } from "../../types/conversation";
import {
  clearCurrentConversation,
  isErrorReceived,
  removeGroupMessages,
  removeLastMessageByGroupId,
} from "../../store/chat/slice";
import { useSocket } from "../../hooks/use_socket";
import { TYPE_LEAVE_GROUP } from "../../utils/constants";

const LeaveGroup: React.FC<LeaveGroupProps> = ({
  onCancel,
  onClose,
  onFulfilled,
}) => {
  const dispatch = useAppDispatch();
  const notificationMessage = "покинул(a) группу";
  const { sendSocketMessage, isReadySocket } = useSocket();
  const { socket, isConnected } = useAppSelector((state) => state.socket);
  const { currentConversation } = useAppSelector(
    (state: RootState) => state.chats
  );
  const [apiStatus, setApiStatus] = useState({
    isLoading: false,
    isErrorServer: false,
    errorMessageServer: "",
  });

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);

      if (data.success && data.type === TYPE_LEAVE_GROUP) {
        setApiStatus((prev) => ({
          ...prev,
          isLoading: false,
        }));

        if (data.params.isBroadcast || !data.params.item.groupId) return;

        dispatch(removeLastMessageByGroupId(data.params.item.groupId));
        dispatch(removeGroupMessages(data.params.item.groupId));
        dispatch(clearCurrentConversation());
        onFulfilled();
      } else {
        dispatch(isErrorReceived(data));
        setApiStatus((prev) => ({
          ...prev,
          isLoading: false,
          isErrorServer: true,
          errorMessageServer: "Ошибка сервера",
        }));
      }
    };

    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket, isConnected, dispatch, onFulfilled]);

  const handleOnLeaveGroup = async () => {
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
      type: TYPE_LEAVE_GROUP,
      params: {
        groupId: currentConversation.groupId,
        message: `${userFirstName} ${
          userLastName ?? ""
        } ${notificationMessage}`,
        messageId: messageId,
        groupName: currentConversation.groupName,
      },
    });
    setApiStatus((prev) => ({
      ...prev,
      isLoading: true,
    }));
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      {apiStatus.isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}></div>
        </div>
      )}
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>Подтвердите действие</h3>
        <p>Вы уверены, что хотите покинуть группу?</p>
        {apiStatus.isErrorServer && (
          <div className={styles.errorMessage}>
            {apiStatus.errorMessageServer}
          </div>
        )}
        <div className={styles.modalButtons}>
          <button className={styles.cancelButton} onClick={onCancel}>
            Отмена
          </button>
          <button
            className={styles.confirmButton}
            onClick={handleOnLeaveGroup}
            disabled={apiStatus.isLoading}
          >
            Покинуть
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveGroup;
