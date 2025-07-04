import React, { useState } from "react";
import styles from "../../styles/header.module.css";
import LogoutModal from "./logout_modal";
import { useAppDispatch } from "../../hooks/redux_hooks";
import { resetSocketState } from "../../store/socket/slice";
import { resetChatsState } from "../../store/chat/slice";

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    dispatch(resetSocketState());
    dispatch(resetChatsState());
    localStorage.clear();
    setShowLogoutModal(false);
  };

  return (
    <div>
      <header className={styles.header}>
        <div className={styles.leftSection}>
          <button className={styles.menuButton}>
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
      {showLogoutModal && (
        <LogoutModal
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
    </div>
  );
};

export default Header;
