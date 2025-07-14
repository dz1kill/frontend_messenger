import React, { useState } from "react";

import styles from "../../styles/delete_chat_modal.module.css";
import { useAppDispatch } from "../../hooks/redux_hooks";

const DeleteChatModal: React.FC<any> = ({ onCancel, onClose }) => {
  const dispatch = useAppDispatch();

  const [apiStatus, setApiStatus] = useState({
    isLoading: false,
    isErrorServer: false,
    errorMessageServer: "",
  });

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
          <button className={styles.confirmButton}>Удалить</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteChatModal;
