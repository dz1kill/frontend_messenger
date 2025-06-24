export interface DataListLastMessage {
  id: number;
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

export interface DatalatestMessageDialog {
  senderId: number;
  senderName: string;
  receiverId: number;
  receiverName: string;
  content: string;
  createdAt: string;
}

export interface DataLatestMessageGroup {
  senderId: number;
  senderName: string;
  groupId: number;
  groupName: string;
  content: string;
  createdAt: string;
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

export interface ReslatestMessageDialog {
  type: "getlatestMessageDialog";
  success: boolean;
  params: {
    data: DatalatestMessageDialog[];
    message: string | null;
    senderName: string | null;
  };
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

export interface FormatDataListLastMessage {
  name: string;
  messageId: number;
  lastMessage: string;
  time: string;
  senderId: number;
  senderName: string;
  receiverId: number | null;
  receiverName: string | null;
  groupId: number | null;
  groupName: string | null;
  createdAt: string;
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
  latestMessageGroup: DataLatestMessageGroup[];
  latestMessageDialog: DatalatestMessageDialog[];
  lastMessagesChat: FormatDataListLastMessage[];
  isErrorMessage: ChatErrror[];
  firstLoadingData: boolean;
  lastPageLoaded: boolean;
  isError: boolean;
  currentConversation: Conversation | null;
}
