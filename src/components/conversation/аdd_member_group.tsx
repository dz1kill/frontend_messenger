import React, { useDeferredValue, useEffect, useState } from "react";
import styles from "../../styles/add_member_group.module.css";
import { useAppDispatch, useAppSelector } from "../../hooks/redux_hooks";
import { RootState } from "../../store/store";
import {
  searchUsersByNameOrEmail,
  clearSearchResults,
} from "../../store/use_cases/slice";
import { ItemSearchUsers } from "../../types/use_cases_store";

interface AddMemberGroupProps {
  onClose: () => void;
  onCancel: () => void;
}

type ApiStatusAddMemberGroupProps = {
  isLoading: boolean;
  isErrorServer: boolean;
  errorMessageServer: string;
};

const AddMemberGroup: React.FC<AddMemberGroupProps> = ({
  onClose,
  onCancel,
}) => {
  const dispatch = useAppDispatch();
  const { searchUsersResult } = useAppSelector(
    (state: RootState) => state.useCases
  );

  const [apiStatus, setApiStatus] = useState<ApiStatusAddMemberGroupProps>({
    isLoading: false,
    isErrorServer: false,
    errorMessageServer: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const deferredQuery = useDeferredValue(searchQuery);
  const [selectedUser, setSelectedUser] = useState<ItemSearchUsers | null>(
    null
  );

  const handleSelectUser = (user: ItemSearchUsers) => {
    setSelectedUser((prev) => (prev?.userId === user.userId ? null : user));
  };

  const handleAddUser = () => {
    if (selectedUser) {
      setApiStatus((prev) => ({ ...prev, isLoading: true }));
      console.log("Adding user:", selectedUser);
    }
  };

  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
      dispatch(clearSearchResults());
    }
  };

  useEffect(() => {
    if (deferredQuery.trim()) {
      dispatch(searchUsersByNameOrEmail({ searchText: deferredQuery }));
    } else {
      dispatch(clearSearchResults());
    }
  }, [deferredQuery, dispatch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length === 0) {
      dispatch(clearSearchResults());
    }
  };

  return (
    <div className={styles.groupOverlay} onClick={handleClose}>
      {apiStatus.isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}></div>
        </div>
      )}

      <div className={styles.groupContent}>
        <header className={styles.groupHeader}>
          <h3>Добавить участника</h3>
        </header>

        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Поиск пользователей..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <div className={styles.usersList}>
          {searchUsersResult.length > 0 ? (
            searchUsersResult.map((user) => (
              <div
                key={user.userId}
                className={`${styles.userItem} ${
                  selectedUser?.userId === user.userId ? styles.selected : ""
                }`}
                onClick={() => handleSelectUser(user)}
              >
                <div className={styles.avatar}>👤</div>
                <div className={styles.userInfo}>
                  <span className={styles.userName}>
                    {user.firstName} {user.lastName}
                  </span>
                  <span className={styles.email}>{user.email}</span>
                </div>
                {selectedUser?.userId === user.userId && (
                  <div className={styles.checkmark}>✓</div>
                )}
              </div>
            ))
          ) : (
            <div className={styles.noResults}>
              {searchQuery
                ? "Пользователи не найдены"
                : "Введите имя или email для поиска"}
            </div>
          )}
        </div>

        <footer className={styles.groupFooter}>
          <button
            className={styles.cancelButton}
            onClick={() => {
              onCancel();
              dispatch(clearSearchResults());
            }}
          >
            Отмена
          </button>
          <button
            className={styles.addButton}
            onClick={handleAddUser}
            disabled={!selectedUser || apiStatus.isLoading}
          >
            Добавить
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AddMemberGroup;
