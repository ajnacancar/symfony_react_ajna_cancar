import React, { useEffect } from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider, useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { store } from "./app/store";
import HomePage from "./pages/HomePage";
import { TOKEN_LOCAL_STORAGE } from "./data/static_data";
import { currentUser } from "./features/auth/authSlice";
import Header from "./components/Header";
import PostDetails from "./pages/PostDetails";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminAllPosts from "./pages/AdminAllPosts";
import AdminEditPost from "./pages/AdminEditPost";
import AdminCreateNewPost from "./pages/AdminCreateNewPost";

function Main() {
  const { isAdminAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const token = localStorage.getItem(TOKEN_LOCAL_STORAGE)
    ? JSON.parse(localStorage.getItem(TOKEN_LOCAL_STORAGE))
    : null;

  useEffect(() => {
    dispatch(currentUser());
  }, [dispatch, isAdminAuthenticated]);

  return (
    <Router>
      <Header />
      <Routes>
        <Route exact path={"/"} element={<HomePage />} />
        <Route path={"/post/:id"} element={<PostDetails />} />
        <Route path={"/login"} element={<LoginPage />} />
        <Route path={"/register"} element={<RegisterPage />} />

        <Route
          path={"/all-posts"}
          element={
            <>
              {isAdminAuthenticated !== null && (
                <ProtectedRoute
                  token={token}
                  data={isAdminAuthenticated}
                  children={<AdminAllPosts />}
                />
              )}
            </>
          }
        />

        <Route
          path={"/new-post"}
          element={
            <>
              {isAdminAuthenticated !== null && (
                <ProtectedRoute
                  token={token}
                  data={isAdminAuthenticated}
                  children={<AdminCreateNewPost />}
                />
              )}
            </>
          }
        />

        <Route
          path={"/post-edit/:id"}
          element={
            <>
              {isAdminAuthenticated !== null && (
                <ProtectedRoute
                  token={token}
                  data={isAdminAuthenticated}
                  children={<AdminEditPost />}
                />
              )}
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default Main;

if (document.getElementById("app")) {
  const rootElement = document.getElementById("app");
  const root = createRoot(rootElement);

  root.render(
    <StrictMode>
      <Provider store={store}>
        <Main />
      </Provider>
    </StrictMode>
  );
}
