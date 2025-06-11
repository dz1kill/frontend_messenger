import { configureStore } from "@reduxjs/toolkit";

import userSlice from "./auth/slice";
import socketSlice from "./socket/slice";
import { socketMiddleware } from "./socket/middleware";

const store = configureStore({
  reducer: {
    user: userSlice,
    socket: socketSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(socketMiddleware),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
