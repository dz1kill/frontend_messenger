import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ChatErrror,
  ChatState,
  FormatDataListLastMessage,
} from "../../types/chat";

const initialState: ChatState = {
  lastMessages: [],
  isErrorMessage: [],
  firstLoadingData: false,
  lastPageLoaded: false,
  isError: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    listLastMessageReceived: (
      state,
      action: PayloadAction<FormatDataListLastMessage[]>
    ) => {
      state.lastMessages = state.lastMessages = [
        ...state.lastMessages,
        ...action.payload,
      ];
      state.firstLoadingData = true;
      state.lastPageLoaded = !action.payload.length;
    },
    isErrorReceived: (state, action: PayloadAction<ChatErrror>) => {
      state.isErrorMessage.push(action.payload);
      state.isError = false;
    },
    resetChatsState: (state) => {
      state.isError = false;
      state.firstLoadingData = false;
      state.lastMessages = [];
      state.isErrorMessage = [];
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

export const { listLastMessageReceived, isErrorReceived } = chatSlice.actions;
export default chatSlice.reducer;
