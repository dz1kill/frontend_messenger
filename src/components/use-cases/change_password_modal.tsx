import React, { FormEvent, useEffect, useState } from "react";

import styles from "../../styles/change_password_modal.module.css";
import {
  checkEmptyInput,
  messageErrorChangePassword,
  validateInputChangePassword,
} from "./helper";
import {
  ChangePasswordModalProps,
  FormDataChangePassword,
  ValidateErrChagePassword,
  ApiStatusChagePassword,
} from "../../types/use-cases_component";
import { useAppDispatch } from "../../hooks/redux_hooks";
import { changePasswordUser } from "../../store/profile/slice";
import { toast } from "react-toastify";
import { ROUTES } from "../../router/routes";
import { useNavigate } from "react-router-dom";

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  onClose,
  onCancel,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<FormDataChangePassword>({
    newPassword: "",
    confirmPassword: "",
    oldPassword: "",
  });
  const [apiStatus, setApiStatus] = useState<ApiStatusChagePassword>({
    isEmpty: true,
    isLoading: false,
    isErrorServer: false,
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
    const checkEmpty = checkEmptyInput(formData);
    setApiStatus((prev) => ({
      ...prev,
      isEmpty: checkEmpty,
    }));
  }, [formData]);

  const handleSubmit = async (element: FormEvent<HTMLFormElement>) => {
    element.preventDefault();

    const resultValidate = validateInputChangePassword(formData);
    if (!resultValidate.success) {
      const newErrors: Record<string, string> = {};
      resultValidate.error.errors.forEach((err) => {
        newErrors[err.path[0]] = err.message;
      });
      setApiStatus((prev) => ({
        ...prev,
        isErrorServer: false,
      }));
      setvlidateErr(newErrors);
      return;
    }

    const userData = {
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
    };

    setvlidateErr({});

    const loaderTimer = setTimeout(() => {
      setApiStatus((prev) => ({
        ...prev,
        isLoading: true,
      }));
    }, 300);

    const resultAction = await dispatch(changePasswordUser(userData));
    clearTimeout(loaderTimer);

    if (changePasswordUser.fulfilled.match(resultAction)) {
      setApiStatus((prev) => ({
        ...prev,
        isLoading: false,
        isErrorServer: false,
      }));
      toast.success("Пароль изменен");
      setFormData({ newPassword: "", confirmPassword: "", oldPassword: "" });
      navigate(ROUTES.APP.HOME);
    } else {
      const statusCode = resultAction.payload?.status || 500;

      const errorText = messageErrorChangePassword(statusCode);

      setApiStatus((prev) => ({
        ...prev,
        isLoading: false,
        isErrorServer: true,
      }));
      toast.error(errorText);
    }
  };
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      {apiStatus.isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}></div>
        </div>
      )}
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3> Смена пароля</h3>
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
              disabled={apiStatus.isEmpty}
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
