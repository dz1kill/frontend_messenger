import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

import {
  ApiError,
  LoginPayload,
  SingUpPayload,
  UserResLoginData,
  UserResSingUpData,
  AuthState,
} from "../../types/auth";
import { ROUTES } from "../../router/routes";

const initialState: AuthState = {
  currentUser: null,
  error: null,
};

export const createUser = createAsyncThunk<
  UserResSingUpData,
  SingUpPayload,
  {
    rejectValue: ApiError;
  }
>("auth/createUser", async (payload: SingUpPayload, thunkApi) => {
  try {
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
>("auth/loginUser", async (payload: LoginPayload, thunkApi) => {
  try {
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

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(
      loginUser.fulfilled,
      (state, action: PayloadAction<UserResLoginData>) => {
        state.currentUser = action.payload;
      }
    );
  },
});

export default authSlice.reducer;
