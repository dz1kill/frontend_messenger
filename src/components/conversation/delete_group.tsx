import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import styles from "../../styles/delete_group.module.css";
import { useAppDispatch, useAppSelector } from "../../hooks/redux_hooks";
import { RootState } from "../../store/store";
import { DeleteGroupProps } from "../../types/conversation";
import {
  clearCurrentConversation,
  isErrorReceived,
  removeGroupMessages,
  removeLastMessageByGroupId,
} from "../../store/chat/slice";
import { useSocket } from "../../hooks/use_socket";
import { TYPE_DROP_GROUP } from "../../utils/constants";

const DropGroup: React.FC<DeleteGroupProps> = ({
  onCancel,
  onClose,
  onFulfilled,
}) => {
  const dispatch = useAppDispatch();
  const loaderTimerRef = useRef<NodeJS.Timeout | null>(null);
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
      if (loaderTimerRef.current) {
        clearTimeout(loaderTimerRef.current);
        loaderTimerRef.current = null;
      }

      if (data.success && data.type === TYPE_DROP_GROUP) {
        setApiStatus((prev) => ({
          ...prev,
          isLoading: false,
        }));

        if (data.params.isBroadcast || !data.params.item.groupId) return;

        dispatch(removeLastMessageByGroupId(data.params.item.groupId));
        dispatch(removeGroupMessages(data.params.item.groupId));
        dispatch(clearCurrentConversation());
        toast.success("Группа удалена");
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
      if (loaderTimerRef.current) {
        clearTimeout(loaderTimerRef.current);
        loaderTimerRef.current = null;
      }
    };
  }, [
    socket,
    isConnected,
    currentConversation?.groupId,
    dispatch,
    onFulfilled,
  ]);

  const handleOnLeaveGroup = async () => {
    if (!currentConversation?.groupId || !isReadySocket) return;
    sendSocketMessage({
      type: TYPE_DROP_GROUP,
      params: {
        groupId: currentConversation.groupId,
      },
    });
    loaderTimerRef.current = setTimeout(() => {
      setApiStatus((prev) => ({
        ...prev,
        isLoading: true,
      }));
    }, 300);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      {apiStatus.isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}></div>
        </div>
      )}
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>Подтвердите удаление группы</h3>
        <p>Вы уверены, что хотите удалить группу?</p>
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
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

export default DropGroup;
