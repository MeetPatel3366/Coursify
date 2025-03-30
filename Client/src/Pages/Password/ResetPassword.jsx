import React, { useState } from "react";
import HomeLayout from "../../Layouts/HomeLayout";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { resetPassword } from "../../Redux/Slices/AuthSlice";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [data, setData] = useState({
    password: "",
    confirmPassword: "",
    resetToken: useParams().resetToken,
  });

  const handleUserInput = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const { password, confirmPassword, resetToken } = data;

    if (!password || !confirmPassword || !resetToken) {
      toast.error("All fields are mandatory");
    }

    if (!data.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/)) {
      toast.error(
        "Minimum password length should be 8 with Uppercase, Lowercase, Number and Symbol"
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Both password should be same");
      return;
    }

    const res = await dispatch(resetPassword(data));

    console.log("reset res : ", res);

    if (res.payload.success) {
      navigate("/login");
    }
  };
  return (
    <HomeLayout>
      <div className="flex items-center justify-center h-[100vh]">
        <form
          onSubmit={handleFormSubmit}
          className="flex flex-col justify-center gap-6 rounded-lg p-4 text-white w-80 h-[26rem] shadow-[0_0_10px_black]"
        >
          <h1 className="text-center text-2xl font-bold">Reset Password</h1>

          <div className="flex flex-col gap-1">
            <label htmlFor="password">New Password</label>
            <input
              required
              type="password"
              name="password"
              id="password"
              placeholder="Enter your new password"
              value={data.password}
              onChange={handleUserInput}
              className="bg-transparent px-2 py-1 border"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              required
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Confirm your new password"
              value={data.confirmPassword}
              onChange={handleUserInput}
              className="bg-transparent px-2 py-1 border"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer"
          >
            Reset Password
          </button>
        </form>
      </div>
    </HomeLayout>
  );
};

export default ResetPassword;
