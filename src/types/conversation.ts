export interface DeleteDialogProps {
  onCancel: () => void;
  onClose: () => void;
  onFulfilled: () => void;
}

export interface LeaveGroupProps {
  onCancel: () => void;
  onClose: () => void;
  onFulfilled: () => void;
}

export interface DeleteGroupProps {
  onCancel: () => void;
  onClose: () => void;
  onFulfilled: () => void;
}
export type CurrentViewState =
  | ""
  | "deleteDialog"
  | "leaveGroup"
  | "deleteGroup"
  | "addMemberGroup";

export interface AddMemberGroupProps {
  onClose: () => void;
  onCancel: () => void;
}

export type ApiStatusAddMemberGroupProps = {
  isLoading: boolean;
  isErrorServer: boolean;
};
