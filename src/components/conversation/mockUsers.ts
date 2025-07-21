export interface User {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  online?: boolean;
}

export const mockUsers: User[] = [
  {
    id: "1",
    firstName: "Иван",
    lastName: "Иванов",
    avatar: "",
    online: true,
  },
  {
    id: "2",
    firstName: "Петр",
    lastName: "Петров",
    avatar: "",
    online: false,
  },
  {
    id: "3",
    firstName: "Сергей",
    lastName: "Сергеев",
    avatar: "",
    online: true,
  },
  {
    id: "4",
    firstName: "Анна",
    lastName: "Аннова",
    avatar: "",
    online: false,
  },
  {
    id: "5",
    firstName: "Мария",
    lastName: "Мариева",
    avatar: "",
    online: true,
  },
  {
    id: "6",
    firstName: "Иван",
    lastName: "Иванов",
    avatar: "",
    online: true,
  },
  {
    id: "7",
    firstName: "Петр",
    lastName: "Петров",
    avatar: "",
    online: false,
  },
];
