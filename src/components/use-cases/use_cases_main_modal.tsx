import React from "react";
import styles from "../../styles/use_cases_main_view.module.css";
import { ProfileMainViewProps } from "../../types/use-cases";
import { ROUTES } from "../../router/routes";
import { useNavigate } from "react-router-dom";

const ProfileMainView: React.FC<ProfileMainViewProps> = ({
  onEditProfile,
  onChangePassword,
  onDeleteAccount,
  onCreateGroup,
}) => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Пользователь";
  const userLastName = localStorage.getItem("userLastName") || "";

  return (
    <div
      className={styles.modalOverlay}
      onClick={() => navigate(ROUTES.APP.HOME)}
    >
      <div className={styles.account} onClick={(e) => e.stopPropagation()}>
        <div className={styles.accountHeader}>
          <div className={styles.avatarPlaceholder}>👤</div>
          <h3>{`${userName} ${userLastName}`}</h3>
        </div>
        <div className={styles.accountMenu}>
          <button className={styles.menuItem} onClick={onCreateGroup}>
            <span>Создать группу</span>
          </button>
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

export default ProfileMainView;
