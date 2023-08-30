import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import postsReducer from "../features/posts/postsSlice";
import categoryReducer from "../features/category/categorySlice";

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    auth: authReducer,
    category: categoryReducer,
  },
});
