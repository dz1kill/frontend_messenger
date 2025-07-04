import React from "react";
import styles from "../../styles/delete_profile_modal.module.css";
import { DeleteProfileModalProps } from "../../types/header";

const DeleteProfileModal: React.FC<DeleteProfileModalProps> = ({
  onConfirm,
  onCancel,
  onClose,
}) => {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>Подтвердите удаление</h3>
        <p>Вы уверены, что хотите удалить аккаунт?</p>
        <div className={styles.modalButtons}>
          <button className={styles.cancelButton} onClick={onCancel}>
            Отмена
          </button>
          <button className={styles.confirmButton} onClick={onConfirm}>
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProfileModal;
