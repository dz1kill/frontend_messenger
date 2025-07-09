import React, { useState } from "react";
import styles from "../../styles/delete_profile_modal.module.css";
import { DeleteProfileModalProps, ValidationDelete } from "../../types/profile";
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

  const [validation, setValidation] = useState<ValidationDelete>({
    isLoading: false,
    isErrorServer: false,
    errorMessageServer: "",
  });
  const handleDeleteProfile = async () => {
    setValidation((prev) => ({
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
      setValidation((prev) => ({
        ...prev,
        isLoading: false,
        isErrorServer: true,
        errorMessageServer: errorText,
      }));
    }
  };
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      {validation.isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}></div>
        </div>
      )}
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>Подтвердите удаление</h3>
        <p>Вы уверены, что хотите удалить аккаунт?</p>
        {validation.isErrorServer && (
          <div className={styles.errorMessage}>
            {validation.errorMessageServer}
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
