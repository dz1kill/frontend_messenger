import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

import { ApiError } from "../../types/auth";
import { ROUTES } from "../../router/routes";
import { ProfileSatate, UserResDestroyData } from "../../types/profile";

const initialState: ProfileSatate = {
  destroyUser: null,
  error: null,
};

export const destroyUser = createAsyncThunk<
  UserResDestroyData,
  void,
  {
    rejectValue: ApiError;
  }
>("profile/destroy", async (_, thunkApi) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return thunkApi.rejectWithValue({
      status: 401,
      message: "Authentication token is missing",
    });
  }
  try {
    const res = await axios.delete<UserResDestroyData>(
      `${process.env.REACT_APP_API_BASE_URL}${ROUTES.SERVER.DESTROY}`,
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
        message: err.response?.data || "Unknown error Destroy",
      });
    }
    throw err;
  }
});

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(
      destroyUser.fulfilled,
      (state, action: PayloadAction<UserResDestroyData>) => {
        state.destroyUser = action.payload;
      }
    );
  },
});

export default profileSlice.reducer;
