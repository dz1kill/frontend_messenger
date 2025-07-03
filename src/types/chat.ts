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
}

export interface ResListLastMessageChat {
  type: "resListLastMessage";
  success: boolean;
  params: {
    data: DataListLastMessage[];
    message: string | null;
    senderName: string | null;
  };
}
export interface FormatDataListLastMessage
  extends Omit<DataListLastMessage, "updatedAt" | "deletedAt"> {
  name: string;
  companionName: string | null;
  companionId: string | null;
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
    message: string | null;
    senderName: string | null;
  };
}

export interface FormatLatestMessageDialog extends DatalatestMessageDialog {
  sender: string;
}
export interface LatestMessageDialogState {
  [companionId: string]: FormatLatestMessageDialog[];
}

export interface DataLatestMessageGroup {
  messageId: string;
  senderId: string;
  senderName: string;
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
    message: string | null;
    senderName: string | null;
  };
}

export interface FormatLatestMessageGroup extends DataLatestMessageGroup {
  sender: string;
}

export interface LatestMessageGroupState {
  [groupId: string]: FormatLatestMessageGroup[];
}

export interface Conversation
  extends Omit<FormatDataListLastMessage, "lastMessage" | "createdAt"> {
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
