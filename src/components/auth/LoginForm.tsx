import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link, useNavigate } from "react-router-dom";

import { ROUTES } from "../../router/routes";
import styles from "../../styles/Auth.module.css";
import { loginUser } from "../../store/auth/users";
import { useAppDispatch } from "../../libs/redux/hooks";
import { FormDataLoginState, ValidatErrServerState } from "../../types/user";
import { checkEmptyInput, messageErrorLogin } from "./helper";

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const optionalFields = useMemo(() => [], []);

  const [formDataLogin, setFormDataLogin] = useState<FormDataLoginState>({
    userEmail: "",
    password: "",
  });

  const [validatErrServer, setValidatErrServer] =
    useState<ValidatErrServerState>({
      isEmpty: true,
      isLoading: false,
      isErrorServer: false,
      errorMessageServer: "",
    });

  useEffect(() => {
    const checkEmpty = checkEmptyInput(optionalFields, formDataLogin);
    setValidatErrServer((prev) => ({
      ...prev,
      isEmpty: checkEmpty,
    }));
  }, [optionalFields, formDataLogin]);

  const handleChange = (element: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = element.target;
    setFormDataLogin({
      ...formDataLogin,
      [name]: value,
    });
  };
  const handleSubmit = async (element: FormEvent<HTMLFormElement>) => {
    element.preventDefault();

    const userData = {
      email: formDataLogin.userEmail,
      password: formDataLogin.password,
    };

    setValidatErrServer((prev) => ({
      ...prev,
      isLoading: true,
    }));

    const resultAction = await dispatch(loginUser(userData));
    if (loginUser.fulfilled.match(resultAction)) {
      localStorage.setItem("token", resultAction.payload.token);
      navigate(ROUTES.APP.HOME);
    } else {
      const statusCode = resultAction.payload?.status || 500;

      const errorText = messageErrorLogin(statusCode);

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
        <h1 className={styles.title}>{"Вход в систему"}</h1>
        {validatErrServer.isErrorServer && (
          <div className={styles.errorMessageTitle}>
            {validatErrServer.errorMessageServer}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Почта</label>
            <input
              key=""
              type="email"
              name="userEmail"
              value={formDataLogin.userEmail}
              onChange={handleChange}
              placeholder="Введите ваш email"
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Пароль</label>
            <input
              key=""
              type="password"
              name="password"
              value={formDataLogin.password}
              onChange={handleChange}
              placeholder="Введите ваш пароль"
              autoComplete="off"
            />
            <a
              className={styles.forgetPassword}
              href={process.env.REACT_APP_API_APP_URL}
            >
              Забыли пароль?
            </a>
          </div>
          <button
            className={styles.loginButton}
            disabled={validatErrServer.isEmpty}
            type="submit"
          >
            Войти
          </button>
          <Link to={`${ROUTES.APP.REGISTER}`} className={styles.link}>
            У меня нет аккаунта
          </Link>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
