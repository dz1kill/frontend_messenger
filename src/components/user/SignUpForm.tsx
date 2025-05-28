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
import { messageError } from "./helper";

const SignUpForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
    firstName: "",
    userEmail: "",
    lastName: "",
  });
  const [validate, setValidate] = useState({
    passMatch: true,
    // isEmpty: true,
    isLoading: false,
    isError: false,
    errorMessage: "",
  });

  // useEffect(() => {
  //   const checkEmpty = Object.values(formData).some((val) => !val);
  //   setValidate((prev) => ({
  //     ...prev,
  //     isEmpty: checkEmpty,
  //   }));
  // }, [formData]);

  const handleChange = (element: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = element.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    element: FormEvent<HTMLFormElement>
  ) => {
    element.preventDefault();

    const userData = {
      lastName: formData.lastName,
      firstName: formData.firstName,
      email: formData.userEmail,
      password: formData.password,
    };

    const passwordsMatch =
      formData.password === formData.confirmPassword;

    if (!passwordsMatch) {
      setValidate((prev) => ({
        ...prev,
        passMatch: passwordsMatch,
      }));
      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));
      return;
    }

    setValidate((prev) => ({
      ...prev,
      passMatch: true,
      isLoading: true,
    }));

    const resultAction = await dispatch(createUser(userData));
    if (createUser.fulfilled.match(resultAction)) {
      navigate(ROUTES.LOGIN);
    } else {
      const statusCode = resultAction.payload?.status || 500;

      const errorText = messageError(statusCode);

      setValidate((prev) => ({
        ...prev,
        isLoading: false,
        isError: true,
        errorMessage: errorText,
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
        <h1 className={styles.title}>{"Регистрация"}</h1>
        {validate.isError && (
          <div className={styles.errorMessage}>
            {validate.errorMessage}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Имя*</label>
            <input
              type="name"
              name="firstName"
              onChange={handleChange}
              value={formData.firstName}
              placeholder="Введите ваше имя"
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Фамилия</label>
            <input
              type="name"
              name="lastName"
              onChange={handleChange}
              value={formData.lastName}
              placeholder="Введите ваше имя"
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Почта*</label>
            <input
              type="email"
              name="userEmail"
              value={formData.userEmail}
              onChange={handleChange}
              placeholder={"Введите ваш email"}
            />
          </div>

          <div
            className={
              validate.passMatch ? styles.inputGroup : styles.errInput
            }
          >
            <label>Пароль*</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder={
                validate.passMatch
                  ? "Ведите пароль"
                  : "Пароли не совпадают"
              }
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div
            className={
              validate.passMatch ? styles.inputGroup : styles.errInput
            }
          >
            <label>Подтвердите пароль*</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder={
                validate.passMatch
                  ? "Подтвердите пароль"
                  : "Пароли не совпадают"
              }
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button
            className={styles.loginButton}
            //  disabled={validate.isEmpty}
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
