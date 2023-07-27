import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";
import { TOKEN_LOCAL_STORAGE } from "../../data/static_data";

// GET TOKEN FROM LOCAL STORAGE
const token = localStorage.getItem(TOKEN_LOCAL_STORAGE)
  ? JSON.parse(localStorage.getItem(TOKEN_LOCAL_STORAGE))
  : null;

const initialState = {
  token: token,
  isError: null,
  isSuccess: null,
  message: "",
  isLoading: false,
  data: null,
  isAdminAuthenticated: null
};

//LOGIN
export const login = createAsyncThunk("auth/login", async (data, thunkAPI) => {
  try {
    return await authService.login(data);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

//LOGOUT USER
export const logout = createAsyncThunk("auth/logout", async () => {
  await authService.logout();
});

//LOAD CURRENT USER
export const currentUser = createAsyncThunk(
  "auth/current-user",
  async (_, thunkAPI) => {
    try {
      const token = JSON.parse(localStorage.getItem(TOKEN_LOCAL_STORAGE));

      return await authService.currentUser(token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.token = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.token = null;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(currentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        // state.isSuccess = true;
        state.isAdminAuthenticated = action.payload.is_admin ;
      })
      .addCase(currentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(currentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.data = null;
        state.isAdminAuthenticated = false;
        // state.isError = true;
        state.message = action.payload;
      });
  },
});
export const { reset } = authSlice.actions;
export default authSlice.reducer;
