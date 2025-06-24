import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ChatErrror,
  ChatState,
  Conversation,
  DatalatestMessageDialog,
  DataLatestMessageGroup,
  FormatDataListLastMessage,
} from "../../types/chat";

const initialState: ChatState = {
  latestMessageGroup: [],
  latestMessageDialog: [],
  lastMessagesChat: [],
  isErrorMessage: [],
  firstLoadingData: false,
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
      state.lastMessagesChat = [...state.lastMessagesChat, ...action.payload];
      state.firstLoadingData = true;
      state.lastPageLoaded = !action.payload.length;
    },

    latestMessageDialogReceived: (
      state,
      action: PayloadAction<DatalatestMessageDialog[]>
    ) => {
      state.latestMessageDialog = [
        ...state.latestMessageDialog,
        ...action.payload,
      ];
    },

    latestMessageGroupReceived: (
      state,
      action: PayloadAction<DataLatestMessageGroup[]>
    ) => {
      state.latestMessageGroup = [
        ...state.latestMessageGroup,
        ...action.payload,
      ];
    },

    isErrorReceived: (state, action: PayloadAction<ChatErrror>) => {
      state.isErrorMessage.push(action.payload);
      state.isError = false;
    },
    resetChatsState: (state) => {
      state.isError = false;
      state.firstLoadingData = false;
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
