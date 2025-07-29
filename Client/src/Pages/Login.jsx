import React, { useState } from "react";
import HomeLayout from "../Layouts/HomeLayout";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { login } from "../Redux/Slices/AuthSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleUserInput = (event) => {
    const { name, value } = event.target;

    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    const { email, password } = loginData;

    if (!email || !password) {
      toast.error("Please fill all the deatils");
      return;
    }

    //dispatch login action
    const response = await dispatch(login(loginData));
    if (response?.error?.message?.includes("Email is not verified")) {
      toast.error("Please verify your email first.");
      return;
    }

    if (response?.payload?.success) {
      navigate("/");
    }
    setLoginData({ email: "", password: "" });
  };

  return (
    <HomeLayout>
      <div className="flex items-center justify-center h-screen">
        <form
          noValidate
          onSubmit={handleLogin}
          className="flex flex-col justify-center gap-3 rounded-lg p-4 text-white w-96 shadow-[0_0_10px_black]"
        >
          <h1 className="text-center text-2xl font-bold">Login Page</h1>

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="font-semibold">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              placeholder="Enter your email"
              value={loginData.email}
              onChange={handleUserInput}
              className="bg-transparent px-2 py-1 border"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-semibold">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
              placeholder="Enter your password"
              value={loginData.password}
              onChange={handleUserInput}
              className="bg-transparent px-2 py-1 border"
            />
          </div>

          <button
            type="submit"
            className="bg-yellow-600 hover:bg-yellow-500 transition-all ease-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer mt-2"
          >
            Login
          </button>

          <Link to="/forgotpassword">
            <p className="text-center link text-accent cursor-pointer">
              Forgot Password
            </p>
          </Link>

          <p className="text-center">
            Do not have an account ?{" "}
            <Link to="/signup" className="link text-accent cursor-pointer">
              Signup
            </Link>
          </p>
        </form>
      </div>
    </HomeLayout>
  );
};

export default Login;
