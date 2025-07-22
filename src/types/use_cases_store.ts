export interface UseCasesState {
  searchUsersAndGroupResult: ItemSearchUsersAndGroup[] | [];
  error: string | null;
  searchUsersResult: ItemSearchUsers[] | [];
}
export interface ItemSearchUsersAndGroup {
  userId: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  groupId: string | null;
  groupName: string | null;
}

export interface ItemSearchUsers {
  email: string;
  firstName: string;
  lastName: string;
  userId: string;
}

export interface SearchResData {
  data: ItemSearchUsersAndGroup[] | [];
}

export interface SearchByNameOrEmailResData {
  data: ItemSearchUsers[] | [];
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
  notificationMessage: string;
  messageId: string;
}
