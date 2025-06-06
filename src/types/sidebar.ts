export type ResListLastMessage = {
  type: string;
  success: boolean;
  params: {
    data: {
      id: number;
      senderId: number;
      senderName: string;
      receiverId: null | number;
      receiverName: null | string;
      groupId: null | number;
      groupName: null | string;
      content: string;
      createdAt: string;
      updatedAt: string;
      deletedAt: null | string;
    }[];

    message: null | string;
    senderName: null | string;
  };
};
