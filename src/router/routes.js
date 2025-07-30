export const ROUTES = {
  SERVER: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/sing-up",
    DESTROY: "/profile/destroy",
    CHANGE_PASSWORD: "/profile/change-password",
    UPDATE_PROFILE: "/profile/update",
    SEARCH_USER_AND_GROUP: "/use-cases/search",
    DELETE_MESSAGES_FROM_USER: "/use-cases/mark-as-deleted",
    CREATE_GROUP: "/use-cases/create-group",
    SEARCH_USERS_BY_NAME_OR_EMAIL: "/use-cases/search-users",
    HARD_CODE_MIGRATE: "/hard-code/migrate",
  },
  APP: {
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/sing-up",
    PROFILE: {
      ROOT: "/use-cases",
    },
  },
};
