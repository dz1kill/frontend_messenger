export const TYPE_LIST_LAST_MESSAGE = "listLastMessage";
export const TYPE_LATEST_MESSAGE_DIALOG = "getlatestMessageDialog";
export const TYPE_LATEST_MESSAGE_GROUP = "getlatestMessageGroup";
export const TYPE_PRIVATE_MESSAGE = "privateMessage";
export const TYPE_GROUP_MESSAGE = "messageInGroup";

export const REQ_LIST_LAST_MESSAGE = {
  type: "listLastMessage",
  params: {
    limit: 13,
    cursorCreatedAt: null,
  },
};

export const REQ_LATEST_MESSAGE_DIALOG = {
  type: "getlatestMessageDialog",
  params: {
    receiverId: null,
    limit: 12,
    cursorCreatedAt: null,
  },
};

export const REQ_LATEST_MESSAGE_GROUP = {
  type: "getlatestMessageGroup",
  params: {
    groupName: null,
    groupId: null,
    limit: 12,
    cursorCreatedAt: null,
  },
};

export const REQ_SEND_MESSAGE_GROUP = {
  type: "messageInGroup",
  params: {
    messageId: null,
    groupId: null,
    content: null,
  },
};

export const REQ_SEND_MESSAGE_DIALOG = {
  type: "privateMessage",
  params: {
    messageId: null,
    receiverId: null,
    content: null,
  },
};
