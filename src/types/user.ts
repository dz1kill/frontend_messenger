export interface User {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SingUpPayload
  extends Omit<User, "id" | "confirmPassword"> {}

export interface LoginPayload
  extends Pick<User, "email" | "password"> {}

export interface UserState {
  currentUser: UserResLoginData | UserResSingUpData | null;
  isLoading: boolean;
  error: string | null;
}

export interface UserResLoginData {
  access_token: string;
  refresh_token: string;
}

export interface UserResSingUpData
  extends Omit<User, "confirmPassword"> {
  role: string;
}
