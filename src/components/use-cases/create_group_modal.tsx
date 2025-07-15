import React, { FormEvent, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import styles from "../../styles/update_profile.module.css";
import {
  checkEmptyInput,
  generateObjListLastMessageState,
  messageErrorCreateGroup,
  validateInputCreateGroup,
} from "./helper";
import {
  ApiStatusCreateGropModal,
  CreateGroupModalProps,
  FormDataCreateGroup,
  ValidateErrCreateGroup,
} from "../../types/use-cases_component";
import { useAppDispatch } from "../../hooks/redux_hooks";
import { createNewGroup } from "../../store/use_cases/slice";
import { listLastMessageReceived } from "../../store/chat/slice";
import { ROUTES } from "../../router/routes";
import { useNavigate } from "react-router-dom";

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  onClose,
  onCancel,
}) => {
  const notificationMessage = "Группа создана";
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<FormDataCreateGroup>({
    groupName: "",
  });
  const [apiStatus, setApiStatus] = useState<ApiStatusCreateGropModal>({
    isEmpty: true,
    isLoading: false,
    isErrorServer: false,
    errorMessageServer: "",
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
    const newUuidMessage = uuidv4();
    const newUuidGroup = uuidv4();

    const resultAction = await dispatch(
      createNewGroup({
        groupName: formData.groupName,
        groupId: newUuidGroup,
        messageId: newUuidMessage,
        content: notificationMessage,
      })
    );

    if (createNewGroup.fulfilled.match(resultAction)) {
      setApiStatus((prev) => ({
        ...prev,
        isLoading: false,
        isErrorServer: false,
      }));

      const resultGenerate = generateObjListLastMessageState(
        formData,
        newUuidMessage,
        newUuidGroup,
        notificationMessage
      );
      dispatch(listLastMessageReceived(resultGenerate));
      setFormData({ groupName: "" });
      navigate(ROUTES.APP.HOME);
    } else {
      const statusCode = resultAction.payload?.status || 500;

      const errorText = messageErrorCreateGroup(statusCode);

      setApiStatus((prev) => ({
        ...prev,
        isLoading: false,
        isErrorServer: true,
        errorMessageServer: errorText,
      }));
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
          <h3>Создание новой группы</h3>
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
