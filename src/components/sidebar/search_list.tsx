import React from "react";
import { v4 as uuidv4 } from "uuid";
import styles from "../../styles/sidebar_search.module.css";
import { SearchData } from "../../types/use_cases";
import { useAppDispatch } from "../../hooks/redux_hooks";
import {
  listLastMessageReceived,
  targetConversation,
} from "../../store/chat/slice";

const SearchItem: React.FC<SearchData & { onBlur: () => void }> = ({
  userId,
  firstName,
  lastName,
  email,
  groupId,
  groupName,
  onBlur,
}) => {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(
      listLastMessageReceived([
        {
          messageId: uuidv4(),
          name: (groupId ? groupName : firstName) || "Имя",
          content: "",
          companionName: firstName,
          companionLastName: lastName,
          companionId: userId,
          groupId,
          groupName,
          createdAt: new Date().toISOString(),
        },
      ])
    );
    dispatch(
      targetConversation({
        name: (groupId ? groupName : firstName) || "Имя",
        companionName: firstName,
        companionId: userId,
        companionLastName: lastName,
        groupId,
        groupName,
        content: "",
        cursorCreatedAt: null,
        isFirstLoaded: false,
      })
    );
    onBlur();
  };

  return (
    <div className={styles.chatItem} onClick={handleClick}>
      <div className={styles.avatar}>👤</div>
      <div className={styles.chatInfo}>
        <div className={styles.topRow}>
          <span className={styles.name}>
            {groupName ? groupName : `${firstName} ${lastName}`}
          </span>
        </div>
        <div className={styles.bottomRow}>
          <p className={styles.email}>{groupName ? "" : email}</p>
        </div>
      </div>
    </div>
  );
};

export default SearchItem;
