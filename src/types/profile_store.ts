export interface UserResDestroyData {
  status: number;
  message: string;
}

export interface UserResChangePasswordData {
  message: string;
  status: number;
}

export interface UserResUpdateProfileData {
  message: string;
  status: number;
}
export interface ChangePasswordPayload {
  newPassword: string;
  oldPassword: string;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
}
