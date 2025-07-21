import React, { useState } from "react";
import styles from "../../styles/add_member_group.module.css";
import { mockUsers } from "./mockUsers";

interface AddMemberGroupProps {
  onClose: () => void;
  onCancel: () => void;
  onFulfilled: () => void;
}

const AddMemberGroup: React.FC<AddMemberGroupProps> = ({
  onClose,
  onCancel,
  onFulfilled,
}) => {
  const [apiStatus, setApiStatus] = useState({
    isLoading: false,
    isErrorServer: false,
    errorMessageServer: "",
  });

  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSelectUser = (userId: string) => {
    setSelectedUser((prev) => (prev === userId ? null : userId));
  };

  const handleAddUser = () => {
    if (selectedUser) {
      setApiStatus({ ...apiStatus, isLoading: true });
      onFulfilled();
    }
  };

  return (
    <div
      className={styles.groupOverlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {apiStatus.isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}></div>
        </div>
      )}
      <div className={styles.groupContent}>
        <div className={styles.groupHeader}>
          <h3>Добавить участника</h3>
        </div>

        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Поиск пользователей..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.usersList}>
          {mockUsers.length > 0 ? (
            mockUsers.map((user) => (
              <div
                key={user.id}
                className={`${styles.userItem} ${
                  selectedUser === user.id ? styles.selected : ""
                }`}
                onClick={() => handleSelectUser(user.id)}
              >
                <div className={styles.avatar}>👤</div>
                <div className={styles.userInfo}>
                  <span className={styles.userName}>
                    {user.firstName} {user.lastName}
                  </span>
                </div>
                {selectedUser === user.id && (
                  <div className={styles.checkmark}>✓</div>
                )}
              </div>
            ))
          ) : (
            <div className={styles.noResults}>Пользователи не найдены</div>
          )}
        </div>

        <div className={styles.groupFooter}>
          <button className={styles.cancelButton} onClick={onCancel}>
            Отмена
          </button>
          <button
            className={styles.addButton}
            onClick={handleAddUser}
            disabled={!selectedUser}
          >
            Добавить
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMemberGroup;
