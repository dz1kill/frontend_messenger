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
