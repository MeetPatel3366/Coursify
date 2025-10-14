import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { decrementCooldown } from "./Redux/Slices/rateLimitSlice";
import { Toaster } from "react-hot-toast";

import HomePage from "./Pages/HomePage";
import AboutUs from "./Pages/AboutUs";
import NotFound from "./Pages/NotFound";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import CourseList from "./Pages/Course/CourseList";
import Contact from "./Pages/Contact";
import Denied from "./Pages/Denied";
import CourseDescription from "./Pages/Course/CourseDescription";
import RequireAuth from "./Components/Auth/RequireAuth";
import CreateCourse from "./Pages/Course/CreateCourse";
import Profile from "./Pages/User/Profile";
import EditProfile from "./Pages/User/EditProfile";
import Checkout from "./Pages/Payment/Checkout";
import CheckoutSuccess from "./Pages/Payment/CheckoutSuccess";
import CheckoutFailure from "./Pages/Payment/CheckoutFailure";
import DisplayLectures from "./Pages/Dashboard/DisplayLectures";
import AddLecture from "./Pages/Dashboard/AddLecture";
import { AdminDashboard } from "./Pages/Dashboard/AdminDashboard";
import ForgotPassword from "./Pages/Password/ForgotPassword";
import ResetPassword from "./Pages/Password/ResetPassword";
import ChangePassword from "./Pages/Password/ChangePassword";
import UpdateCourse from "./Pages/Course/UpdateCourse";
import EmailVerify from "./Pages/EmailVerify";
import AuthSuccess from "./Pages/AuthSuccess";

const App = () => {
  const dispatch = useDispatch();
  const cooldown = useSelector((state) => state.rateLimit.cooldown);

  // Global cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        dispatch(decrementCooldown());
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown, dispatch]);


  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify/:token" element={<EmailVerify />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/success" element={<AuthSuccess />} />

        <Route path="/courses" element={<CourseList />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/denied" element={<Denied />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />

        <Route element={<RequireAuth allowedRoles={["ADMIN"]} />}>
          <Route path="/course/create" element={<CreateCourse />} />
          <Route path="/course/update" element={<UpdateCourse />} />
          <Route path="/course/addlecture" element={<AddLecture />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={["ADMIN", "USER"]} />}>
          <Route path="/user/profile" element={<Profile />} />
          <Route path="/user/editProfile" element={<EditProfile />} />
          <Route path="/course/description/" element={<CourseDescription />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/checkout/fail" element={<CheckoutFailure />} />
          <Route path="/course/displaylecture" element={<DisplayLectures />} />
          <Route path="/changePassword" element={<ChangePassword />} />
        </Route>

        <Route path="*" element={<NotFound />}></Route>
      </Routes>

      <Toaster position="top-right" />
    </>
  );
};

export default App;
