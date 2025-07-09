import { useCallback } from "react";
import { useAppSelector } from "./redux_hooks";

type SocketRequest = {
  type: string;
  params?: Record<string, any>;
};
export const useSocket = () => {
  const { socket, isConnected } = useAppSelector((state) => state.socket);

  const isReadySocket = Boolean(socket && isConnected);

  const sendSocketMessage = useCallback(
    (request: SocketRequest) => {
      if (!isReadySocket) {
        console.warn("Socket is not ready to send messages");
        return false;
      }

      try {
        if (!socket) {
          console.warn("Socket is not ready to send sendSocketMessage");
          return;
        }

        socket.send(JSON.stringify(request));
        return true;
      } catch (error) {
        console.error("Failed to send socket message:", error);
        return false;
      }
    },
    [isReadySocket, socket]
  );

  return {
    sendSocketMessage,
    isReadySocket,
  };
};
