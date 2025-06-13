import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import styles from "../../styles/Sidebar.module.css";
import ChatItem from "../chatItem/chatItem";
import { RootState } from "../../store/store";
import { DataListLastMessage } from "../../types/chat";
import { REQ_LIST_LAST_MESSAGE } from "./constants";

const Sidebar: React.FC = () => {
  const [dataListLastMessage, setDataListLastMessage] = useState<
    DataListLastMessage[]
  >([]);
  const { socket, isConnected } = useSelector(
    (state: RootState) => state.socket
  );
  const { lastMessages, hasFetchedData } = useSelector(
    (state: RootState) => state.chats
  );

  useEffect(() => {
    if (socket && isConnected && !hasFetchedData) {
      socket.send(JSON.stringify(REQ_LIST_LAST_MESSAGE));
    }
  }, [socket, isConnected, hasFetchedData]);

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
