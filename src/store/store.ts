import { configureStore } from "@reduxjs/toolkit";

import authSlice from "./auth/slice";
import socketSlice from "./socket/slice";
import { socketMiddleware } from "./socket/middleware";
import chatSlice from "./chat/slice";
import profileSlice from "./profile/slice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    socket: socketSlice,
    chats: chatSlice,
    profile: profileSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(socketMiddleware),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
