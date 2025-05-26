import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";

import { BASE_URL } from "../../utils/constants";
import {
  LoginPayload,
  SingUpPayload,
  UserResLoginData,
  UserResSingUpData,
  UserState,
} from "../../types/user";

export const createUser = createAsyncThunk<
  UserResSingUpData,
  SingUpPayload
>("users/createUser", async (payload: SingUpPayload, thunkApi) => {
  try {
    const res = await axios.post<UserResSingUpData>(
      `${BASE_URL}/users`,
      payload
    );
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return thunkApi.rejectWithValue(
        err.response?.data?.message || "Sing up failed"
      );
    }
    return thunkApi.rejectWithValue("Unknown error Sing up");
  }
});

export const loginUser = createAsyncThunk<
  UserResLoginData,
  LoginPayload
>("login/loginUser", async (payload: LoginPayload, thunkApi) => {
  try {
    const res = await axios.post<UserResLoginData>(
      `${BASE_URL}/auth/login`,
      payload
    );
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return thunkApi.rejectWithValue(
        err.response?.data?.message || "Login failed"
      );
    }
    return thunkApi.rejectWithValue("Unknown error Login");
  }
});

const initialState: UserState = {
  currentUser: null,
  isLoading: false,
  error: null,
};

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
