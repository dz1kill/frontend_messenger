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

export interface CreateNewGroupResData {
  message: string;
}
export interface CreateNewGroupPayload {
  groupId: string;
  groupName: string;
  content: string;
  messageId: string;
}
