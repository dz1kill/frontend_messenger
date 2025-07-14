import React, { useEffect, useRef } from "react";
import styles from "../../styles/conversation_dropdown.module.css"; // Путь к вашим стилям

interface DropdownMenuProps {
  isGroup: boolean;
  onClose: () => void;
  onDeleteChat: () => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  isGroup,
  onClose,
  onDeleteChat,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className={styles.menuDropdown} ref={dropdownRef}>
      {isGroup ? (
        <>
          <div
            className={styles.menuItem}
            onClick={() => {
              onClose();
            }}
          >
            Покинуть группу
          </div>
          <div
            className={styles.menuItem}
            onClick={() => {
              onClose();
            }}
          >
            Изменить название
          </div>
        </>
      ) : (
        <div
          className={styles.menuItem}
          onClick={() => {
            onClose();
            onDeleteChat();
          }}
        >
          Удалить диалог
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
