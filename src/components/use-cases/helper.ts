import { z } from "zod";

import {
  FormDataChangePassword,
  FormDataCreateGroup,
  FormDataUpdateProfile,
} from "../../types/use-cases_component";

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

export const messageErrorCreateGroup = (statusCode: number) => {
  switch (statusCode) {
    case 401:
      return "Ошибка авторизации";
    case 500:
      return "Ошибка сервера";
    default:
      return "Неизвестная ошибка сервера";
  }
};
export const checkEmptyInput = (
  formData: FormDataChangePassword | FormDataCreateGroup
) => {
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

export const validateInputCreateGroup = (formData: FormDataCreateGroup) => {
  const createGroupValidate = z.object({
    groupName: z
      .string()
      .nonempty("Поле обязательно для заполнения")
      .regex(/^[A-Za-zА-Яа-я]+(?: [A-Za-zА-Яа-я]+)*$/, {
        message:
          "Только буквы (пробелы разрешены, но не в начале/конце и не подряд)",
      })
      .refine((val) => val.trim().length >= 3, {
        message: "Минимум 3 символа без учета пробелов",
      })
      .transform((val) => val.trim()),
  });

  return createGroupValidate.safeParse(formData);
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

export const generateObjListLastMessageState = (
  formData: FormDataCreateGroup,
  newUuidMessage: string,
  newUuidGroup: string,
  notificationMessage: string
) => {
  return [
    {
      messageId: newUuidMessage,
      name: formData.groupName,
      content: notificationMessage,
      companionName: null,
      companionLastName: null,
      companionId: null,
      groupId: newUuidGroup,
      groupName: formData.groupName,
      createdAt: new Date().toISOString(),
    },
  ];
};
