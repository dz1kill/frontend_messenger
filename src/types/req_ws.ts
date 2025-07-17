type LeaveGroupParams = {
  groupId: string | null;
  message: string | null;
  messageId: string | null;
  groupName: string | null;
};

type ListLastMessageParams = {
  limit: number;
  cursorCreatedAt: string | null;
};

type LatestMessageDialogParams = {
  receiverId: string | null;
  limit: number;
  cursorCreatedAt: string | null;
};

type LatestMessageGroupParams = {
  groupName: string | null;
  groupId: string | null;
  limit: number;
  cursorCreatedAt: string | null;
};

type SendMessageGroupParams = {
  messageId: string | null;
  groupId: string | null;
  content: string | null;
  groupName: string | null;
};

type SendMessageDialogParams = {
  messageId: string | null;
  receiverId: string | null;
  content: string | null;
};

type DropGroupParams = {
  groupId: string;
};

export type SocketRequest =
  | { type: "leaveGroup"; params: LeaveGroupParams }
  | { type: "dropGroup"; params: DropGroupParams }
  | { type: "listLastMessage"; params: ListLastMessageParams }
  | { type: "getlatestMessageDialog"; params: LatestMessageDialogParams }
  | { type: "getlatestMessageGroup"; params: LatestMessageGroupParams }
  | { type: "messageInGroup"; params: SendMessageGroupParams }
  | { type: "privateMessage"; params: SendMessageDialogParams };
