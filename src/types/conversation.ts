export interface DeleteDialogModalProps {
  onCancel: () => void;
  onClose: () => void;
  onFulfilled: () => void;
}

export type CurrentViewState = "" | "deleteDialog";
