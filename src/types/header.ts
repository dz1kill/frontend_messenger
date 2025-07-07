export interface LogoutModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  onClose: () => void;
}

export interface AccountModalProps {
  onClose: () => void;
  onChangePassword: () => void;
  onEditProfile: () => void;
  onDeleteAccount: () => void;
  userName?: string;
}

export interface DeleteProfileModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  onClose: () => void;
  isError?: boolean;
  errorMessage?: string;
}
