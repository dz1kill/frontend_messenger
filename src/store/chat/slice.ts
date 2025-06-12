import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatState, ResListLastMessage } from "../../types/chat";
import { GroupedChatData } from "../../types/sidebar";

const initialState: ChatState = {
  lastMessages: {},
  isLoading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    listLastMessageReceived: (
      state,
      action: PayloadAction<GroupedChatData>
    ) => {
      state.lastMessages = action.payload;
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

export const { listLastMessageReceived } = chatSlice.actions;
export default chatSlice.reducer;
