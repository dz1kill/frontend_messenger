import React from "react";
import styles from "../../styles/Header.module.css";

const Header: React.FC = () => {
  return (
    <div>
      <header className={styles.header}>
        <div className={styles.leftSection}>
          <button className={styles.menuButton}>
            <div className={styles.menuIcon}></div>
            <div className={styles.menuIcon}></div>
            <div className={styles.menuIcon}></div>
          </button>
          <div className={styles.logo}>Messenger</div>
        </div>
      </header>
    </div>
  );
};

export default Header;
