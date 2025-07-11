import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

import { ApiError } from "../../types/auth";
import { ROUTES } from "../../router/routes";

import {
  SearchPayload,
  SearchResData,
  UseCasesState,
} from "../../types/use_cases";

const initialState: UseCasesState = {
  searchResult: [],
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

const useCasesSlice = createSlice({
  name: "useCases",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(
      searchUserAndGroup.fulfilled,
      (state, action: PayloadAction<SearchResData>) => {
        state.searchResult = action.payload.data;
      }
    );
  },
});

export default useCasesSlice.reducer;
