import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

import styles from "../../styles/header.module.css";
import LogoutModal from "./logout_modal";
import { useAppDispatch } from "../../hooks/redux_hooks";
import { resetSocketState } from "../../store/socket/slice";
import { resetChatsState } from "../../store/chat/slice";
import { ROUTES } from "../../router/routes";
import { managementMigrate } from "../../store/hard_code/slice";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [migrateInfo, setmigrateInfo] = useState<string>("");

  const userEmail = localStorage.getItem("email");

  const handleClickMigrate = async (param: "start" | "undo") => {
    const resultAction = await dispatch(managementMigrate({ param }));

    if (managementMigrate.fulfilled.match(resultAction)) {
      setmigrateInfo(":ok");
    } else {
      setmigrateInfo(":error");
    }
  };

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
        {userEmail === "dz1k@mail.com" && (
          <div className={styles.migrateButtonСontainer}>
            <button
              className={styles.migrateButtonUndo}
              onClick={() => handleClickMigrate("undo")}
            >
              {`undo ${migrateInfo}`}
            </button>
            <button
              className={styles.migrateButtonStart}
              onClick={() => handleClickMigrate("start")}
            >
              {`start ${migrateInfo}`}
            </button>
          </div>
        )}

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
