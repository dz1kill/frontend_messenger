import { ResListLastMessage } from "../../types/chat";

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

export const formatChatData = (resServer: ResListLastMessage) => {
  return resServer.params.data.map((item) => {
    const resultTime = formatDate(item.createdAt);
    return {
      name: item.groupName !== null ? item.groupName : item.senderName,
      id: item.id,
      lastMessage: item.content,
      time: resultTime,
    };
  });
};
