export interface ProfileSatate {
  error: string | null;
  destroyUser: UserResDestroyData | null;
}

export interface UserResDestroyData {
  message: string;
}
