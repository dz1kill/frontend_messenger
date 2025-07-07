export interface ProfileSatate {
  error: string | null;
  destroyUser: UserResDestroyData | null;
}

export interface UserResDestroyData {
  message: string;
}

export interface DeleteProfileModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  onClose: () => void;
  isError?: boolean;
  errorMessage?: string;
}
