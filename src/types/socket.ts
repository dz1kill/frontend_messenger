export interface WebSocketError {
  error: unknown;
  message: string;
}

export interface SocketState {
  socket: WebSocket | null;
  isConnected: boolean;
  error: string | null;
}
