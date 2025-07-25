import React from "react";
import styles from "../../styles/logout_modal.module.css";
import { LogoutModalProps } from "../../types/header";

const LogoutModal: React.FC<LogoutModalProps> = ({
  onConfirm,
  onCancel,
  onClose,
}) => {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>Подтвердите выход</h3>
        <p>Вы уверены, что хотите выйти?</p>
        <div className={styles.modalButtons}>
          <button className={styles.cancelButton} onClick={onCancel}>
            Отмена
          </button>
          <button className={styles.confirmButton} onClick={onConfirm}>
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
