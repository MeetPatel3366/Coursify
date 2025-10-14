import React, { useState } from "react";
import HomeLayout from "../Layouts/HomeLayout";
import { BsPersonCircle } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { createAccount } from "../Redux/Slices/AuthSlice";
import { isEmail, isValidPassword } from "../Helpers/regexMatcher";
import ActionButton from "../Components/ActionButton";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [previewImage, setPreviewImage] = useState("");
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
    avatar: "",
  });

  const handleUserInput = (event) => {
    const { name, value } = event.target;

    setSignupData({
      ...signupData,
      [name]: value,
    });
  };

  const getImage = (event) => {
    //getting the image
    const uploadedImage = event.target.files[0];

    if (uploadedImage) {
      setSignupData({
        ...signupData,
        avatar: uploadedImage,
      });
    }

    const fileReader = new FileReader();
    fileReader.readAsDataURL(uploadedImage);
    fileReader.addEventListener("load", function () {
      setPreviewImage(this.result);
    });
  };

  const createNewAccount = async (event) => {
    event.preventDefault();

    const { fullName, email, password, avatar } = signupData;

    if (!fullName || !email || !password) {
      toast.error("Please fill all the deatils");
      return;
    }

    // checking name field length
    if (fullName.length < 5) {
      toast.error("Name should be atleast of 5 characters");
      return;
    }

    // checking valid email
    if (!isEmail(email)) {
      toast.error("Invalid email id");
      return;
    }

    //checking password validation
    if (!isValidPassword(password)) {
      toast.error(
        "Password should be 6 - 16 character long with atleast a number & special character"
      );
      return;
    }

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("avatar", avatar);

    //dispatch create account action
    const response = await dispatch(createAccount(formData));
    if (response?.payload?.success) {
      toast.success("Account created! Please verify your email before logging in.");
      // navigate("/verify/:token");
    }
    setSignupData({ fullName: "", email: "", password: "", avatar: "" });
    setPreviewImage("");
  };

  return (
    <HomeLayout>
      <div className="flex items-center justify-center h-screen">
        <form
          noValidate
          onSubmit={createNewAccount}
          className="flex flex-col justify-center gap-3 rounded-lg p-4 text-white w-96 shadow-[0_0_10px_black]"
        >
          <h1 className="text-center text-2xl font-bold">Registration Page</h1>

          <label htmlFor="image_upload" className="cursor-pointer">
            {previewImage ? (
              <img
                src={previewImage}
                alt=""
                className="w-24 h-24 rounded-full m-auto"
              />
            ) : (
              <BsPersonCircle className="w-24 h-24 rounded-full m-auto" />
            )}
          </label>
          <input
            type="file"
            name="image_upload"
            id="image_upload"
            accept=".jpg, .jpeg, .png, .svg"
            onChange={getImage}
            className="hidden"
          />

          <div className="flex flex-col gap-1">
            <label htmlFor="fullName" className="font-semibold">
              Name
            </label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              required
              placeholder="Enter your name"
              value={signupData.fullName}
              onChange={handleUserInput}
              className="bg-transparent px-2 py-1 border"
            />
          </div>

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
              value={signupData.email}
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
              value={signupData.password}
              onChange={handleUserInput}
              className="bg-transparent px-2 py-1 border"
            />
          </div>

          {/* <button
            type="submit"
            className="bg-yellow-600 hover:bg-yellow-500 transition-all ease-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer mt-2"
          >
            Create Account
          </button> */}
          <ActionButton
            label="Create Account"
            className="bg-yellow-600 hover:bg-yellow-500 transition-all ease-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer mt-2"
          />

          <p className="text-center">
            Already have an account ?{" "}
            <Link to="/login" className="link text-accent cursor-pointer">
              Login
            </Link>
          </p>
        </form>
      </div>
    </HomeLayout>
  );
};

export default Signup;
