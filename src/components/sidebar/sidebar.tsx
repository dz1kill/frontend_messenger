import React, { useEffect, useState } from "react";
import styles from "../../styles/Sidebar.module.css";
import ChatItem from "../chatItem/chatItem";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { listLastMessageReceived } from "../../store/chat/slice";
import { formatChatData } from "./helper";
import { ChatData } from "../../types/chat";

const Sidebar: React.FC = () => {
  const sendData = {
    type: "listLastMessage",
    params: {
      limit: 5,
      page: 1,
    },
  };

  const sendData1 = {
    type: "listLastMessage",
    params: {
      limit: 5,
      page: 2,
    },
  };
  const dispatch = useDispatch();
  const [dataListLastMessage, setDataListLastMessage] = useState<ChatData[]>(
    []
  );
  const { socket, isConnected } = useSelector(
    (state: RootState) => state.socket
  );
  const { lastMessages } = useSelector((state: RootState) => state.chats);

  useEffect(() => {
    if (socket) {
      if (isConnected) socket.send(JSON.stringify(sendData));
      socket.send(JSON.stringify(sendData1));
    }
  }, [socket, isConnected]);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "listLastMessage") {
          const result = formatChatData(data);
          result.forEach((chatData) => {
            dispatch(listLastMessageReceived(chatData));
          });
        }
      };
    }
  }, [dispatch, socket]);

  useEffect(() => {
    if (lastMessages.length > 0) {
      setDataListLastMessage(lastMessages);
    }
  }, [lastMessages]);

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h2>Chats</h2>
      </div>

      <div className={styles.chatList}>
        {dataListLastMessage.map((chat) => (
          <ChatItem
            key={chat.id}
            name={chat.name}
            lastMessage={chat.lastMessage}
            time={chat.time}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
