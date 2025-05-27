import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";
import { Link, useNavigate } from "react-router-dom";

import { ROUTES } from "../../utils/routes";
import styles from "../../styles/Auth.module.css";
import { loginUser } from "../../features/user/userSlice";
import { useAppDispatch } from "../../hooks";

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    userEmail: "",
    password: "",
  });

  const [validate, setValidate] = useState({
    isEmpty: true,
    isLoading: false,
    isError: false,
  });

  useEffect(() => {
    const checkEmpty = Object.values(formData).some((val) => !val);
    setValidate((prev) => ({
      ...prev,
      isEmpty: checkEmpty,
    }));
  }, [formData]);

  const handleChange = (element: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = element.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (
    element: FormEvent<HTMLFormElement>
  ) => {
    element.preventDefault();

    const userData = {
      email: formData.userEmail,
      password: formData.password,
    };

    setValidate((prev) => ({
      ...prev,
      passMatch: true,
      isLoading: true,
    }));

    const resultAction = await dispatch(loginUser(userData));
    if (loginUser.fulfilled.match(resultAction)) {
      navigate(ROUTES.HOME);
    } else {
      setValidate((prev) => ({
        ...prev,
        isLoading: false,
        isError: true,
      }));
    }
  };

  return (
    <div className={styles.page}>
      {validate.isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}></div>
        </div>
      )}
      <div className={styles.board}>
        <h1
          className={
            validate.isError ? styles.titleError : styles.title
          }
        >
          {validate.isError
            ? "Неправильный адрес электронной почты или пароль"
            : "Вход в систему"}
        </h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Почта</label>
            <input
              type="email"
              name="userEmail"
              value={formData.userEmail}
              onChange={handleChange}
              placeholder="Введите ваш email"
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Пароль</label>

            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Введите ваш пароль"
            />
            <a
              className={styles.forgetPassword}
              href="http://localhost:3000/"
            >
              Забыли пароль?
            </a>
          </div>
          <button
            className={styles.loginButton}
            disabled={validate.isEmpty}
            type="submit"
          >
            Войти
          </button>
          <Link to={`${ROUTES.REGISTER}`} className={styles.link}>
            У меня нет аккаунта
          </Link>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
