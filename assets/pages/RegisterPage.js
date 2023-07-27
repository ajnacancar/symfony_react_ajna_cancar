import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post("/api/register", { username, password })
      .then((res) => {
        Swal.fire({
          icon: "succes",
          title: "Created!",
          text: "Your accoutn have been creted",
        });

        setUsername("");
        setPassword("");
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      });
  };

  return (
    <div className="w-full">
      <div className="w-max-[1440px] w-full flex justify-center items-center h-[80vh]">
        <form onSubmit={handleSubmit} className="p-2 w-full lg:w-1/4">
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
              Proceed to Register
            </button>
            <p className="text-center my-2">
              Already have account?{" "}
              <Link to={"/login"} className="text-blue-500">
                Sign In
              </Link>{" "}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
