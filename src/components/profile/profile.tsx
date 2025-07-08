import React, { useState } from "react";
import styles from "../../styles/profile.module.css";
import DeleteProfileModal from "./delete_profile_modal";
import { useAppDispatch } from "../../hooks/redux_hooks";
import { destroyUser } from "../../store/profile/slice";
import { resetSocketState } from "../../store/socket/slice";
import { resetChatsState } from "../../store/chat/slice";
import { messageErrorDestroy } from "./helper";
import ProfileMainView from "./profile_main_modal";
import { ProfileView } from "../../types/profile";
import { ValidationState } from "../../types/profile";

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const userName = localStorage.getItem("userName") || "Пользователь";
  const [currentView, setCurrentView] = useState<ProfileView>("main");
  const [validation, setValidation] = useState<ValidationState>({
    isLoading: false,
    isErrorServer: false,
    errorMessageServer: "",
  });

  const handleDeleteProfile = async () => {
    setValidation((prev) => ({
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
      setValidation((prev) => ({
        ...prev,
        isLoading: false,
        isErrorServer: true,
        errorMessageServer: errorText,
      }));
    }
  };

  const handleCloseModalDelete = () => {
    setCurrentView("main");
  };

  const handleEditProfile = () => {
    // Логика для редактирования профиля
  };

  const handleChangePassword = () => {
    // Логика для изменения пароля
  };

  const handleDeleteAccount = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentView("deleteProfile");
  };

  const renderView = () => {
    switch (currentView) {
      case "main":
      default:
        return (
          <ProfileMainView
            userName={userName}
            onEditProfile={handleEditProfile}
            onChangePassword={handleChangePassword}
            onDeleteAccount={handleDeleteAccount}
          />
        );

      case "deleteProfile":
        return (
          <DeleteProfileModal
            onClose={handleCloseModalDelete}
            onConfirm={handleDeleteProfile}
            onCancel={handleCloseModalDelete}
            isError={validation.isErrorServer}
            errorMessage={validation.errorMessageServer}
          />
        );
    }
  };

  return (
    <div>
      {validation.isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}></div>
        </div>
      )}
      {renderView()}
    </div>
  );
};

export default Profile;
