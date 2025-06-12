import React, { useEffect, useState } from "react";
import styles from "../../styles/Sidebar.module.css";
import ChatItem from "../chatItem/chatItem";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { listLastMessageReceived } from "../../store/chat/slice";
import { formatChatData } from "./helper";
import { GroupedChatData } from "../../types/sidebar";

const sendData = {
  type: "listLastMessage",
  params: {
    limit: 5,
    page: 1,
  },
};

const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const { lastMessages } = useSelector((state: RootState) => state.chats);
  const [dataListLastMessage, setDataListLastMessage] =
    useState<GroupedChatData>();
  const { socket, isConnected } = useSelector(
    (state: RootState) => state.socket
  );

  useEffect(() => {
    if (socket) {
      if (isConnected) socket.send(JSON.stringify(sendData));
    }
  }, [socket, isConnected]);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const resData = JSON.parse(event.data);
        console.log("🚀 ~ useEffect ~ resData:", resData);
        if (resData.type === "listLastMessage") {
          const result = formatChatData(resData);
          dispatch(listLastMessageReceived(result));
        }
      };
    }
  }, [dispatch, socket]);

  useEffect(() => {
    if (Object.keys(lastMessages).length !== 0) {
      setDataListLastMessage(lastMessages);
    }
  }, [lastMessages]);

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h2>Chats</h2>
      </div>

      <div className={styles.chatList}>
        {Object.values(dataListLastMessage!).map((chat) => (
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
