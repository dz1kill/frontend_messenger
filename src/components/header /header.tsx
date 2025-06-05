// Header.tsx
import React from "react";
import styles from "../../styles/Header.module.css";

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>Messenger</div>
      <div className={styles.search}>
        <input type="text" placeholder="Search..." />
      </div>
      <div className={styles.userMenu}>
        <span>👤 User Name</span>
      </div>
    </header>
  );
};

export default Header;
