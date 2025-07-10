export const mockChats = [
  {
    id: 1,
    name: "Иван",
    companionLastName: "Петров",
    companionEmail: "ivan.petrov@example.com",
    content: "Привет, как дела?",
    createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 минут назад
    isGroup: false,
    unreadCount: 2,
  },
  {
    id: 2,
    name: "Анна",
    companionLastName: "Сидорова",
    companionEmail: "anna.sidorova@example.com",
    content: "Договорились на завтра",
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 минут назад
    isGroup: false,
    unreadCount: 0,
  },
  {
    id: 3,
    name: "Рабочая группа",
    content: "Мария: Я отправила документы",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 часа назад
    isGroup: true,
    unreadCount: 5,
  },
  {
    id: 4,
    name: "Друзья",
    content: "Алексей: Кто идет в кино?",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 день назад
    isGroup: true,
    unreadCount: 0,
  },
  {
    id: 5,
    name: "Елена",
    companionLastName: "Кузнецова",
    companionEmail: "elena.kuznetsova@example.com",
    content: "Спасибо за помощь!",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 дня назад
    isGroup: false,
    unreadCount: 1,
  },
];
