import React, {
  useEffect,
  useState,
  ChangeEvent,
  FormEvent,
  useMemo,
} from "react";
import { Link, useNavigate } from "react-router-dom";

import styles from "../../styles/auth.module.css";
import { ROUTES } from "../../router/routes";
import { createUser } from "../../store/auth/slice";
import { useAppDispatch } from "../../hooks/redux_hooks";
import {
  checkEmptyInput,
  messageErrorSignUp,
  validateInputSignUp,
} from "./helper";
import {
  FormDataSignUpState,
  ApiStatusSignUpState,
  VlidateErrState,
} from "../../types/auth";

const SignUpForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const optionalFields = useMemo(() => ["lastName"], []);

  const [formDataSignUp, setFormDataSignUp] = useState<FormDataSignUpState>({
    password: "",
    confirmPassword: "",
    firstName: "",
    userEmail: "",
    lastName: "",
  });
  const [apiStatus, setApiStatus] = useState<ApiStatusSignUpState>({
    isEmpty: true,
    isLoading: false,
    isErrorServer: false,
    errorMessageServer: "",
  });
  const [vlidateErr, setvlidateErr] = useState<VlidateErrState>({});

  useEffect(() => {
    const checkEmpty = checkEmptyInput(optionalFields, formDataSignUp);
    setApiStatus((prev) => ({
      ...prev,
      isEmpty: checkEmpty,
    }));
  }, [optionalFields, formDataSignUp]);

  const handleChange = (element: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = element.target;
    setFormDataSignUp((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (element: FormEvent<HTMLFormElement>) => {
    element.preventDefault();

    const userData = {
      lastName: formDataSignUp.lastName,
      firstName: formDataSignUp.firstName,
      email: formDataSignUp.userEmail,
      password: formDataSignUp.password,
    };

    const resultValidate = validateInputSignUp(formDataSignUp);
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
    setvlidateErr({});

    setApiStatus((prev) => ({
      ...prev,
      isLoading: true,
    }));

    const resultAction = await dispatch(createUser(userData));
    if (createUser.fulfilled.match(resultAction)) {
      navigate(ROUTES.APP.LOGIN);
    } else {
      const statusCode = resultAction.payload?.status || 500;

      const errorText = messageErrorSignUp(statusCode);

      setApiStatus((prev) => ({
        ...prev,
        isLoading: false,
        isErrorServer: true,
        errorMessageServer: errorText,
      }));
    }
  };

  return (
    <div className={styles.page}>
      {apiStatus.isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}></div>
        </div>
      )}
      <div className={styles.board}>
        <h1 className={styles.title}>{"Регистрация"}</h1>
        {apiStatus.isErrorServer && (
          <div className={styles.errorMessageTitle}>
            {apiStatus.errorMessageServer}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div
            className={
              vlidateErr.firstName ? styles.errInput : styles.inputGroup
            }
          >
            <label>Имя</label>
            {vlidateErr.firstName && (
              <span className={styles.errorInputMessage}>
                {vlidateErr.firstName}
              </span>
            )}
            <input
              type="name"
              name="firstName"
              onChange={handleChange}
              value={formDataSignUp.firstName}
              placeholder="Введите ваше имя"
            />
          </div>
          <div
            className={
              vlidateErr.lastName ? styles.errInput : styles.inputGroup
            }
          >
            <label>Фамилия</label>
            <span className={styles.errorInputMessage}>
              {vlidateErr.lastName}
            </span>
            <input
              type="name"
              name="lastName"
              onChange={handleChange}
              value={formDataSignUp.lastName}
              placeholder="Введите вашу фамилию"
            />
          </div>
          <div
            className={
              vlidateErr.userEmail ? styles.errInput : styles.inputGroup
            }
          >
            <label>Почта</label>
            <span className={styles.errorInputMessage}>
              {vlidateErr.userEmail}
            </span>
            <input
              type="email"
              name="userEmail"
              value={formDataSignUp.userEmail}
              onChange={handleChange}
              placeholder={"Введите ваш email"}
            />
          </div>

          <div
            className={
              vlidateErr.password ? styles.errInput : styles.inputGroup
            }
          >
            <label>Пароль</label>
            <span className={styles.errorInputMessage}>
              {vlidateErr.password}
            </span>
            <input
              type="password"
              name="password"
              placeholder={"Введите пароль"}
              value={formDataSignUp.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </div>

          <div
            className={
              vlidateErr.confirmPassword ? styles.errInput : styles.inputGroup
            }
          >
            <label>Подтвердите пароль</label>
            <span className={styles.errorInputMessage}>
              {vlidateErr.confirmPassword}
            </span>
            <input
              type="password"
              name="confirmPassword"
              placeholder={"Подтвердите пароль"}
              value={formDataSignUp.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </div>

          <button
            className={styles.loginButton}
            disabled={apiStatus.isEmpty}
            type="submit"
          >
            Зарегистрироваться
          </button>
          <Link to={`${ROUTES.APP.LOGIN}`} className={styles.link}>
            У меня уже есть аккаунт
          </Link>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
