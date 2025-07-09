export interface ProfileSatate {
  error: string | null;
  destroyUser: UserResDestroyData | null;
}

export interface UserResDestroyData {
  message: string;
}

export type ProfileView = "main" | "deleteProfile" | "changePassword";

export interface DeleteProfileModalProps {
  onCancel: () => void;
  onClose: () => void;
}

export interface ProfileMainViewProps {
  onEditProfile?: () => void;
  onChangePassword?: () => void;
  onDeleteAccount: (e: React.MouseEvent) => void;
}

export type ValidationDelete = {
  isLoading: boolean;
  isErrorServer: boolean;
  errorMessageServer: string;
};

export interface FormDataChangePassword {
  newPassword: string;
  confirmPassword: string;
  oldPassword: string;
}

export interface ValidattionChagePassword {
  isEmpty: boolean;
  isLoading: boolean;
}

export interface ValidateErrChagePassword {
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}
