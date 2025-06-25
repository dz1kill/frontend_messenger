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
  latestMessageGroup: [],
  latestMessageDialog: [],
  lastMessagesChat: [],
  isErrorMessage: [],
  firstLoadingDataChat: false,
  lastPageLoaded: false,
  isError: false,
  currentConversation: null,
};

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
      state.firstLoadingDataChat = true;
      state.lastPageLoaded = !action.payload.length;
    },

    latestMessageDialogReceived: (
      state,
      action: PayloadAction<FormaLatestMessageDialog[]>
    ) => {
      state.latestMessageDialog = [
        ...state.latestMessageDialog,
        ...action.payload,
      ].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },

    latestMessageGroupReceived: (
      state,
      action: PayloadAction<FormatLatestMessageGroup[]>
    ) => {
      state.latestMessageGroup = [
        ...state.latestMessageGroup,
        ...action.payload,
      ].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },

    isErrorReceived: (state, action: PayloadAction<ChatErrror>) => {
      state.isErrorMessage.push(action.payload);
      state.isError = false;
    },
    resetChatsState: (state) => {
      state.isError = false;
      state.firstLoadingDataChat = false;
      state.lastMessagesChat = [];
      state.isErrorMessage = [];
      state.currentConversation = null;
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
