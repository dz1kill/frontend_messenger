import { z } from "zod";
import { FormDataSignUpState } from "../../types/user";

export const messageError = (statusCode: number) => {
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

export const validateInput = (formData: FormDataSignUpState) => {
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

export const checkEmptyInput = (formData: FormDataSignUpState) => {
  const optionalFields = ["lastName"];
  const arrFormData = Object.entries(formData);

  const filterData = arrFormData.filter(
    ([key]) => !optionalFields.includes(key)
  );

  const checkEmpty = filterData.some(([, val]) => !val);

  return checkEmpty;
};
