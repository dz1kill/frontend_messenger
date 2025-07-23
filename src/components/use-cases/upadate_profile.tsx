import React, { FormEvent, useEffect, useState } from "react";

import styles from "../../styles/update_profile.module.css";
import {
  cleanUserData,
  hasNonEmptyInput,
  messageErrorUpdateProfile,
  validateInputUpdatePrifile,
} from "./helper";
import {
  UpdateProfileModalProps,
  FormDataUpdateProfile,
  ValidateErrUpdateProfile,
  ApiStatusUpdateProfile,
} from "../../types/use-cases_component";
import { useAppDispatch } from "../../hooks/redux_hooks";
import { updateProfileUser } from "../../store/profile/slice";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../router/routes";
import { toast } from "react-toastify";

const UpdateProfileModal: React.FC<UpdateProfileModalProps> = ({
  onClose,
  onCancel,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormDataUpdateProfile>({
    firstName: "",
    lastName: "",
  });
  const [apiStatus, setApiStatus] = useState<ApiStatusUpdateProfile>({
    isEmpty: true,
    isLoading: false,
    isErrorServer: false,
  });
  const [vlidateErr, setvlidateErr] = useState<ValidateErrUpdateProfile>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const checkEmpty = hasNonEmptyInput(formData);
    setApiStatus((prev) => ({
      ...prev,
      isEmpty: checkEmpty,
    }));
  }, [formData]);

  const handleSubmit = async (element: FormEvent<HTMLFormElement>) => {
    element.preventDefault();

    const resultValidate = validateInputUpdatePrifile(formData);
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
      firstName: formData.firstName,
      lastName: formData.lastName,
    };

    setvlidateErr({});

    const loaderTimer = setTimeout(() => {
      setApiStatus((prev) => ({
        ...prev,
        isLoading: true,
      }));
    }, 300);

    const resulClean = cleanUserData(userData);
    const resultAction = await dispatch(updateProfileUser(resulClean));
    clearTimeout(loaderTimer);

    if (updateProfileUser.fulfilled.match(resultAction)) {
      setApiStatus((prev) => ({
        ...prev,
        isLoading: false,
        isErrorServer: false,
      }));

      if (formData.firstName.trim() !== "") {
        localStorage.setItem("userName", formData.firstName);
      }
      if (formData.lastName.trim() !== "") {
        localStorage.setItem("userLastName", formData.lastName);
      }

      setFormData({ firstName: "", lastName: "" });
      navigate(ROUTES.APP.HOME);
      toast.success("Данные изменены");
    } else {
      const statusCode = resultAction.payload?.status || 500;

      const errorText = messageErrorUpdateProfile(statusCode);

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
          <h3>Редактирование профиля</h3>
        </div>
        <form className={styles.updateForm} onSubmit={handleSubmit}>
          <div
            className={
              vlidateErr.firstName ? styles.errInput : styles.formGroup
            }
          >
            <label>Новое имя</label>
            {vlidateErr.firstName && (
              <span className={styles.errorInputMessage}>
                {vlidateErr.firstName}
              </span>
            )}
            <input
              type="text"
              name="firstName"
              autoComplete="off"
              onChange={handleChange}
              value={formData.firstName}
            />
          </div>
          <div
            className={vlidateErr.lastName ? styles.errInput : styles.formGroup}
          >
            <label>Новая фамилия</label>
            {vlidateErr.lastName && (
              <span className={styles.errorInputMessage}>
                {vlidateErr.lastName}
              </span>
            )}
            <input
              type="test"
              name="lastName"
              autoComplete="off"
              onChange={handleChange}
              value={formData.lastName}
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

export default UpdateProfileModal;
