import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SocketState } from "../../types/socket";

const initialState: SocketState = {
  socket: null,
  isConnected: false,
  error: null,
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    socketConnected: (state, action: PayloadAction<WebSocket>) => {
      state.socket = action.payload;
      state.isConnected = true;
      state.error = null;
    },
    connectionError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isConnected = false;
    },
    socketDisconnected: (state) => {
      state.socket = null;
      state.isConnected = false;
    },
    resetSocketState: (state) => {
      state.socket = null;
      state.isConnected = false;
      state.error = null;
    },
  },
});

export const {
  resetSocketState,
  socketConnected,
  connectionError,
  socketDisconnected,
} = socketSlice.actions;
export default socketSlice.reducer;
