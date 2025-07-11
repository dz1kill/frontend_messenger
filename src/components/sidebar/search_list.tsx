import React from "react";
import styles from "../../styles/sidebar_search.module.css";
import { SearchData } from "../../types/use_cases";

const SearchItem: React.FC<SearchData> = ({
  groupName,
  firstName,
  lastName,
  email,
}) => {
  return (
    <div className={styles.chatItem}>
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
