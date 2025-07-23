type LeaveGroupParams = {
  groupId: string;
  message: string;
  messageId: string;
  groupName: string;
};

type ListLastMessageParams = {
  limit: number;
  cursorCreatedAt: string | null;
};

type LatestMessageDialogParams = {
  receiverId: string;
  limit: number;
  cursorCreatedAt: string | null;
};

type LatestMessageGroupParams = {
  groupName: string;
  groupId: string;
  limit: number;
  cursorCreatedAt: string | null;
};

type SendMessageGroupParams = {
  messageId: string;
  groupId: string;
  content: string;
  groupName: string;
};

type SendMessageDialogParams = {
  messageId: string;
  receiverId: string;
  content: string;
};

type DropGroupParams = {
  groupId: string;
};

type AddMemberToGroupParams = {
  userId: string;
  groupId: string;
  message: string;
  messageId: string;
  groupName: string;
};
export type SocketRequest =
  | { type: "leaveGroup"; params: LeaveGroupParams }
  | { type: "dropGroup"; params: DropGroupParams }
  | { type: "listLastMessage"; params: ListLastMessageParams }
  | { type: "getlatestMessageDialog"; params: LatestMessageDialogParams }
  | { type: "getlatestMessageGroup"; params: LatestMessageGroupParams }
  | { type: "messageInGroup"; params: SendMessageGroupParams }
  | { type: "privateMessage"; params: SendMessageDialogParams }
  | { type: "addUserInGroup"; params: AddMemberToGroupParams };
