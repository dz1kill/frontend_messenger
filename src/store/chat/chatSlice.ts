import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatResponse, ChatState } from "../../types/chat";
import { WebSocketError } from "../../types/websocket";

const RETRY_CONFIG = {
  maxRetries: 10,
  retryDelay: 2000,
};

const createWebSocket = (token: string, socketUrl: string): WebSocket => {
  return new WebSocket(socketUrl, ["auth", token]);
};

const attemptWebSocketConnection = (
  token: string,
  socketUrl: string
): Promise<WebSocket> => {
  return new Promise((resolve, reject) => {
    const socket = createWebSocket(token, socketUrl);

    socket.onopen = () => {
      resolve(socket);
    };

    socket.onerror = () => {
      reject(new Error("WebSocket connection failed (onerror)"));
    };
    socket.onclose = (event) => {
      reject(new Error("WebSocket connection failed (onclose)"));
    };
  });
};

const retryConnection = async (
  token: string,
  socketUrl: string,
  retryCount: number
): Promise<WebSocket | WebSocketError> => {
  try {
    await new Promise((resolve) =>
      setTimeout(resolve, RETRY_CONFIG.retryDelay)
    );
    return await attemptWebSocketConnection(token, socketUrl);
  } catch (error) {
    if (retryCount < RETRY_CONFIG.maxRetries) {
      return await retryConnection(token, socketUrl, retryCount + 1);
    }
    return {
      error:
        error instanceof Error ? error : new Error("Unknown connection error"),
      message: `Error server WS`,
    };
  }
};

export const initUseChat = async (): Promise<WebSocket | WebSocketError> => {
  const token = localStorage.getItem("token");
  const socketUrl = process.env.REACT_APP_API_SOCKET_URL;

  if (!socketUrl || !token) {
    return {
      error: new Error("Missing credentials"),
      message: "Missing token or socket URL",
    };
  }

  try {
    return await attemptWebSocketConnection(token, socketUrl);
  } catch (error) {
    return await retryConnection(token, socketUrl, 1);
  }
};

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
