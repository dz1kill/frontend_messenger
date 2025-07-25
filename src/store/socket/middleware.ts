import { Middleware, MiddlewareAPI } from "@reduxjs/toolkit";
import { socketConnected, socketDisconnected, connectionError } from "./slice";

let socket: WebSocket | null = null;

const createSocketConnection = (
  url: string,
  token: string
): Promise<WebSocket> => {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url, ["auth", token]);
    ws.onopen = () => resolve(ws);
    ws.onerror = (error) => reject(new Error("WebSocket connection error"));
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
      if (event.code !== 4001) {
        initiateConnection(store, url, token);
      } else {
        store.dispatch(socketDisconnected());
        socket?.close(4001, "Client requested disconnect");
        socket = null;
        localStorage.clear();

        console.warn("Unauthorized: closed with code", event.code);
      }
    };
  } catch (error: any) {
    store.dispatch(connectionError(error.message));
    if (error.message.includes("connection error")) {
      initiateConnection(store, url, token);
    }
  }
};

export const socketMiddleware: Middleware =
  (store) => (next) => (action: any) => {
    if (action.type === "socket/connect") {
      const token = localStorage.getItem("token");
      const url = process.env.REACT_APP_API_SOCKET_URL;

      if (!token || !url) {
        store.dispatch(connectionError("Missing token or socket URL"));
        return next(action);
      }

      initiateConnection(store, url, token);
    }

    return next(action);
  };
