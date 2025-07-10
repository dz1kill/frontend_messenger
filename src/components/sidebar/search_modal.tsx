import React from "react";

import styles from "../../styles/sidebar_search.module.css";

const SearchModal: React.FC = () => {
  return (
    <div>
      <input
        type="text"
        placeholder="Поиск..."
        className={styles.searchInput}
      />
    </div>
  );
};

export default SearchModal;
