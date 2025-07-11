import {
  DatalatestMessageDialog,
  DataLatestMessageGroup,
  ItemGroupMessage,
  ItemPrivateMessage,
  LatestMessageDialogState,
  LatestMessageGroupState,
  ResListLastMessageChat,
} from "../../types/chat";

export const formatDataListLastMessage = (
  resServer: ResListLastMessageChat
) => {
  const userId = localStorage.getItem("userId");

  return resServer.params.data.map((item) => {
    const nameConversation =
      item.groupName ??
      (item.senderId === userId ? item.receiverName : item.senderName) ??
      "Без имени";

    const companionName =
      item.groupId != null
        ? null
        : item.senderId === userId
        ? item.receiverName
        : item.senderName;

    const companionLastName =
      item.groupId != null
        ? null
        : item.senderId === userId
        ? item.receiverLastName
        : item.senderLastName;

    const companionId =
      item.groupId != null
        ? null
        : item.senderId === userId
        ? item.receiverId
        : item.senderId;

    return {
      companionName,
      companionLastName,
      companionId,
      name: nameConversation,
      messageId: item.messageId,
      content: item.content,
      senderId: item.senderId,
      senderName: item.senderName,
      senderLastName: item.senderLastName,
      receiverId: item.receiverId,
      receiverName: item.receiverName,
      receiverLastName: item.receiverLastName,
      groupId: item.groupId,
      groupName: item.groupName,
      createdAt: item.createdAt,
    };
  });
};

export const formatDatalatestMessageDialog = (
  messages: DatalatestMessageDialog[]
) => {
  const userId = localStorage.getItem("userId");

  return messages.map((item) => {
    return {
      messageId: item.messageId,
      content: item.content,
      sender: item.senderId === userId ? "user" : "contact",
      senderId: item.senderId,
      senderName: item.senderName,
      receiverId: item.receiverId,
      receiverName: item.receiverName,
      createdAt: item.createdAt,
    };
  });
};

export const formatDatalatestMessageGroup = (
  messages: DataLatestMessageGroup[]
) => {
  const userId = localStorage.getItem("userId");

  return messages.map((item) => {
    return {
      messageId: item.messageId,
      content: item.content,
      sender: item.senderId === userId ? "user" : "contact",
      senderId: item.senderId,
      senderName: item.senderName,
      senderLastName: item.senderLastName,
      groupId: item.groupId,
      groupName: item.groupName,
      createdAt: item.createdAt,
    };
  });
};

export const formatPrivateMessage = (message: ItemPrivateMessage) => {
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");
  if (!userId || !userName) return [];

  return [
    {
      messageId: message.messageId,
      content: message.message,
      sender: "contact",
      senderId: message.senderId,
      senderName: message.senderName,
      senderLastName: message.senderLastName,
      receiverId: userId,
      receiverName: userName,
      createdAt: message.createdAt,
    },
  ];
};

export const formatPrivateMessageChat = (message: ItemPrivateMessage) => {
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");

  if (!userId || !userName) return [];
  return [
    {
      companionName: message.senderName,
      companionLastName: message.senderLastName,
      companionId: message.senderId,
      name: message.senderName,
      messageId: message.messageId,
      content: message.message,
      senderId: message.senderId,
      senderName: message.senderName,
      receiverId: userId,
      receiverName: userName,
      groupId: null,
      groupName: null,
      createdAt: message.createdAt,
    },
  ];
};

export const formatGroupMessage = (message: ItemGroupMessage) => {
  return [
    {
      messageId: message.messageId,
      content: message.message,
      sender: "contact",
      senderId: message.senderId,
      senderName: message.senderName,
      groupId: message.groupId,
      groupName: message.groupName,
      createdAt: message.createdAt,
    },
  ];
};
export const formatGroupMessageChat = (message: ItemGroupMessage) => {
  return [
    {
      messageId: message.messageId,
      companionName: null,
      companionId: null,
      companionLastName: null,
      name: message.groupName,
      content: message.message,
      senderId: message.senderId,
      senderName: message.senderName,
      receiverId: null,
      receiverName: null,
      groupId: message.groupId,
      groupName: message.groupName,
      createdAt: message.createdAt,
    },
  ];
};

export const checkFirstLoad = (
  item: ItemPrivateMessage | ItemGroupMessage,
  latestMessageDialog: LatestMessageDialogState,
  latestMessageGroup: LatestMessageGroupState
): boolean => {
  if (!item) return false;

  if ("groupId" in item) {
    if (latestMessageGroup[item.groupId]) return true;
  }
  if ("senderId" in item) {
    if (latestMessageDialog[item.senderId]) return true;
  }

  return false;
};
