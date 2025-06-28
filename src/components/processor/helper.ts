import {
  DatalatestMessageDialog,
  DataLatestMessageGroup,
  ResListLastMessageChat,
} from "../../types/chat";

export const formatDataListLastMessage = (
  resServer: ResListLastMessageChat
) => {
  const userId = Number(localStorage.getItem("userId"));

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
  const userId = Number(localStorage.getItem("userId"));

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
  const userId = Number(localStorage.getItem("userId"));

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
