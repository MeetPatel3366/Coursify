import React, { useState } from "react";
import HomeLayout from "../../Layouts/HomeLayout";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { changePassword } from "../../Redux/Slices/AuthSlice";
import ActionButton from "../../Components/ActionButton";

const ChangePassword = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [userPassword, setUserPassword] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setUserPassword({
      ...userPassword,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const { oldPassword, newPassword } = userPassword;

    if (!oldPassword || !newPassword) {
      toast.error("All fields are mandatory");
      return;
    }

    if (!newPassword.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/)) {
      toast.error(
        "Minimum password length should be 6 with Uppercase, Lowercase, Number and Symbol"
      );
      return;
    }

    const res = await dispatch(changePassword(userPassword));

    setUserPassword({
      oldPassword: "",
      newPassword: "",
    });

    if (res.payload.success) {
      navigate("/user/profile");
    }
  };
  return (
    <HomeLayout>
      <div className="flex items-center justify-center h-[100vh]">
        <form
          onSubmit={handleFormSubmit}
          className="flex flex-col justify-center gap-6 rounded-lg p-4 text-white w-80 h-[26rem] shadow-[0_0_10px_black]"
        >
          <h1 className="text-center text-2xl font-bold">Change Password</h1>

          <div className="flex flex-col gap-1">
            <label htmlFor="oldPassword" className="text-lg font-semibold">
              Old Passsword
            </label>
            <input
              required
              type="password"
              name="oldPassword"
              id="oldPassword"
              placeholder="Enter your old password"
              value={userPassword.oldPassword}
              onChange={handlePasswordChange}
              className="bg-transparent px-2 py-1 border"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="newPassword" className="text-lg font-semibold">
              New Passsword
            </label>
            <input
              required
              type="password"
              name="newPassword"
              id="newPassword"
              placeholder="Enter your new password"
              value={userPassword.newPassword}
              onChange={handlePasswordChange}
              className="bg-transparent px-2 py-1 border"
            />
          </div>

          <Link to="/user/profile">
            <p className="link text-accent cursor-pointer flex items-center justify-center w-full gap-2">
              {" "}
              <AiOutlineArrowLeft /> Back To Profile
            </p>
          </Link>

          {/* <button
            type="submit"
            className="w-full bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer"
          >
            Change Password
          </button> */}
          <ActionButton
            label="Change Password"
            className="w-full bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer"
          />
        </form>
      </div>
    </HomeLayout>
  );
};

export default ChangePassword;
