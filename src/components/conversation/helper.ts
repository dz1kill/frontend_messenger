import {
  Conversation,
  FormatLatestMessageDialog,
  FormatLatestMessageGroup,
  LatestMessageDialogState,
  LatestMessageGroupState,
} from "../../types/chat";

export const formatTime = (createdAt: string) => {
  const date = new Date(createdAt);
  const time = date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return time;
};

export const formatDateLabel = (date: Date) => {
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isToday) {
    return "Сегодня";
  }
  if (isYesterday) {
    return "Вчера";
  }
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
    });
  }

  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const shouldShowDate = (
  messages: Array<{ createdAt: string }>,
  index: number
) => {
  if (index === 0) return true;

  const current = new Date(messages[index].createdAt);
  const prev = new Date(messages[index - 1].createdAt);

  return (
    current.getFullYear() !== prev.getFullYear() ||
    current.getMonth() !== prev.getMonth() ||
    current.getDate() !== prev.getDate()
  );
};

export const getMsgConversationDialog = (
  currentConversation: Conversation | null,
  latestMessageDialog: LatestMessageDialogState
) => {
  if (!currentConversation || !currentConversation.companionId) {
    return [];
  }
  const companionKey = currentConversation.companionId.toString() || "";
  return latestMessageDialog[companionKey] || [];
};

export const getMsgConversationGroup = (
  currentConversation: Conversation | null,
  latestMessageGroup: LatestMessageGroupState
) => {
  if (!currentConversation || !currentConversation.groupId) {
    return [];
  }
  const groupId = currentConversation.groupId.toString() || "";
  return latestMessageGroup[groupId] || [];
};

export const checkFirstLoad = (
  currentConversation: Conversation | null,
  latestMessageDialog: LatestMessageDialogState,
  latestMessageGroup: LatestMessageGroupState
): boolean => {
  if (!currentConversation) return false;

  const { companionId, groupId } = currentConversation;

  if (companionId) {
    const key = companionId.toString();
    if (latestMessageDialog[key]) return true;
  }

  if (groupId) {
    const key = groupId.toString();
    if (latestMessageGroup[key]) return true;
  }

  return false;
};

export const getLastMessageTime = (
  messages: FormatLatestMessageDialog[] | FormatLatestMessageGroup[]
) => messages[0]?.createdAt;

export const getNewCursor = (
  currentConversation: Conversation | null,
  latestMessageDialog: LatestMessageDialogState,
  latestMessageGroup: LatestMessageGroupState
) => {
  if (currentConversation?.companionId)
    return getLastMessageTime(
      getMsgConversationDialog(currentConversation, latestMessageDialog)
    );
  if (currentConversation?.groupId)
    return getLastMessageTime(
      getMsgConversationGroup(currentConversation, latestMessageGroup)
    );

  return null;
};

export const dataToChatState = (
  currentConversation: Conversation | null,
  inputData: string,
  messageId: string
) => {
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");

  if (!currentConversation || !userId || !userName) return [];

  const dataSendChatMessage = [
    {
      messageId,
      companionLastName: currentConversation.companionLastName,
      companionName: currentConversation.companionName,
      companionId: currentConversation.companionId,
      name:
        currentConversation.groupName ??
        currentConversation.companionName ??
        "Без имени",
      content: inputData,
      senderId: userId,
      senderName: userName,
      receiverId: currentConversation.companionId,
      receiverName: currentConversation.companionName,
      groupId: currentConversation.groupId,
      groupName: currentConversation.groupName,
      createdAt: new Date().toISOString(),
    },
  ];

  return dataSendChatMessage;
};

export const dataToDialogState = (
  currentConversation: Conversation | null,
  inputData: string,
  messageId: string
) => {
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");

  if (
    !currentConversation ||
    !userId ||
    !userName ||
    !currentConversation.companionId ||
    !currentConversation.companionName
  )
    return [];

  const dataSendDialogMessage = [
    {
      messageId,
      content: inputData,
      sender: "user",
      senderId: userId,
      senderName: userName,
      receiverId: currentConversation.companionId,
      receiverName: currentConversation.companionName,
      createdAt: new Date().toISOString(),
    },
  ];
  return dataSendDialogMessage;
};

export const dataToGroupState = (
  currentConversation: Conversation | null,
  inputData: string,
  messageId: string
) => {
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");

  if (
    !currentConversation ||
    !userId ||
    !userName ||
    !currentConversation.groupId ||
    !currentConversation.groupName
  )
    return [];
  const dataSendGroupMessage = [
    {
      notification: false,
      messageId,
      content: inputData,
      sender: "user",
      senderId: userId,
      senderName: userName,
      groupId: currentConversation.groupId,
      groupName: currentConversation.groupName,
      createdAt: new Date().toISOString(),
    },
  ];
  return dataSendGroupMessage;
};

export const messageErrorDeleteDialog = (statusCode: number) => {
  switch (statusCode) {
    case 401:
      return "Ошибка авторизации";
    case 500:
      return "Ошибка сервера";
    default:
      return "Неизвестная ошибка сервера";
  }
};
