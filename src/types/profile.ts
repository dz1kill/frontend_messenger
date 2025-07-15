export interface UserResDestroyData {
  status: number;
  message: string;
}

export interface UserResChangePasswordData {
  message: string;
  status: number;
}

export interface UserResUpdateProfileData {
  message: string;
  status: number;
}
export interface ChangePasswordPayload {
  newPassword: string;
  oldPassword: string;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
}

export type ProfileView =
  | "main"
  | "deleteProfile"
  | "changePassword"
  | "updateProfile";

export interface DeleteProfileModalProps {
  onCancel: () => void;
  onClose: () => void;
}

export interface ProfileMainViewProps {
  onEditProfile?: () => void;
  onChangePassword?: () => void;
  onDeleteAccount: (e: React.MouseEvent) => void;
}

export interface ChangePasswordModalProps {
  onClose: () => void;
  onCancel: () => void;
}

export interface UpdateProfileModalProps {
  onClose: () => void;
  onCancel: () => void;
}

export type ApiStatusDeleteUser = {
  isLoading: boolean;
  isErrorServer: boolean;
  errorMessageServer: string;
};

export interface FormDataChangePassword {
  newPassword: string;
  confirmPassword: string;
  oldPassword: string;
}

export interface FormDataUpdateProfile {
  firstName: string;
  lastName: string;
}
export interface ApiStatusChagePassword {
  isEmpty: boolean;
  isLoading: boolean;
  isErrorServer: boolean;
  errorMessageServer: string;
  headerMessage: string;
}

export interface ApiStatusUpdateProfile {
  isEmpty: boolean;
  isLoading: boolean;
  isErrorServer: boolean;
  errorMessageServer: string;
  headerMessage: string;
}
export interface ValidateErrChagePassword {
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface ValidateErrUpdateProfile {
  firstName?: string;
  lastName?: string;
}
