import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import postsService from "./postsService";

const initialState = {
  posts: [],
  post: null,
  isError: null,
  isSuccess: false,
  message: "",
  isLoading: false,
  crudSuccess: null,
  crudError: null,
};

//GET ALL POSTS
export const getAllPosts = createAsyncThunk(
  "getAllPosts",
  async (_, thunkAPI) => {
    try {
      return await postsService.getAllPosts();
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

//GET ALL LIKED POSTS
export const getAllLikedPosts = createAsyncThunk(
  "getAllLikedPosts",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await postsService.getAllLikedPosts(token);
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


//GET ALL POSTS BY CATEGORY
export const getAllPostsByCategory = createAsyncThunk(
  "getAllPostsByCategory",
  async (id, thunkAPI) => {
    try {
      return await postsService.getAllPostsByCategory(id);
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

//DELETE POST
export const deletePost = createAsyncThunk(
  "deletePost",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await postsService.deletePost(id, token);
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

//GET POST BY ID
export const getPostById = createAsyncThunk(
  "getPostById",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await postsService.getPostById(id, token);
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

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.posts = action.payload;
      })
      .addCase(getAllPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.posts = null;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(getAllLikedPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.posts = action.payload;
      })
      .addCase(getAllLikedPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllLikedPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.posts = null;
        state.isError = true;
        state.message = action.payload;
      })


      .addCase(getAllPostsByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.posts = action.payload;
      })
      .addCase(getAllPostsByCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllPostsByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.posts = null;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.crudSuccess = true;
        // state.posts = action.payload;
      })
      .addCase(deletePost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.isLoading = false;
        state.posts = null;
        state.crudError = true;
        state.crudError = false;
        state.message = action.payload;
      })

      .addCase(getPostById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.post = action.payload;
      })
      .addCase(getPostById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPostById.rejected, (state, action) => {
        state.isLoading = false;
        state.post = null;
        state.isError = true;
        state.message = action.payload;
      });
  },
});
export const { reset } = postsSlice.actions;
export default postsSlice.reducer;
