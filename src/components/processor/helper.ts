import {
  DatalatestMessageDialog,
  DataLatestMessageGroup,
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

    const companionId =
      item.groupId != null
        ? null
        : item.senderId === userId
        ? item.receiverId
        : item.senderId;
    return {
      companionName,
      companionId,
      name: nameConversation,
      messageId: item.messageId,
      content: item.content,
      senderId: item.senderId,
      senderName: item.senderName,
      receiverId: item.receiverId,
      receiverName: item.receiverName,
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
      groupId: item.groupId,
      groupName: item.groupName,
      createdAt: item.createdAt,
    };
  });
};

export const formatPrivateMessageConversation = (message: any) => {
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");

  return [
    {
      messageId: message.messageId,
      content: message.message,
      sender: "contact",
      senderId: message.senderId,
      senderName: message.senderName,
      receiverId: userId,
      receiverName: userName,
      createdAt: message.createdAt,
    },
  ];
};

export const formatPrivateMessageChat = (message: any) => {
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");
  return [
    {
      companionName: message.senderName,
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
