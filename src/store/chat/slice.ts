import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatResponse, ChatState } from "../../types/chat";

const initialState: ChatState = {
  chats: [],
  isLoading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatResponse>) => {
      state.chats.push(action.payload);
    },
  },
});

export const { addMessage } = chatSlice.actions;
export default chatSlice.reducer;
