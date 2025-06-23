export interface ConversationItemProps {
  messages: { id: string; text: string; sender: string; timestamp: Date }[];
}
