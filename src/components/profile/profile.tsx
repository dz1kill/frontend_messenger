import React, { useState } from "react";
import DeleteProfileModal from "./delete_profile_modal";
import ProfileMainView from "./profile_main_modal";
import { ProfileView } from "../../types/profile";
import ChangePasswordModal from "./change_password_modal";

const Profile: React.FC = () => {
  const [currentView, setCurrentView] = useState<ProfileView>("main");

  const handleEditProfile = () => {
    // Логика для редактирования профиля
  };

  const renderView = () => {
    switch (currentView) {
      case "changePassword":
        return (
          <ChangePasswordModal
            onClose={() => setCurrentView("main")}
            onCancel={() => setCurrentView("main")}
          />
        );

      case "deleteProfile":
        return (
          <DeleteProfileModal
            onClose={() => setCurrentView("main")}
            onCancel={() => setCurrentView("main")}
          />
        );

      case "main":
      default:
        return (
          <ProfileMainView
            onEditProfile={handleEditProfile}
            onChangePassword={() => setCurrentView("changePassword")}
            onDeleteAccount={() => setCurrentView("deleteProfile")}
          />
        );
    }
  };

  return <div>{renderView()}</div>;
};

export default Profile;
