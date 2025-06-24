import { z } from "zod";
import {
  FormDataLoginState,
  FormDataSignUpState,
  UserResLoginData,
} from "../../types/auth";
import { PayloadAction } from "@reduxjs/toolkit";

export const messageErrorSignUp = (statusCode: number) => {
  switch (statusCode) {
    case 400:
      return "Поля не должны содержать пробелов, а обязатыльные быть пустыми ";
    case 409:
      return "Пользователь с таким email уже существует";
    case 500:
      return "Ошибка сервера";
    default:
      return "Неизвестная ошибка сервера";
  }
};

export const messageErrorLogin = (statusCode: number) => {
  switch (statusCode) {
    case 400:
      return "Не верный пароль или почта";
    case 500:
      return "Ошибка сервера";
    default:
      return "Неизвестная ошибка сервера";
  }
};

export const validateInputSignUp = (formData: FormDataSignUpState) => {
  const UserValidate = z
    .object({
      userEmail: z
        .string()
        .regex(/^\S*$/, "Пробелы не допускаются")
        .email("Некорректный email")
        .nonempty("Поле обязательно"),
      firstName: z
        .string()
        .regex(/^\S*$/, "Пробелы не допускаются")
        .min(3, "Имя должно быть от 3 символов")
        .nonempty("Поле обязательно"),
      lastName: z
        .string()
        .regex(/^\S*$/, "Пробелы не допускаются")
        .optional()
        .refine((val) => !val || val.trim().length >= 3, {
          message: "Минимум 3 символа (или оставьте пустым)",
        })
        .transform((val) => (val === "" ? undefined : val)),
      password: z
        .string()
        .regex(/^\S*$/, "Пробелы не допускаются")
        .min(4, "Пароль должен быть от 4 символов")
        .nonempty("Поле обязательно"),
      confirmPassword: z
        .string()
        .regex(/^\S*$/, "Пробелы не допускаются")
        .min(4, "Пароль должен быть от 4 символов")
        .nonempty("Поле обязательно"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Пароли не совпадают",
      path: ["confirmPassword"],
    });

  return UserValidate.safeParse(formData);
};

export const checkEmptyInput = (
  optionalFields: string[],
  formData: FormDataSignUpState | FormDataLoginState
) => {
  const arrFormData = Object.entries(formData);

  const filterData = arrFormData.filter(
    ([key]) => !optionalFields.includes(key)
  );

  const checkEmpty = filterData.some(([, val]) => !val);

  return checkEmpty;
};

export const checkResultAction = (
  resultAction: PayloadAction<UserResLoginData>
) => {
  if (!resultAction || !resultAction.payload) {
    return { error: true, message: "No payload in resultAction" };
  }

  if (!resultAction.payload.token) {
    return { error: true, message: "No token in payload" };
  }

  if (!resultAction.payload.email) {
    return { error: true, message: "No email in payload" };
  }

  if (!resultAction.payload.id) {
    return { error: true, message: "No userId in payload" };
  }
};
