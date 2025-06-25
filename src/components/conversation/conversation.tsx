import React from "react";
import styles from "../../styles/conversation.module.css";
import ConversationItem from "./item";
import { useAppSelector } from "../../libs/redux/hooks";
import { RootState } from "../../store/store";
import { messages } from "./data";
import { formatDateLabel, shouldShowDate } from "./helper";
import {
  REQ_LATEST_MESSAGE_DIALOG,
  REQ_LATEST_MESSAGE_GROUP,
} from "../../utils/constants";

const Conversation: React.FC = () => {
  const { currentConversation } = useAppSelector(
    (state: RootState) => state.chats
  );
  const { socket, isConnected } = useAppSelector(
    (state: RootState) => state.socket
  );
  const userId = Number(localStorage.getItem("userId"));

  // if (!socket || !isConnected || !userId || !currentConversation) return;
  // if (!currentConversation.groupId) {
  //   socket.send(
  //     JSON.stringify({
  //       ...REQ_LATEST_MESSAGE_DIALOG,
  //       params: {
  //         receiverId:
  //           currentConversation.senderId === userId
  //             ? currentConversation.receiverId
  //             : currentConversation.senderId,
  //         limit: REQ_LATEST_MESSAGE_DIALOG.params.limit,
  //         cursorCreatedAt: null,
  //       },
  //     })
  //   );
  // } else {
  //   socket.send(
  //     JSON.stringify({
  //       ...REQ_LATEST_MESSAGE_GROUP,
  //       params: {
  //         groupId: currentConversation.groupId,
  //         limit: REQ_LATEST_MESSAGE_GROUP.params.limit,
  //         cursorCreatedAt: null,
  //       },
  //     })
  //   );
  // }

  return (
    <div className={styles.conversationWindow}>
      <div className={styles.conversationHeader}>
        <h2>{currentConversation ? currentConversation.name : ""}</h2>
      </div>
      <div className={styles.messagesContainer}>
        {messages.map((chat, index) => (
          <React.Fragment key={chat.messageId}>
            {shouldShowDate(messages, index) && (
              <div className={styles.dateDivider}>
                {formatDateLabel(new Date(chat.createdAt))}
              </div>
            )}
            <ConversationItem {...chat} />
          </React.Fragment>
        ))}
      </div>
      <div className={styles.messageInput}>
        <input
          type="text"
          placeholder="Написать сообщение..."
          className={styles.inputField}
        />
        <button className={styles.sendButton}>Отправить</button>
      </div>
    </div>
  );
};

export default Conversation;
