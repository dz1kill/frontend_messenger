interface User {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SingUpPayload extends Omit<User, "id" | "confirmPassword"> {}

export interface LoginPayload extends Pick<User, "email" | "password"> {}

export interface AuthState {
  currentUser: UserResLoginData | UserResSingUpData | null;
  error: string | null;
}

export interface UserResLoginData {
  id: string;
  email: string;
  token: string;
  message: string;
  firstName: string;
}

export interface UserResSingUpData {
  message: string;
}

export type ApiError = {
  status: number;
  message: string;
};

export type VlidateErrState = {
  userEmail?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  confirmPassword?: string;
};

export type FormDataSignUpState = {
  password: string;
  confirmPassword: string;
  firstName: string;
  userEmail: string;
  lastName: string;
};
export type FormDataLoginState = {
  password: string;
  userEmail: string;
};

export type ValidatErrServerState = {
  isEmpty: boolean;
  isLoading: boolean;
  isErrorServer: boolean;
  errorMessageServer: string;
};
