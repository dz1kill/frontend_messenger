export interface DataListLastMessage {
  name: string;
  id: number;
  lastMessage: string;
  time: string;
}

export interface ChatErrror {
  error: string;
  type: string;
  message: string;
}

export interface ResListLastMessage {
  type: "resListLastMessage";
  success: boolean;
  params: {
    data: {
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
    }[];
    message: string | null;
    senderName: string | null;
  };
}
// export interface ResLatestMessageDialog {
//   type: "getlatestMessageDialog";
//   success: boolean;
//   params: {
//     data: {
//       sender_id: number;
//       receiver_id: number;
//       receverName: string;
//       content: string;
//       created_at: string;
//     }[];
//     message: string | null;
//     senderName: string | null;
//   };
// }

export interface ChatState {
  lastMessages: DataListLastMessage[];
  isError: ChatErrror[];
  hasFetchedData: boolean;
}
