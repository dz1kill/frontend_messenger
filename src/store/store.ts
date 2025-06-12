import { configureStore } from "@reduxjs/toolkit";

import userSlice from "./auth/slice";
import socketSlice from "./socket/slice";
import { socketMiddleware } from "./socket/middleware";
import chatSlice from "./chat/slice";

const store = configureStore({
  reducer: {
    user: userSlice,
    socket: socketSlice,
    chats: chatSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(socketMiddleware),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
