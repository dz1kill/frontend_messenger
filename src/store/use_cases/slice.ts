import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

import { ApiError } from "../../types/auth";
import { ROUTES } from "../../router/routes";

import {
  CreateNewGroupPayload,
  CreateNewGroupResData,
  DeleteMessagesDialogPayload,
  DeleteMessagesDialogResData,
  SearchByNameOrEmailResData,
  SearchPayload,
  SearchResData,
  UseCasesState,
} from "../../types/use_cases_store";

const initialState: UseCasesState = {
  searchUsersAndGroupResult: [],
  searchUsersResult: [],
  error: null,
};

export const searchUserAndGroup = createAsyncThunk<
  SearchResData,
  SearchPayload,
  {
    rejectValue: ApiError;
  }
>("useCases/search", async (payload: SearchPayload, thunkApi) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return thunkApi.rejectWithValue({
      status: 401,
      message: "Authentication token is missing",
    });
  }
  try {
    const res = await axios.get<SearchResData>(
      `${process.env.REACT_APP_API_BASE_URL}${ROUTES.SERVER.SEARCH_USER_AND_GROUP}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: {
          searchText: payload.searchText,
        },
      }
    );
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return thunkApi.rejectWithValue({
        status: err.status || 500,
        message: err.response?.data || "useCases/search",
      });
    }
    throw err;
  }
});

export const deleteMessagesDialog = createAsyncThunk<
  DeleteMessagesDialogResData,
  DeleteMessagesDialogPayload,
  {
    rejectValue: ApiError;
  }
>(
  "useCases/deleteMessagesDialog",
  async (payload: DeleteMessagesDialogPayload, thunkApi) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return thunkApi.rejectWithValue({
        status: 401,
        message: "Authentication token is missing",
      });
    }
    try {
      const res = await axios.post<DeleteMessagesDialogResData>(
        `${process.env.REACT_APP_API_BASE_URL}${ROUTES.SERVER.DELETE_MESSAGES_FROM_USER}`,
        { companionId: payload.companionId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return res.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return thunkApi.rejectWithValue({
          status: err.status || 500,
          message: err.response?.data || "useCases/deleteMessagesDialog",
        });
      }
      throw err;
    }
  }
);

export const createNewGroup = createAsyncThunk<
  CreateNewGroupResData,
  CreateNewGroupPayload,
  {
    rejectValue: ApiError;
  }
>("useCases/createGroup", async (payload: CreateNewGroupPayload, thunkApi) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return thunkApi.rejectWithValue({
      status: 401,
      message: "Authentication token is missing",
    });
  }
  try {
    const res = await axios.post<CreateNewGroupResData>(
      `${process.env.REACT_APP_API_BASE_URL}${ROUTES.SERVER.CREATE_GROUP}`,
      {
        groupId: payload.groupId,
        groupName: payload.groupName,
        notificationMessage: payload.notificationMessage,
        messageId: payload.messageId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return thunkApi.rejectWithValue({
        status: err.status || 500,
        message: err.response?.data || "useCases/createNewGroup",
      });
    }
    throw err;
  }
});

export const searchUsersByNameOrEmail = createAsyncThunk<
  SearchByNameOrEmailResData,
  SearchPayload,
  {
    rejectValue: ApiError;
  }
>(
  "useCases/searchUsersByNameOrEmail",
  async (payload: SearchPayload, thunkApi) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return thunkApi.rejectWithValue({
        status: 401,
        message: "Authentication token is missing",
      });
    }
    try {
      const res = await axios.get<SearchByNameOrEmailResData>(
        `${process.env.REACT_APP_API_BASE_URL}${ROUTES.SERVER.SEARCH_USERS_BY_NAME_OR_EMAIL}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: {
            searchText: payload.searchText,
          },
        }
      );
      return res.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return thunkApi.rejectWithValue({
          status: err.status || 500,
          message: err.response?.data || "useCases/searchUsersByNameOrEmail",
        });
      }
      throw err;
    }
  }
);

const useCasesSlice = createSlice({
  name: "useCases",
  initialState,
  reducers: {
    clearSearchResults(state) {
      state.searchUsersAndGroupResult = [];
      state.searchUsersResult = [];
    },
  },

  extraReducers: (builder) => {
    builder.addCase(
      searchUserAndGroup.fulfilled,
      (state, action: PayloadAction<SearchResData>) => {
        state.searchUsersAndGroupResult = action.payload.data;
      }
    );

    builder.addCase(
      searchUsersByNameOrEmail.fulfilled,
      (state, action: PayloadAction<SearchByNameOrEmailResData>) => {
        state.searchUsersResult = action.payload.data;
      }
    );
  },
});

export const { clearSearchResults } = useCasesSlice.actions;
export default useCasesSlice.reducer;
