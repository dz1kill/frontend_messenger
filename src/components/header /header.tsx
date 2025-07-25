import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

import styles from "../../styles/header.module.css";
import LogoutModal from "./logout_modal";
import { useAppDispatch } from "../../hooks/redux_hooks";
import { resetSocketState } from "../../store/socket/slice";
import { resetChatsState } from "../../store/chat/slice";
import { ROUTES } from "../../router/routes";

const Header: React.FC = () => {
  const navigate = useNavigate();
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
          <button
            className={styles.menuButton}
            onClick={() => navigate(ROUTES.APP.PROFILE.ROOT)}
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

      {showLogoutModal && (
        <LogoutModal
          onClose={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
    </div>
  );
};

export default Header;
