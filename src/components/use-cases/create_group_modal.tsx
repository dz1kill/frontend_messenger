import React, { FormEvent, useEffect, useState } from "react";

import styles from "../../styles/update_profile.module.css";
import { checkEmptyInput, validateInputCreateGroup } from "./helper";
import {
  ApiStatusUpdateProfile,
  CreateGroupModalProps,
  FormDataCreateGroup,
  ValidateErrCreateGroup,
} from "../../types/use-cases";
import { useAppDispatch } from "../../hooks/redux_hooks";

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  onClose,
  onCancel,
}) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<FormDataCreateGroup>({
    groupName: "",
  });
  const [apiStatus, setApiStatus] = useState<ApiStatusUpdateProfile>({
    isEmpty: true,
    isLoading: false,
    isErrorServer: false,
    errorMessageServer: "",
    headerMessage: "",
  });
  const [vlidateErr, setValidateErr] = useState<ValidateErrCreateGroup>({
    groupName: "",
  });

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

    const resultValidate = validateInputCreateGroup(formData);
    if (!resultValidate.success) {
      const newErrors: Record<string, string> = {};
      resultValidate.error.errors.forEach((err) => {
        newErrors[err.path[0]] = err.message;
      });
      setApiStatus((prev) => ({
        ...prev,
        isErrorServer: false,
      }));
      setValidateErr(newErrors);
      return;
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
          <h3>
            {apiStatus?.headerMessage?.trim()
              ? apiStatus?.headerMessage
              : "Создание новой группы"}
          </h3>
          {apiStatus.isErrorServer && (
            <div className={styles.errorMessageTitle}>
              {apiStatus.errorMessageServer}
            </div>
          )}
        </div>
        <form className={styles.updateForm} onSubmit={handleSubmit}>
          <div
            className={
              vlidateErr.groupName ? styles.errInput : styles.formGroup
            }
          >
            <label> Название группы</label>
            {vlidateErr.groupName && (
              <span className={styles.errorInputMessage}>
                {vlidateErr.groupName}
              </span>
            )}
            <input
              type="text"
              name="groupName"
              autoComplete="off"
              onChange={handleChange}
              value={formData.groupName}
            />
          </div>
          <div
            className={
              vlidateErr.groupName ? styles.errInput : styles.formGroup
            }
          ></div>

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
              Создать
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;
