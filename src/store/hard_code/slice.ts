import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { ApiError } from "../../types/auth";
import { ROUTES } from "../../router/routes";

type MigratePayload = {
  param: "start" | "undo";
};

type MigarateResData = {
  message: string;
};

export const managementMigrate = createAsyncThunk<
  MigarateResData,
  MigratePayload,
  {
    rejectValue: ApiError;
  }
>("hardCode/migrate", async (payload: MigratePayload, thunkApi) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return thunkApi.rejectWithValue({
      status: 401,
      message: "Authentication token is missing",
    });
  }
  try {
    const res = await axios.post<MigarateResData>(
      `${process.env.REACT_APP_API_BASE_URL}${ROUTES.SERVER.HARD_CODE_MIGRATE}`,
      { param: payload.param },
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
        message: err.response?.data || "hardCode/migrate",
      });
    }
    throw err;
  }
});
