export interface UseCasesState {
  searchResult: SearchData[] | [];
  error: string | null;
}
export interface SearchData {
  userId: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  groupId: string | null;
  groupName: string | null;
}

export interface SearchResData {
  data: SearchData[] | [];
}

export interface SearchPayload {
  searchText: string;
}

export interface DeleteMessagesDialogResData {
  message: string;
}

export interface DeleteMessagesDialogPayload {
  companionId: string;
}
