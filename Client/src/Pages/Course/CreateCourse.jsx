import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { createNewCourse } from "../../Redux/Slices/CourseSlice";
import HomeLayout from "../../Layouts/HomeLayout";
import { AiOutlineArrowLeft } from "react-icons/ai";

const CreateCourse = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userInput, setUserInput] = useState({
    title: "",
    description: "",
    category: "",
    createdBy: "",
    thumbnail: null,
    previewImage: "",
  });

  const handleImageUpload = (e) => {
    e.preventDefault();

    const uploadedImage = e.target.files[0];

    if (uploadedImage) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(uploadedImage);
      fileReader.addEventListener("load", function () {
        setUserInput({
          ...userInput,
          previewImage: this.result,
          thumbnail: uploadedImage,
        });
      });
    }
  };

  const handleUserInput = (e) => {
    const { name, value } = e.target;
    setUserInput({
      ...userInput,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const { title, description, category, createdBy, thumbnail } = userInput;

    if (!title || !description || !category || !createdBy || !thumbnail) {
      toast.error("All fields are mandatory");
      return;
    }

    const res = await dispatch(createNewCourse(userInput));

    if (res?.payload?.success) {
      setUserInput({
        title: "",
        description: "",
        category: "",
        createdBy: "",
        thumbnail: null,
        previewImage: "",
      });
      navigate("/courses");
    }
  };

  return (
    <HomeLayout>
      <div className="flex items-center justify-center h-[90vh]">
        <form
          onSubmit={handleFormSubmit}
          className="flex flex-col justify-center gap-5 rounded-lg p-4 text-white w-[700px] my-10 shadow-[0_0_10px_black] relative"
        >
          <Link className="absolute top-5 text-2xl link text-accent cursor-pointer">
            <AiOutlineArrowLeft />
          </Link>

          <h1 className="text-center text-2xl font-bold">Create New Course</h1>

          <main className="grid grid-cols-2 gap-x-10">
            <div className="gap-y-6">
              <div>
                <label htmlFor="image_uploads" className="cursor-pointer">
                  {userInput?.previewImage ? (
                    <img
                      src={userInput.previewImage}
                      alt=""
                      className="w-full h-44 m-auto border"
                    />
                  ) : (
                    <div className="w-full h-44 m-auto flex items-center justify-center border">
                      <h1 className="font-bold text-lg ">
                        Upload your course thumbnail
                      </h1>
                    </div>
                  )}
                </label>

                <input
                  type="file"
                  name="image_uploads"
                  id="image_uploads"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-lg font-semibold" htmlFor="title">
                  Course Title
                </label>
                <input
                  required
                  type="text"
                  name="title"
                  id="title"
                  placeholder="Enter course title"
                  value={userInput.title}
                  onChange={handleUserInput}
                  className="bg-transparent px-2 py-1 border"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex flex-col gap-1">
                <label className="text-lg font-semibold" htmlFor="createdBy">
                  Course Instructor
                </label>
                <input
                  required
                  type="text"
                  name="createdBy"
                  id="createdBy"
                  placeholder="Enter course instructor"
                  value={userInput.createdBy}
                  onChange={handleUserInput}
                  className="bg-transparent px-2 py-1 border"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-lg font-semibold" htmlFor="category">
                  Course Category
                </label>
                <input
                  required
                  type="text"
                  name="category"
                  id="category"
                  placeholder="Enter course category"
                  value={userInput.category}
                  onChange={handleUserInput}
                  className="bg-transparent px-2 py-1 border"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-lg font-semibold" htmlFor="description">
                  Course description
                </label>
                <textarea
                  required
                  type="text"
                  name="description"
                  id="description"
                  placeholder="Enter course description"
                  value={userInput.description}
                  onChange={handleUserInput}
                  className="bg-transparent px-2 py-1 h-24 overflow-y-scroll resize-none border"
                />
              </div>
            </div>
          </main>

          <button
            type="submit"
            className="w-full bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 py-2 rounded-sm font-semibold text-lg cursor-pointer"
          >
            Create Course
          </button>
        </form>
      </div>
    </HomeLayout>
  );
};

export default CreateCourse;
