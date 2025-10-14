import React, { useState } from "react";
import HomeLayout from "../Layouts/HomeLayout";
import toast from "react-hot-toast";
import { isEmail } from "../Helpers/regexMatcher";
import axiosInstance from "../Helpers/axiosInstance";
import ActionButton from "../Components/ActionButton";

const Contact = () => {
  const [userInput, setUserInput] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInput({
      ...userInput,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log(userInput);

    const { name, email, message } = userInput;

    if (!name || !email || !message) {
      toast.error("All fields are mandatory");
      return;
    }

    // checking valid email
    if (!isEmail(email)) {
      toast.error("Invalid email id");
      return;
    }

    try {
      const response = await toast.promise(
        axiosInstance.post("other/contact", { userInput }),
        {
          loading: "Submitting your message",
          success: "Form submitted successfully",
          error: "Failed to submit the form",
        }
      );

      if (response?.data?.success) {
        setUserInput({
          name: "",
          email: "",
          message: "",
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
  return (
    <HomeLayout>
      <div className="flex items-center justify-center h-[100vh]">
        <form
          noValidate
          onSubmit={handleFormSubmit}
          className="flex flex-col items-center justify-center gap-2 p-5 rounded-md text-white shadow-[0_0_10px_black] w-[22rem]"
        >
          <h1 className="text-3xl font-semibold">Contact Form</h1>

          <div className="flex flex-col w-full gap-1">
            <label htmlFor="name" className="text-xl font-semibold">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              value={userInput.name}
              onChange={handleInputChange}
              className="bg-transparent border px-2 py-1 rounded-sm"
            />
          </div>

          <div className="flex flex-col w-full gap-1">
            <label htmlFor="email" className="text-xl font-semibold">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={userInput.email}
              onChange={handleInputChange}
              className="bg-transparent border px-2 py-1 rounded-sm"
            />
          </div>

          <div className="flex flex-col w-full gap-1">
            <label htmlFor="message" className="text-xl font-semibold">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              placeholder="Enter your message"
              value={userInput.message}
              onChange={handleInputChange}
              className="bg-transparent border px-2 py-1 rounded-sm resize-none h-40 "
            />
          </div>

          {/* <button
            type="submit"
            className="w-full bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-100 rounded-sm py-2 font-semibold text-lg cursor-pointer"
          >
            Submit
          </button> */}
          <ActionButton
            type="submit"
            label="Submit"
            className="w-full bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-100 rounded-sm py-2 font-semibold text-lg cursor-pointer"
          />

        </form>
      </div>
    </HomeLayout>
  );
};

export default Contact;
