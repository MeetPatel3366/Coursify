import React, { useEffect, useState } from "react";
import HomeLayout from "../../Layouts/HomeLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { addCourseLectures } from "../../Redux/Slices/LectureSlice";
import { AiOutlineArrowLeft } from "react-icons/ai";

const AddLecture = () => {
  const courseDetails = useLocation().state;
  console.log("courseDetails : ", courseDetails);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userInput, setUserInput] = useState({
    id: courseDetails._id,
    lecture: undefined,
    title: "",
    description: "",
    videoSrc: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setUserInput({
      ...userInput,
      [name]: value,
    });
  };

  const handleVideo = (e) => {
    const video = e.target.files[0];
    const source = window.URL.createObjectURL(video);

    setUserInput({
      ...userInput,
      lecture: video,
      videoSrc: source,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.lecture || !userInput.title || !userInput.description) {
      toast.error("All fields are mandatory");
      return;
    }
    const response = await dispatch(addCourseLectures(userInput));

    if (response?.payload?.success) {
      navigate(-1);
      setUserInput({
        id: courseDetails._id,
        lecture: undefined,
        title: "",
        description: "",
        videoSrc: "",
      });
    }
  };

  useEffect(() => {
    if (!courseDetails) navigate("/courses");
  }, []);
  return (
    <HomeLayout>
      <div className="min-h-[90vh] text-white flex flex-col items-center justify-center gap-10 mx-16">
        <div className="flex flex-col gap-5 p-2 shadow-[0_0_10px_black] w-96 rounded-lg">
          <header className="flex items-center justify-center relative">
            <button
              className="absolute left-2 text-xl text-green-500"
              onClick={() => navigate(-1)}
            >
              <AiOutlineArrowLeft />
            </button>
            <h1 className="text-xl text-yellow-500 font-semibold">
              Add New Lecture
            </h1>
          </header>

          <form onSubmit={handleFormSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              name="title"
              placeholder="enter the title of the lecture"
              value={userInput.title}
              onChange={handleInputChange}
              className="bg-transparent px-3 py-1 border"
            />

            <textarea
              name="description"
              placeholder="enter the description of the lecture"
              value={userInput.description}
              onChange={handleInputChange}
              className="bg-transparent px-3 py-1 border resize-none overflow-y-scroll h-36"
            ></textarea>

            {userInput?.videoSrc ? (
              <video
                muted
                src={userInput.videoSrc}
                controls
                controlsList="nodownload nofullscreen"
                disablePictureInPicture
                className="objcet-fit rounded-tl-lg rounded-tr-lg w-full"
              />
            ) : (
              <div className="h-48 border flex items-center justify-center cursor-pointer">
                <label
                  htmlFor="lecture"
                  className="font-semibold text-xl cursor-pointer"
                >
                  Choose your video
                </label>
                <input
                  type="file"
                  className="hidden"
                  id="lecture"
                  name="lecture"
                  onChange={handleVideo}
                  accept="video/mp4 video/xmp4 video/*"
                />
              </div>
            )}
            <button
              type="submit"
              className="bg-purple-500 py-1 font-semibold text-lg"
            >
              Add New Lecture
            </button>
          </form>
        </div>
      </div>
    </HomeLayout>
  );
};

export default AddLecture;
