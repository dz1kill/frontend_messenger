import { z } from "zod";

import { FormDataChangePassword } from "../../types/profile";

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
export const checkEmptyInput = (
  optionalFields: string[],
  formData: FormDataChangePassword
) => {
  const arrFormData = Object.entries(formData);

  const filterData = arrFormData.filter(
    ([key]) => !optionalFields.includes(key)
  );

  const checkEmpty = filterData.some(([, val]) => !val);

  return checkEmpty;
};

export const validateInput = (formData: FormDataChangePassword) => {
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
