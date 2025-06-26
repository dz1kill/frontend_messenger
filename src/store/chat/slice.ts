import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ChatErrror,
  ChatState,
  Conversation,
  FormaLatestMessageDialog,
  FormatDataListLastMessage,
  FormatLatestMessageGroup,
} from "../../types/chat";

const initialState: ChatState = {
  latestMessageGroup: {},
  latestMessageDialog: {},
  lastMessagesChat: [],
  isErrorMessage: [],
  lastPageLoaded: false,
  isError: false,
  currentConversation: null,
  hasFetchedOnceChat: false,
};
const userId = Number(localStorage.getItem("userId"));

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    conversation: (state, action: PayloadAction<Conversation>) => {
      state.currentConversation = action.payload;
    },

    listLastMessageReceived: (
      state,
      action: PayloadAction<FormatDataListLastMessage[]>
    ) => {
      state.lastMessagesChat = [
        ...state.lastMessagesChat,
        ...action.payload,
      ].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      state.hasFetchedOnceChat = true;
      state.lastPageLoaded = !action.payload.length;
    },

    latestMessageDialogReceived: (
      state,
      action: PayloadAction<FormaLatestMessageDialog[]>
    ) => {
      const companionId =
        action.payload[0].senderId === userId
          ? action.payload[0].receiverId
          : action.payload[0].senderId;

      if (!state.latestMessageDialog[companionId]) {
        state.latestMessageDialog[companionId] = action.payload.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else {
        state.latestMessageDialog[companionId] = [
          ...state.latestMessageDialog[companionId],
          ...action.payload,
        ].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
    },

    latestMessageGroupReceived: (
      state,
      action: PayloadAction<FormatLatestMessageGroup[]>
    ) => {
      const groupId = action.payload[0].groupId;
      if (!state.latestMessageGroup[groupId]) {
        state.latestMessageGroup[groupId] = action.payload.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else {
        state.latestMessageGroup[groupId] = [
          ...state.latestMessageGroup[groupId],
          ...action.payload,
        ].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
    },

    isErrorReceived: (state, action: PayloadAction<ChatErrror>) => {
      state.isErrorMessage.push(action.payload);
      state.isError = false;
    },
    resetChatsState: (state) => {
      state.latestMessageGroup = {};
      state.latestMessageDialog = {};
      state.lastMessagesChat = [];
      state.isErrorMessage = [];
      state.lastPageLoaded = false;
      state.isError = false;
      state.currentConversation = null;
      state.hasFetchedOnceChat = false;
    },

    // privateMessage: (state, action: PayloadAction<ChatResponse>) => {
    //   state.chats.push(action.payload);
    // },
    // latestDialogMessageReceived: (
    //   state,
    //   action: PayloadAction<{ dialogId: string; message: Message }>
    // ) => {
    //   const { dialogId, message } = action.payload;
    //   state.dialogMessages[dialogId] = message; // Апд по ключу
    // },
  },
});

export const {
  listLastMessageReceived,
  isErrorReceived,
  conversation,
  resetChatsState,
  latestMessageDialogReceived,
  latestMessageGroupReceived,
} = chatSlice.actions;
export default chatSlice.reducer;
