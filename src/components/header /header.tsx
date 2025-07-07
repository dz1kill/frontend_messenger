import React, { useState } from "react";
import styles from "../../styles/header.module.css";
import LogoutModal from "./logout_modal";
import { useAppDispatch } from "../../hooks/redux_hooks";
import { resetSocketState } from "../../store/socket/slice";
import { resetChatsState } from "../../store/chat/slice";
import AccountModal from "./profile_modal";
import DeleteProfileModal from "./delete_profile_modal";
import { destroyUser } from "../../store/profile/slice";
import { messageErrorDestroy } from "./helper";

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showDeleteProfile, setShowDeleteProfile] = useState(false);
  const userName = localStorage.getItem("userName") || "User";
  const [validatErrServer, setValidatErrServer] = useState({
    isLoading: false,
    isErrorServer: false,
    errorMessageServer: "",
  });

  const handleLogout = () => {
    dispatch(resetSocketState());
    dispatch(resetChatsState());
    localStorage.clear();
    setShowLogoutModal(false);
  };

  const handleDeleteProfile = async () => {
    setValidatErrServer((prev) => ({
      ...prev,
      isLoading: true,
    }));
    const resultAction = await dispatch(destroyUser());
    if (destroyUser.fulfilled.match(resultAction)) {
      dispatch(resetSocketState());
      dispatch(resetChatsState());
      localStorage.clear();
      setShowLogoutModal(false);
    } else {
      const statusCode = resultAction.payload?.status || 500;
      const errorText = messageErrorDestroy(statusCode);
      setValidatErrServer((prev) => ({
        ...prev,
        isLoading: false,
        isErrorServer: true,
        errorMessageServer: errorText,
      }));
      setShowDeleteProfile(true);
    }
  };

  const handleChangePassword = () => {
    console.log("Открытие формы смены пароля");
    setShowAccountModal(false);
  };

  const handleEditProfile = () => {
    console.log("Открытие редактора профиля");
    setShowAccountModal(false);
  };

  const handleDeleteAccount = () => {
    setShowAccountModal(false);
    setShowDeleteProfile(true);
  };

  return (
    <div>
      <header className={styles.header}>
        {validatErrServer.isLoading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.loadingSpinner}></div>
          </div>
        )}
        <div className={styles.leftSection}>
          <button
            className={styles.menuButton}
            onClick={() => setShowAccountModal(true)}
          >
            <div className={styles.menuIcon}></div>
            <div className={styles.menuIcon}></div>
            <div className={styles.menuIcon}></div>
          </button>
          <div className={styles.logo}>Messenger</div>
        </div>
        <button
          className={styles.logoutButton}
          onClick={() => setShowLogoutModal(true)}
        >
          Выйти
        </button>
      </header>

      {showAccountModal && (
        <AccountModal
          onClose={() => setShowAccountModal(false)}
          onChangePassword={handleChangePassword}
          onEditProfile={handleEditProfile}
          onDeleteAccount={handleDeleteAccount}
          userName={userName}
        />
      )}

      {showLogoutModal && (
        <LogoutModal
          onClose={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}

      {showDeleteProfile && (
        <DeleteProfileModal
          onClose={() => setShowDeleteProfile(false)}
          onConfirm={handleDeleteProfile}
          onCancel={() => setShowDeleteProfile(false)}
          isError={validatErrServer.isErrorServer}
          errorMessage={validatErrServer.errorMessageServer}
        />
      )}
    </div>
  );
};

export default Header;
