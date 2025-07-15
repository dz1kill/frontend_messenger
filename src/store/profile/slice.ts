import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { ApiError } from "../../types/auth";
import { ROUTES } from "../../router/routes";
import {
  ChangePasswordPayload,
  UpdateProfilePayload,
  UserResChangePasswordData,
  UserResDestroyData,
  UserResUpdateProfileData,
} from "../../types/use-cases";

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

export const changePasswordUser = createAsyncThunk<
  UserResChangePasswordData,
  ChangePasswordPayload,
  {
    rejectValue: ApiError;
  }
>(
  "profile/changePassword",
  async (payload: ChangePasswordPayload, thunkApi) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return thunkApi.rejectWithValue({
        status: 401,
        message: "Authentication token is missing",
      });
    }
    try {
      const res = await axios.patch<UserResChangePasswordData>(
        `${process.env.REACT_APP_API_BASE_URL}${ROUTES.SERVER.CHANGE_PASSWORD}`,

        payload,

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
          message: err.response?.data || "Unknown error Change password",
        });
      }
      throw err;
    }
  }
);

export const updateProfileUser = createAsyncThunk<
  UserResUpdateProfileData,
  UpdateProfilePayload,
  {
    rejectValue: ApiError;
  }
>("profile/updateProfile", async (payload: UpdateProfilePayload, thunkApi) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return thunkApi.rejectWithValue({
      status: 401,
      message: "Authentication token is missing",
    });
  }
  try {
    const res = await axios.patch<UserResUpdateProfileData>(
      `${process.env.REACT_APP_API_BASE_URL}${ROUTES.SERVER.UPDATE_PROFILE}`,

      payload,

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
        message: err.response?.data || "Unknown error Change password",
      });
    }
    throw err;
  }
});
