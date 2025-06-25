export interface DataListLastMessage {
  messageId: number;
  senderId: number;
  senderName: string;
  receiverId: number | null;
  receiverName: string | null;
  groupId: number | null;
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
  time: string;
}

export interface DatalatestMessageDialog {
  messageId: number;
  senderId: number;
  senderName: string;
  receiverId: number;
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

export interface FormaLatestMessageDialog extends DatalatestMessageDialog {
  time: Date;
  sender: string;
}

export interface DataLatestMessageGroup {
  messageId: number;
  senderId: number;
  senderName: string;
  groupId: number;
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
  time: Date;
  sender: string;
}

export interface Conversation
  extends Omit<
    FormatDataListLastMessage,
    "messageId" | "lastMessage" | "time" | "createdAt"
  > {}

export interface ChatErrror {
  error: string;
  type: string;
  message: string;
}

export interface ChatState {
  latestMessageGroup: FormatLatestMessageGroup[];
  latestMessageDialog: FormaLatestMessageDialog[];
  lastMessagesChat: FormatDataListLastMessage[];
  isErrorMessage: ChatErrror[];
  lastPageLoaded: boolean;
  isError: boolean;
  currentConversation: Conversation | null;
}
