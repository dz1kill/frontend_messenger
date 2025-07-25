export interface DataListLastMessage {
  messageId: string;
  senderId: string;
  senderName: string;
  receiverId: string | null;
  receiverName: string | null;
  groupId: string | null;
  groupName: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  receiverLastName?: string;
  senderLastName?: string;
}

export interface ResListLastMessageChat {
  type: "resListLastMessage";
  success: boolean;
  params: {
    data: DataListLastMessage[];
    isBroadcast: boolean;
    item: null;
  };
}
export interface FormatDataListLastMessage
  extends Omit<
    DataListLastMessage,
    | "updatedAt"
    | "deletedAt"
    | "senderId"
    | "senderName"
    | "receiverId"
    | "receiverName"
  > {
  name: string;
  companionName: string | null;
  companionId: string | null;
  companionLastName: string | null | undefined;
}

export interface DatalatestMessageDialog {
  messageId: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  content: string;
  createdAt: string;
}

export interface ReslatestMessageDialog {
  type: "getlatestMessageDialog";
  success: boolean;
  params: {
    data: DatalatestMessageDialog[];
    isBroadcast: boolean;
    item: null;
  };
}

export interface FormatLatestMessageDialog extends DatalatestMessageDialog {
  sender: string;
}
export interface LatestMessageDialogState {
  [companionId: string]: FormatLatestMessageDialog[];
}

export interface DataLatestMessageGroup {
  notification: boolean;
  messageId: string;
  senderId: string;
  senderName: string;
  senderLastName?: string;
  groupId: string;
  groupName: string;
  content: string;
  createdAt: string;
}

export interface ReslatestMessageGroup {
  type: "getlatestMessageGroup";
  success: boolean;
  params: {
    data: DataLatestMessageGroup[];
    isBroadcast: boolean;
    item: null;
  };
}

export interface ItemPrivateMessage {
  messageId: string;
  message: string;
  senderName: string;
  senderLastName?: string;
  senderId: string;
  createdAt: string;
}

export interface ResItemPrivateMessage {
  type: "privateMessage";
  success: boolean;
  params: {
    data: null;
    isBroadcast: boolean;
    item: ItemPrivateMessage;
  };
}

export interface ItemGroupMessage {
  groupId: string;
  groupName: string;
  messageId: string;
  message: string;
  senderName: string;
  senderId: string;
  senderLastName: string;
  createdAt: string;
  notification: boolean;
}

export interface ResItemGroupMessage {
  type: "messageInGroup";
  success: boolean;
  params: {
    data: null;
    isBroadcast: boolean;
    item: ItemGroupMessage;
  };
}

export interface FormatLatestMessageGroup extends DataLatestMessageGroup {
  sender: string;
}

export interface LatestMessageGroupState {
  [groupId: string]: FormatLatestMessageGroup[];
}

export interface Conversation
  extends Omit<
    FormatDataListLastMessage,
    | "lastMessage"
    | "createdAt"
    | "senderId"
    | "senderName"
    | "receiverId"
    | "receiverName"
    | "messageId"
  > {
  cursorCreatedAt: string | null;
  isFirstLoaded: boolean;
}

export interface ChatErrror {
  error: string;
  type: string;
  message: string;
}

export interface ChatState {
  latestMessageGroup: LatestMessageGroupState;
  latestMessageDialog: LatestMessageDialogState;
  lastMessagesChat: FormatDataListLastMessage[];
  isErrorMessage: ChatErrror[];
  hasFetchedOnceChat: boolean;
  lastPageLoadedChat: boolean;
  isLastPageLoadedConversation: boolean;
  isError: boolean;
  currentConversation: Conversation | null;
}
