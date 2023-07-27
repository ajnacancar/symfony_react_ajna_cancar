import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, reset } from "../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function LoginPage() {
  const { isSuccess, isError } = useSelector((state) => state.auth);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(login({ username, password }));
  };

  useEffect(() => {
    if (isSuccess) {
      window.location.replace("/");
    }

    if (isError) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
    dispatch(reset());
  }, [isSuccess, navigate, isError]);

  return (
    <div className="w-full">
      <div className="w-max-[1440px] w-full flex justify-center items-center h-[80vh]">
        <form onSubmit={handleSubmit} className="p-2 w-full lg:w-1/4">
          <h1 className="text-center font-bold ">
            Login as Admin to have full controll
          </h1>
          <div className="flex flex-col w-full my-4">
            <label htmlFor="username" className="text-blue-600">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border w-full border-blue-500 focus:outline-none h-10 p-2 rounded-sm"
            />
          </div>

          <div className="flex flex-col w-full my-4">
            <label htmlFor="password" className="text-blue-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border w-full border-blue-500 focus:outline-none h-10 p-2 rounded-sm"
            />
          </div>

          <div className="my-4 w-full">
            <button
              type="submit"
              className="text-center w-full bg-blue-400 text-white font-bold py-3 rounded-sm"
            >
              Proceed to Login
            </button>
            <p className="text-center my-2">
              Dont have account?{" "}
              <Link to={"/register"} className="text-blue-500">
                Sign Up
              </Link>{" "}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
