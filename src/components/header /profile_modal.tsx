import React from "react";
import styles from "../../styles/profile_modal.module.css";
import { AccountModalProps } from "../../types/header";

const AccountModal: React.FC<AccountModalProps> = ({
  onClose,
  onChangePassword,
  onEditProfile,
  onDeleteAccount,
  userName,
}) => {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.accountModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.accountHeader}>
          <div className={styles.avatarPlaceholder}>👤</div>
          <h3>{`Привет ${userName}`}</h3>
        </div>

        <div className={styles.accountMenu}>
          <button className={styles.menuItem} onClick={onEditProfile}>
            <span>Редактировать профиль</span>
          </button>
          <button className={styles.menuItem} onClick={onChangePassword}>
            <span>Изменить пароль</span>
          </button>
          <button className={styles.deleteAccount} onClick={onDeleteAccount}>
            <span>Удалить аккаунт</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountModal;
