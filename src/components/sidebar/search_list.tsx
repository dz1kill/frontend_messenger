import React from "react";
import styles from "../../styles/sidebar_search.module.css";

const SearchItem: React.FC<any> = ({
  isGroup,
  companionEmail,
  name,
  companionLastName,
}) => {
  return (
    <div className={styles.chatItem}>
      <div className={styles.avatar}>👤</div>
      <div className={styles.chatInfo}>
        <div className={styles.topRow}>
          <span className={styles.name}>
            {isGroup ? name : `${name} ${companionLastName}`}
          </span>
        </div>
        <div className={styles.bottomRow}>
          <p className={styles.email}>{isGroup ? "" : companionEmail}</p>
        </div>
      </div>
    </div>
  );
};

export default SearchItem;
