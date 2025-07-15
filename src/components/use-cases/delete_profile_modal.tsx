import React, { useState } from "react";

import styles from "../../styles/delete_profile_modal.module.css";
import {
  DeleteProfileModalProps,
  ApiStatusDeleteUser,
} from "../../types/use-cases";
import { useAppDispatch } from "../../hooks/redux_hooks";
import { resetSocketState } from "../../store/socket/slice";
import { destroyUser } from "../../store/profile/slice";
import { resetChatsState } from "../../store/chat/slice";
import { messageErrorDestroy } from "./helper";

const DeleteProfileModal: React.FC<DeleteProfileModalProps> = ({
  onCancel,
  onClose,
}) => {
  const dispatch = useAppDispatch();

  const [apiStatus, setApiStatus] = useState<ApiStatusDeleteUser>({
    isLoading: false,
    isErrorServer: false,
    errorMessageServer: "",
  });

  const handleDeleteProfile = async () => {
    setApiStatus((prev) => ({
      ...prev,
      isLoading: true,
    }));

    const resultAction = await dispatch(destroyUser());
    if (destroyUser.fulfilled.match(resultAction)) {
      dispatch(resetSocketState());
      dispatch(resetChatsState());
      localStorage.clear();
    } else {
      const statusCode = resultAction.payload?.status || 500;
      const errorText = messageErrorDestroy(statusCode);
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
        <p>Вы уверены, что хотите удалить аккаунт?</p>
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
            onClick={handleDeleteProfile}
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProfileModal;
