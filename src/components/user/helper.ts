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
