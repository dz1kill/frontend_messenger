import React, { FormEvent, useEffect, useMemo, useState } from "react";
import styles from "../../styles/change_password_modal.module.css";
import { checkEmptyInput, validateInput } from "./helper";
import {
  FormDataChangePassword,
  ValidateErrChagePassword,
  ValidattionChagePassword,
} from "../../types/profile";

interface ChangePasswordModalProps {
  onClose: () => void;
  onCancel: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  onClose,
  onCancel,
}) => {
  const optionalFields = useMemo(() => [], []);
  const [formData, setFormData] = useState<FormDataChangePassword>({
    newPassword: "",
    confirmPassword: "",
    oldPassword: "",
  });
  const [validation, setValidation] = useState<ValidattionChagePassword>({
    isEmpty: true,
    isLoading: false,
  });
  const [vlidateErr, setvlidateErr] = useState<ValidateErrChagePassword>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const checkEmpty = checkEmptyInput(optionalFields, formData);
    setValidation((prev) => ({
      ...prev,
      isEmpty: checkEmpty,
    }));
  }, [optionalFields, formData]);

  const handleSubmit = async (element: FormEvent<HTMLFormElement>) => {
    element.preventDefault();

    const resultValidate = validateInput(formData);
    if (!resultValidate.success) {
      const newErrors: Record<string, string> = {};
      resultValidate.error.errors.forEach((err) => {
        newErrors[err.path[0]] = err.message;
      });
      setvlidateErr(newErrors);
      return;
    }
    setvlidateErr({});
  };
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      {validation.isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}></div>
        </div>
      )}
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Смена пароля</h3>
        </div>
        <form className={styles.passwordForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Старый пароль</label>
            <input
              type="password"
              name="oldPassword"
              placeholder={"Введите старый пароль"}
              autoComplete="new-password"
              onChange={handleChange}
              value={formData.oldPassword}
            />
          </div>
          <div
            className={
              vlidateErr.newPassword ? styles.errInput : styles.formGroup
            }
          >
            <label>Новый пароль</label>
            {vlidateErr.newPassword && (
              <span className={styles.errorInputMessage}>
                {vlidateErr.newPassword}
              </span>
            )}
            <input
              type="password"
              name="newPassword"
              placeholder={"Введите новый пароль"}
              autoComplete="new-password"
              onChange={handleChange}
              value={formData.newPassword}
            />
          </div>

          <div
            className={
              vlidateErr.confirmPassword ? styles.errInput : styles.formGroup
            }
          >
            <label>Повторите новый пароль</label>
            {vlidateErr.confirmPassword && (
              <span className={styles.errorInputMessage}>
                {vlidateErr.confirmPassword}
              </span>
            )}
            <input
              type="password"
              name="confirmPassword"
              placeholder={"Подтвердите пароль"}
              autoComplete="new-password"
              onChange={handleChange}
              value={formData.confirmPassword}
            />
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onCancel}
            >
              Отмена
            </button>
            <button
              className={styles.submitButton}
              disabled={validation.isEmpty}
              type="submit"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
