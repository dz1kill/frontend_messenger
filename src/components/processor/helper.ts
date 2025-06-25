import {
  DatalatestMessageDialog,
  DataLatestMessageGroup,
  ResListLastMessageChat,
} from "../../types/chat";

export const formatDate = (date: string) => {
  const inputDate = new Date(date);
  const now = new Date();

  const diffMs = now.getTime() - inputDate.getTime();
  const diffSec = diffMs / 1000;
  const diffDays = diffSec / (60 * 60 * 24);

  const sameDay = inputDate.getDate() === now.getDate();
  const sameMonth = inputDate.getMonth() === now.getMonth();
  const sameYear = inputDate.getFullYear() === now.getFullYear();
  const isToday = sameDay && sameMonth && sameYear;

  switch (true) {
    case isToday:
      return inputDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

    case diffDays <= 7:
      return inputDate.toLocaleDateString("ru-RU", { weekday: "short" });

    case diffDays <= 365:
      return inputDate.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
      });

    default:
      return inputDate.getFullYear().toString();
  }
};

export const formatDataListLastMessage = (
  resServer: ResListLastMessageChat
) => {
  const userId = Number(localStorage.getItem("userId"));
  return resServer.params.data.map((item) => {
    const resultDate = formatDate(item.createdAt);
    const nameConversation =
      item.groupName ??
      (item.senderId === userId ? item.receiverName : item.senderName) ??
      "Без имени";

    return {
      name: nameConversation,
      messageId: item.messageId,
      content: item.content,
      time: resultDate,
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
      time: new Date(item.createdAt),
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
      time: new Date(item.createdAt),
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
