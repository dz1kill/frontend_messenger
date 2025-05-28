import React, {
  useEffect,
  useState,
  ChangeEvent,
  FormEvent,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/Auth.module.css";
import { ROUTES } from "../../utils/routes";
import { createUser } from "../../features/user/userSlice";
import { useAppDispatch } from "../../hooks";
import {
  checkEmptyInput,
  messageError,
  validateInput,
} from "./helper";
import {
  FormDataSignUpState,
  ValidatErrServerState,
  VlidateErrState,
} from "../../types/user";

const SignUpForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [formDataSignUp, setFormDataSignUp] =
    useState<FormDataSignUpState>({
      password: "",
      confirmPassword: "",
      firstName: "",
      userEmail: "",
      lastName: "",
    });

  const [validatErrServer, setValidatErrServer] =
    useState<ValidatErrServerState>({
      isEmpty: true,
      isLoading: false,
      isErrorServer: false,
      errorMessageServer: "",
    });
  const [vlidateErr, setvlidateErr] = useState<VlidateErrState>({});

  useEffect(() => {
    const checkEmpty = checkEmptyInput(formDataSignUp);
    setValidatErrServer((prev) => ({
      ...prev,
      isEmpty: checkEmpty,
    }));
  }, [formDataSignUp]);

  const handleChange = (element: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = element.target;
    setFormDataSignUp((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    element: FormEvent<HTMLFormElement>
  ) => {
    element.preventDefault();

    const userData = {
      lastName: formDataSignUp.lastName,
      firstName: formDataSignUp.firstName,
      email: formDataSignUp.userEmail,
      password: formDataSignUp.password,
    };

    const resultValidate = validateInput(formDataSignUp);
    if (!resultValidate.success) {
      const newErrors: Record<string, string> = {};
      resultValidate.error.errors.forEach((err) => {
        newErrors[err.path[0]] = err.message;
      });
      setValidatErrServer((prev) => ({
        ...prev,
        isErrorServer: false,
      }));
      setvlidateErr(newErrors);
      return;
    }
    setvlidateErr({});

    setValidatErrServer((prev) => ({
      ...prev,
      isLoading: true,
    }));

    const resultAction = await dispatch(createUser(userData));
    if (createUser.fulfilled.match(resultAction)) {
      navigate(ROUTES.LOGIN);
    } else {
      const statusCode = resultAction.payload?.status || 500;

      const errorText = messageError(statusCode);

      setValidatErrServer((prev) => ({
        ...prev,
        isLoading: false,
        isErrorServer: true,
        errorMessageServer: errorText,
      }));
    }
  };

  return (
    <div className={styles.page}>
      {validatErrServer.isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}></div>
        </div>
      )}
      <div className={styles.board}>
        <h1 className={styles.title}>{"Регистрация"}</h1>
        {validatErrServer.isErrorServer && (
          <div className={styles.errorMessageTitle}>
            {validatErrServer.errorMessageServer}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div
            className={
              vlidateErr.firstName
                ? styles.errInput
                : styles.inputGroup
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
              vlidateErr.lastName
                ? styles.errInput
                : styles.inputGroup
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
              vlidateErr.userEmail
                ? styles.errInput
                : styles.inputGroup
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
              vlidateErr.password
                ? styles.errInput
                : styles.inputGroup
            }
          >
            <label>Пароль</label>
            <span className={styles.errorInputMessage}>
              {vlidateErr.password}
            </span>
            <input
              type="password"
              id="password"
              name="password"
              placeholder={"Ведите пароль"}
              value={formDataSignUp.password}
              onChange={handleChange}
            />
          </div>

          <div
            className={
              vlidateErr.confirmPassword
                ? styles.errInput
                : styles.inputGroup
            }
          >
            <label>Подтвердите пароль</label>
            <span className={styles.errorInputMessage}>
              {vlidateErr.confirmPassword}
            </span>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder={"Подтвердите пароль"}
              value={formDataSignUp.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button
            className={styles.loginButton}
            disabled={validatErrServer.isEmpty}
            type="submit"
          >
            Зарегистрироваться
          </button>
          <Link to={`${ROUTES.LOGIN}`} className={styles.link}>
            У меня уже есть аккаунт
          </Link>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
