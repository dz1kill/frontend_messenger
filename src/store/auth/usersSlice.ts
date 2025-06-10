import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

import {
  ApiError,
  LoginPayload,
  SingUpPayload,
  UserResLoginData,
  UserResSingUpData,
  AuthState,
} from "../../types/user";
import { ROUTES } from "../../router/routes";

const initialState: AuthState = {
  currentUser: null,
  isLoading: false,
  error: null,
};

export const createUser = createAsyncThunk<
  UserResSingUpData,
  SingUpPayload,
  {
    rejectValue: ApiError;
  }
>("users/createUser", async (payload: SingUpPayload, thunkApi) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const res = await axios.post<UserResSingUpData>(
      `${process.env.REACT_APP_API_BASE_URL}${ROUTES.SERVER.REGISTER}`,
      payload
    );
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return thunkApi.rejectWithValue({
        status: err.status || 500,
        message: err.response?.data || "Unknown error Sing up",
      });
    }
    throw err;
  }
});

export const loginUser = createAsyncThunk<
  UserResLoginData,
  LoginPayload,
  {
    rejectValue: ApiError;
  }
>("login/loginUser", async (payload: LoginPayload, thunkApi) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const res = await axios.post<UserResLoginData>(
      `${process.env.REACT_APP_API_BASE_URL}${ROUTES.SERVER.LOGIN}`,
      payload
    );
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return thunkApi.rejectWithValue({
        status: err.status || 500,
        message: err.response?.data || "Unknown error Login",
      });
    }
    throw err;
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(
        createUser.fulfilled,
        (state, action: PayloadAction<UserResSingUpData>) => {
          state.isLoading = false;
          state.currentUser = action.payload;
        }
      )
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<UserResLoginData>) => {
          state.isLoading = false;
          state.currentUser = action.payload;
        }
      );
  },
});

export default userSlice.reducer;
