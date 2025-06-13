import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DataListLastMessage, ChatErrror, ChatState } from "../../types/chat";

const initialState: ChatState = {
  lastMessages: [],
  isError: [],
  hasFetchedData: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    listLastMessageReceived: (
      state,
      action: PayloadAction<DataListLastMessage>
    ) => {
      state.lastMessages.push(action.payload);
      state.hasFetchedData = true;
    },
    isErrorReceived: (state, action: PayloadAction<ChatErrror>) => {
      state.isError.push(action.payload);
    },
    resetChatsState: (state) => {
      state.hasFetchedData = false;
      state.lastMessages = [];
      state.isError = [];
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
