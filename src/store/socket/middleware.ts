import { Middleware, MiddlewareAPI } from "@reduxjs/toolkit";
import { socketConnected, socketDisconnected, connectionError } from "./slice";
import { RETRY_DELAY } from "../../utils/constants";

let socket: WebSocket | null = null;
let shouldReconnect = true;

const createSocketConnection = (
  url: string,
  token: string
): Promise<WebSocket> => {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url, ["auth", token]);

    ws.onopen = () => resolve(ws);
    ws.onerror = () => reject(new Error("WebSocket connection error"));
  });
};

const initiateConnection = async (
  store: MiddlewareAPI,
  url: string,
  token: string
) => {
  try {
    socket = await createSocketConnection(url, token);
    store.dispatch(socketConnected(socket));

    socket.onclose = (event) => {
      store.dispatch(connectionError(`Connection closed: code ${event.code}`));

      if (shouldReconnect && event.code !== 4001) {
        setTimeout(() => initiateConnection(store, url, token), RETRY_DELAY);
      } else {
        store.dispatch(socketDisconnected());
        console.warn("No reconnect: closed with code", event.code);
      }
    };

    socket.onerror = () => {
      store.dispatch(connectionError("WebSocket runtime error"));
      socket?.close();
    };
  } catch (error: any) {
    store.dispatch(connectionError(error.message));

    if (shouldReconnect && error.message.includes("connection error")) {
      setTimeout(() => initiateConnection(store, url, token), RETRY_DELAY);
    }
  }
};

export const socketMiddleware: Middleware =
  (store) => (next) => (action: any) => {
    if (action.type === "socket/connect") {
      shouldReconnect = true;
      const token = localStorage.getItem("token");
      const url = process.env.REACT_APP_API_SOCKET_URL;

      if (!token || !url) {
        store.dispatch(connectionError("Missing token or socket URL"));
        return next(action);
      }

      initiateConnection(store, url, token);
    }

    if (action.type === "socket/socketDisconnected") {
      shouldReconnect = false;

      if (socket) {
        socket.close(4001, "Client requested disconnect"); // передаём код
        socket = null;
        localStorage.removeItem("token");
        store.dispatch(socketDisconnected());
      }
    }

    return next(action);
  };
