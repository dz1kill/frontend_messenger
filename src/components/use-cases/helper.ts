import { z } from "zod";

import {
  FormDataChangePassword,
  FormDataUpdateProfile,
} from "../../types/profile";

export const messageErrorDestroy = (statusCode: number) => {
  switch (statusCode) {
    case 401:
      return "Ошибка авторизации";
    case 500:
      return "Ошибка сервера";
    default:
      return "Неизвестная ошибка сервера";
  }
};

export const messageErrorChangePassword = (statusCode: number) => {
  switch (statusCode) {
    case 400:
      return "Неверный пароль";
    case 401:
      return "Ошибка авторизации";
    case 500:
      return "Ошибка сервера";
    default:
      return "Неизвестная ошибка сервера";
  }
};

export const messageErrorUpdateProfile = (statusCode: number) => {
  switch (statusCode) {
    case 401:
      return "Ошибка авторизации";
    case 500:
      return "Ошибка сервера";
    default:
      return "Неизвестная ошибка сервера";
  }
};
export const checkEmptyInput = (formData: FormDataChangePassword) => {
  return Object.values(formData).some((val) => !val);
};

export const hasNonEmptyInput = (formData: FormDataUpdateProfile) => {
  return !Object.values(formData).some((val) => !!val);
};

export const validateInputChangePassword = (
  formData: FormDataChangePassword
) => {
  const UserValidate = z
    .object({
      oldPassword: z.string().nonempty("Поле обязательно"),
      newPassword: z
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
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Пароли не совпадают",
      path: ["confirmPassword"],
    });

  return UserValidate.safeParse(formData);
};

export const validateInputUpdatePrifile = (formData: FormDataUpdateProfile) => {
  const UserValidate = z.object({
    lastName: z
      .string()
      .regex(/^\S*$/, "Пробелы не допускаются")
      .regex(/^[A-Za-zА-Яа-я]*$/, "Только буквы")
      .optional()
      .refine((val) => !val || val.trim().length >= 3, {
        message: "Минимум 3 символа (или оставьте пустым)",
      })
      .transform((val) => (val === "" ? undefined : val)),

    firstName: z
      .string()
      .regex(/^\S*$/, "Пробелы не допускаются")
      .regex(/^[A-Za-zА-Яа-я]*$/, "Только буквы")
      .optional()
      .refine((val) => !val || val.trim().length >= 3, {
        message: "Минимум 3 символа (или оставьте пустым)",
      })
      .transform((val) => (val === "" ? undefined : val)),
  });

  return UserValidate.safeParse(formData);
};

export const cleanUserData = (userData: FormDataUpdateProfile) => {
  const result = { ...userData };
  (Object.keys(result) as (keyof FormDataUpdateProfile)[]).forEach((key) => {
    if (
      result[key] === "" ||
      result[key] === null ||
      result[key] === undefined
    ) {
      delete result[key];
    }
  });
  return result;
};
