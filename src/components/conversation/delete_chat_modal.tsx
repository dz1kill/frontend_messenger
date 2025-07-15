import React, { useState } from "react";

import styles from "../../styles/delete_chat_modal.module.css";
import { useAppDispatch, useAppSelector } from "../../hooks/redux_hooks";
import { deleteMessagesDialog } from "../../store/use_cases/slice";
import { messageErrorDeleteDialog } from "./helper";
import { RootState } from "../../store/store";
import { DeleteDialogModalProps } from "../../types/conversation";
import {
  clearCurrentConversation,
  removeDialogMessages,
  removeLastMessageByCompanionId,
} from "../../store/chat/slice";

const DeleteDialogModal: React.FC<DeleteDialogModalProps> = ({
  onCancel,
  onClose,
  onFulfilled,
}) => {
  const dispatch = useAppDispatch();
  const { currentConversation } = useAppSelector(
    (state: RootState) => state.chats
  );

  const [apiStatus, setApiStatus] = useState({
    isLoading: false,
    isErrorServer: false,
    errorMessageServer: "",
  });

  const handleOnClickDeleteMessages = async () => {
    setApiStatus((prev) => ({
      ...prev,
      isLoading: true,
    }));
    if (!currentConversation?.companionId) return;

    const resultAction = await dispatch(
      deleteMessagesDialog({ companionId: currentConversation?.companionId })
    );

    if (deleteMessagesDialog.fulfilled.match(resultAction)) {
      setApiStatus((prev) => ({
        ...prev,
        isLoading: false,
      }));
      dispatch(
        removeLastMessageByCompanionId(currentConversation?.companionId)
      );
      dispatch(removeDialogMessages(currentConversation?.companionId));
      dispatch(clearCurrentConversation());
      onFulfilled();
    } else {
      const statusCode = resultAction.payload?.status || 500;
      const errorText = messageErrorDeleteDialog(statusCode);
      setApiStatus((prev) => ({
        ...prev,
        isLoading: false,
        isErrorServer: true,
        errorMessageServer: errorText,
      }));
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      {apiStatus.isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}></div>
        </div>
      )}
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>Подтвердите удаление</h3>
        <p>Вы уверены, что хотите удалить диалог?</p>
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
            onClick={handleOnClickDeleteMessages}
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDialogModal;
