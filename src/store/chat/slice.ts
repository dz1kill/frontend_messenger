import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ChatErrror,
  ChatState,
  Conversation,
  FormatLatestMessageDialog,
  FormatDataListLastMessage,
  FormatLatestMessageGroup,
} from "../../types/chat";

const initialState: ChatState = {
  latestMessageGroup: {},
  latestMessageDialog: {},
  lastMessagesChat: [],
  isErrorMessage: [],
  lastPageLoadedChat: false,
  isLastPageLoadedConversation: false,
  isError: false,
  currentConversation: null,
  hasFetchedOnceChat: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    targetConversation: (state, action: PayloadAction<Conversation>) => {
      state.currentConversation = action.payload;
    },
    clearCurrentConversation: (state) => {
      state.currentConversation = null;
    },

    setIsLastPageLoadedConversation(state, action: PayloadAction<boolean>) {
      state.isLastPageLoadedConversation = action.payload;
    },

    listLastMessageReceived: (
      state,
      action: PayloadAction<FormatDataListLastMessage[]>
    ) => {
      let updatedMessages = [...state.lastMessagesChat];

      action.payload.forEach((newMessage) => {
        if (newMessage.groupId === null) {
          updatedMessages = updatedMessages.filter(
            (message) => message.companionId !== newMessage.companionId
          );
        }
        if (newMessage.groupId !== null) {
          updatedMessages = updatedMessages.filter(
            (message) => message.groupId !== newMessage.groupId
          );
        }
        updatedMessages.push(newMessage);
      });

      state.lastMessagesChat = updatedMessages.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      state.hasFetchedOnceChat = true;
      state.lastPageLoadedChat = !action.payload.length;
    },

    removeLastMessageByCompanionId: (state, action: PayloadAction<string>) => {
      state.lastMessagesChat = state.lastMessagesChat.filter(
        (message) => message.companionId !== action.payload
      );
    },

    removeLastMessageByGroupId: (state, action: PayloadAction<string>) => {
      state.lastMessagesChat = state.lastMessagesChat.filter(
        (message) => message.groupId !== action.payload
      );
    },

    latestMessageDialogReceived: (
      state,
      action: PayloadAction<FormatLatestMessageDialog[]>
    ) => {
      const userId = localStorage.getItem("userId");

      if (action.payload.length === 0) {
        state.isLastPageLoadedConversation = true;
        return;
      }

      const companionId =
        action.payload[0].senderId === userId
          ? action.payload[0].receiverId
          : action.payload[0].senderId;

      const sortedMessages = [...action.payload].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      if (!state.latestMessageDialog[companionId]) {
        state.latestMessageDialog[companionId] = sortedMessages;
      } else {
        state.latestMessageDialog[companionId] = [
          ...state.latestMessageDialog[companionId],
          ...sortedMessages,
        ].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }
    },

    removeDialogMessages: (state, action: PayloadAction<string>) => {
      const companionId = action.payload;
      delete state.latestMessageDialog[companionId];
    },

    latestMessageGroupReceived: (
      state,
      action: PayloadAction<FormatLatestMessageGroup[]>
    ) => {
      if (action.payload.length === 0) {
        state.isLastPageLoadedConversation = true;
        return;
      }
      state.isLastPageLoadedConversation = !action.payload.length;
      const groupId = action.payload[0].groupId;

      const sortedNewMessages = [...action.payload].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      if (!state.latestMessageGroup[groupId]) {
        state.latestMessageGroup[groupId] = sortedNewMessages;
      } else {
        state.latestMessageGroup[groupId] = [
          ...state.latestMessageGroup[groupId],
          ...sortedNewMessages,
        ].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }
    },

    removeGroupMessages: (state, action: PayloadAction<string>) => {
      const groupId = action.payload;
      delete state.latestMessageGroup[groupId];
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
      state.lastPageLoadedChat = false;
      state.isLastPageLoadedConversation = false;
      state.isError = false;
      state.currentConversation = null;
      state.hasFetchedOnceChat = false;
    },
  },
});

export const {
  listLastMessageReceived,
  isErrorReceived,
  targetConversation,
  resetChatsState,
  latestMessageDialogReceived,
  latestMessageGroupReceived,
  setIsLastPageLoadedConversation,
  removeLastMessageByCompanionId,
  removeDialogMessages,
  clearCurrentConversation,
  removeLastMessageByGroupId,
  removeGroupMessages,
} = chatSlice.actions;
export default chatSlice.reducer;
