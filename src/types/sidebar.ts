interface ChatData {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
}

export type GroupedChatData = {
  [key: string]: ChatData;
};
