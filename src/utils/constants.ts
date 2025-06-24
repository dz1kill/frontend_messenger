export const RETRY_DELAY = 2000;
export const TYPE_LIST_LAST_MESSAGE = "listLastMessage";
export const TYPE_LATEST_MESSAGE_DIALOG = "getlatestMessageDialog";
export const TYPE_LATEST_MESSAGE_GROUP = "getlatestMessageGroup";

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
    limit: 13,
    cursorCreatedAt: null,
  },
};

export const REQ_LATEST_MESSAGE_GROUP = {
  type: "getlatestMessageGroup",
  params: {
    groupId: null,
    limit: 13,
    cursorCreatedAt: null,
  },
};
