import React, { useState } from "react";
import styles from "../../styles/profile.module.css";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../router/routes";
import DeleteProfileModal from "./delete_profile_modal";
import { useAppDispatch } from "../../hooks/redux_hooks";
import { destroyUser } from "../../store/profile/slice";
import { resetSocketState } from "../../store/socket/slice";
import { resetChatsState } from "../../store/chat/slice";
import { messageErrorDestroy } from "./helper";

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Пользователь";
  const [showDeleteProfileModal, setShowDeleteProfileModal] = useState(false);
  const [validatErrServer, setValidatErrServer] = useState({
    isLoading: false,
    isErrorServer: false,
    errorMessageServer: "",
  });

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
    } else {
      const statusCode = resultAction.payload?.status || 500;
      const errorText = messageErrorDestroy(statusCode);
      setValidatErrServer((prev) => ({
        ...prev,
        isLoading: false,
        isErrorServer: true,
        errorMessageServer: errorText,
      }));
    }
  };
  return (
    <div
      className={styles.modalOverlay}
      onClick={() => navigate(ROUTES.APP.HOME)}
    >
      {validatErrServer.isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}></div>
        </div>
      )}
      <div className={styles.account}>
        <div className={styles.accountHeader}>
          <div className={styles.avatarPlaceholder}>👤</div>
          <h3>{`Привет ${userName}`}</h3>
        </div>

        <div className={styles.accountMenu}>
          <button className={styles.menuItem}>
            <span>Редактировать профиль</span>
          </button>
          <button className={styles.menuItem}>
            <span>Изменить пароль</span>
          </button>
          <button
            className={styles.deleteAccount}
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteProfileModal(true);
            }}
          >
            <span>Удалить аккаунт</span>
          </button>
        </div>
      </div>
      {showDeleteProfileModal && (
        <DeleteProfileModal
          onClose={() => setShowDeleteProfileModal(false)}
          onConfirm={handleDeleteProfile}
          onCancel={() => setShowDeleteProfileModal(false)}
          isError={validatErrServer.isErrorServer}
          errorMessage={validatErrServer.errorMessageServer}
        />
      )}
    </div>
  );
};

export default Profile;
