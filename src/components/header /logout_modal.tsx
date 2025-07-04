import React from "react";
import styles from "../../styles/logout_modal.module.css";

interface LogoutModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
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
