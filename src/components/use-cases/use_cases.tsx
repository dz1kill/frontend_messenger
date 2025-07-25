import React, { useState } from "react";
import DeleteProfileModal from "./delete_profile_modal";
import ProfileMainView from "./use_cases_main_modal";
import { ProfileView } from "../../types/use-cases_component";
import ChangePasswordModal from "./change_password_modal";
import UpdateProfileModal from "./upadate_profile";
import CreateGroupModal from "./create_group_modal";

const Profile: React.FC = () => {
  const [currentView, setCurrentView] = useState<ProfileView>("main");

  const renderView = () => {
    switch (currentView) {
      case "changePassword":
        return (
          <ChangePasswordModal
            onClose={() => setCurrentView("main")}
            onCancel={() => setCurrentView("main")}
          />
        );

      case "createGroup":
        return (
          <CreateGroupModal
            onClose={() => setCurrentView("main")}
            onCancel={() => setCurrentView("main")}
          />
        );
      case "updateProfile":
        return (
          <UpdateProfileModal
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
            onEditProfile={() => setCurrentView("updateProfile")}
            onChangePassword={() => setCurrentView("changePassword")}
            onDeleteAccount={() => setCurrentView("deleteProfile")}
            onCreateGroup={() => setCurrentView("createGroup")}
          />
        );
    }
  };

  return <div>{renderView()}</div>;
};

export default Profile;
