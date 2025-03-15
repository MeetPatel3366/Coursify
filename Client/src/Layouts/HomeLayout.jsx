import React from "react";
import { FiMenu } from "react-icons/fi";
import { AiFillCloseCircle } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../Components/Footer";
import { logout } from "../Redux/Slices/AuthSlice";

const HomeLayout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //for checking if user is logged in
  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);

  //for displaying the options according to role
  const role = useSelector((state) => state?.auth?.role);

  const handleChangeWidth = () => {
    const drawerSide = document.getElementsByClassName("drawer-side");
    drawerSide[0].style.width = "auto";
  };
  const handleHideDrawer = () => {
    const element = document.getElementsByClassName("drawer-toggle");
    element[0].checked = false;

    const drawerSide = document.getElementsByClassName("drawer-side");
    drawerSide[0].style.width = "0";
  };

  const handleLogout = async (e) => {
    e.preventDefault();

    const res = await dispatch(logout());
    if (res?.payload?.success) navigate("/");
  };
  return (
    <div className="min-h-[90vh]">
      <div className="drawer absolute left-0 z-50 w-fit">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Page content here */}
          <label htmlFor="my-drawer" className="cursor-pointer relative">
            <FiMenu
              onClick={handleChangeWidth}
              size="32px"
              className="font-bold text-white m-4"
            />
          </label>
        </div>
        <div className="drawer-side w-0">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu w-48 h-[100%] p-4 sm:w-80 bg-base-200 text-base-content relative">
            {/* Sidebar content here */}
            <li className="w-fit absolute right-2 z-50">
              <button>
                <AiFillCloseCircle onClick={handleHideDrawer} size={24} />
              </button>
            </li>
            <li>
              <Link to="/">Home</Link>
            </li>

            {isLoggedIn && role == "ADMIN" && (
              <li>
                <Link to="/course/create">Create New Course</Link>
              </li>
            )}

            <li>
              <Link to="/courses">All Courses</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>

            {!isLoggedIn && (
              <li className="absolute bottom-4 w-[90%]">
                <div className="w-full flex items-center justify-center">
                  <button className="px-4 py-1 font-semibold rounded-md bg-purple-600">
                    <Link to="/login">Login</Link>
                  </button>
                  <button className=" px-4 py-1 font-semibold rounded-md bg-pink-600">
                    <Link to="/signup">Signup</Link>
                  </button>
                </div>
              </li>
            )}

            {isLoggedIn && (
              <li className="absolute bottom-4 w-[90%]">
                <div className="w-full flex items-center justify-center">
                  <button className="px-4 py-1 font-semibold rounded-md bg-purple-600">
                    <Link to="/user/profile">profile</Link>
                  </button>
                  <button className=" px-4 py-1 font-semibold rounded-md bg-pink-600">
                    <Link onClick={handleLogout} to="/logout">
                      Logout
                    </Link>
                  </button>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>

      {children}

      <Footer />
    </div>
  );
};

export default HomeLayout;
