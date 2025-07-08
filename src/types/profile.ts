export interface ProfileSatate {
  error: string | null;
  destroyUser: UserResDestroyData | null;
}

export interface UserResDestroyData {
  message: string;
}

export type ProfileView = "main" | "deleteProfile";

export interface DeleteProfileModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  onClose: () => void;
  isError?: boolean;
  errorMessage?: string;
}

export interface ProfileMainViewProps {
  userName: string;
  onEditProfile?: () => void;
  onChangePassword?: () => void;
  onDeleteAccount: (e: React.MouseEvent) => void;
}

export type ValidationState = {
  isLoading: boolean;
  isErrorServer: boolean;
  errorMessageServer: string;
};
