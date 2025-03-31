import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import HomeLayout from "../../Layouts/HomeLayout";
import toast from "react-hot-toast";
import { updateCourse } from "../../Redux/Slices/CourseSlice";

const UpdateCourse = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  console.log(state);

  const [data, setData] = useState({
    title: state.title,
    category: state.category,
    createdBy: state.createdBy,
    description: state.description,
    thumbnail: "",
    previewImage: "",
    _id: state._id,
  });

  const handleImageUpload = (e) => {
    e.preventDefault();

    const uploadedImage = e.target.files[0];
    console.log(uploadedImage);

    if (uploadedImage) {
      const fileReader = new FileReader();
      console.log("file reader ", fileReader);
      fileReader.readAsDataURL(uploadedImage);
      fileReader.addEventListener("load", function () {
        console.log("this ", this);

        setData({
          ...data,
          previewImage: this.result,
          thumbnail: uploadedImage,
        });
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setData({
      ...data,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const { title, description, category, createdBy } = data;

    if (!title || !description || !category || !createdBy) {
      toast.error("All fields are mandatory");
      return;
    }

    const res = await dispatch(updateCourse(data));
    console.log("res update : ", res);

    if (res?.payload?.success) {
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
          <h1 className="text-center text-2xl font-bold">Update Course</h1>

          <main className="grid grid-cols-2 gap-x-10">
            <div className="gap-y-6">
              <div>
                <label htmlFor="image_uploads" className="cursor-pointer">
                  {data.previewImage ? (
                    <img
                      src={data.previewImage}
                      alt="previewImage"
                      className="w-full h-44 m-auto border"
                    />
                  ) : (
                    <img
                      src={state.thumbnail.secure_url}
                      alt="default_image"
                      className="w-full h-44 m-auto border"
                    />
                  )}
                  <input
                    type="file"
                    name="image_uploads"
                    id="image_uploads"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="title" className="text-lg font-semibold">
                  Course Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  placeholder="Enter course title"
                  value={data.title}
                  onChange={handleInputChange}
                  className="bg-transparent px-2 py-1 border"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex flex-col gap-1">
                <label htmlFor="createdBy" className="text-lg font-semibold">
                  Course Instructor
                </label>
                <input
                  type="text"
                  name="createdBy"
                  id="createdBy"
                  placeholder="Enter course instructor"
                  value={data.createdBy}
                  onChange={handleInputChange}
                  className="bg-transparent px-2 py-1 border"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="category" className="text-lg font-semibold">
                  Course Category
                </label>
                <input
                  type="text"
                  name="category"
                  id="category"
                  placeholder="Enter course category"
                  value={data.category}
                  onChange={handleInputChange}
                  className="bg-transparent px-2 py-1 border"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="description" className="text-lg font-semibold">
                  Course Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  placeholder="Enter Course Description"
                  value={data.description}
                  onChange={handleInputChange}
                  className="bg-transparent px-2 py-1 h-24 overflow-y-scroll resize-none border"
                ></textarea>
              </div>
            </div>
          </main>

          <button
            type="submit"
            className="w-full bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 py-2 rounded-sm font-semibold text-lg cursor-pointer"
          >
            Update Course
          </button>
        </form>
      </div>
    </HomeLayout>
  );
};

export default UpdateCourse;
