import React, { useEffect, useState } from "react";
import HomeLayout from "../../Layouts/HomeLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCourseLecture,
  getCourseLectures,
} from "../../Redux/Slices/LectureSlice";
import { getCourseProgress, markLectureAsCompleted } from "../../Redux/Slices/ProgressSlice";

const DisplayLectures = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { lectures } = useSelector((state) => state.lecture);
  const { role } = useSelector((state) => state.auth);
  const { completedLectures } = useSelector((state) => state.progress)
  console.log("Completed Lectures:", completedLectures);
  console.log("All Lectures:", lectures);

  console.log("lectures: ", lectures);

  const [currentVideo, setCurrentVideo] = useState(0);

  const handleDeleteLecture = async (courseId, lectureId) => {
    await dispatch(deleteCourseLecture(courseId, lectureId));
    await dispatch(getCourseLectures(courseId));
  };

  useEffect(() => {
    console.log(state);
    if (!state) navigate("/courses");
    dispatch(getCourseLectures(state._id));
    dispatch(getCourseProgress(state._id))
  }, []);

  useEffect(() => {
    const lectureId = lectures?.[currentVideo]?._id;
    const alreadyCompleted = completedLectures.some((lec) => lec.lectureId == lectureId)
    if (lectureId && !alreadyCompleted) {
      dispatch(markLectureAsCompleted({
        courseId: state._id,
        lectureId
      })).then(() => dispatch(getCourseProgress(state._id)))
    }
  }, [currentVideo])

  return (
    <HomeLayout>
      <div className="flex flex-col gap-10 items-center justify-center min-h-[90vh] py-10 text-white mx-5">
        <div className="text-center text-2xl font-semibold text-yellow-500">
          Course Name : {state?.title}
        </div>

        {lectures && lectures.length > 0 ? (
          <div className="flex justify-center gap-10 w-full">
            {/* left section for playing videos and displaying course details to admin */}
            <div className="space-y-5 w-[28rem] p-2  rounded-lg shadow-[0_0_10px_black]">
              {/* Progress Bar  */}
              <div className="w-full">
                <div className="flex justify-between mb-1 text-sm text-yellow-500 font-semibold">
                  <span>Progress</span>
                  <span>
                    {
                      lectures.length > 0 ? ((completedLectures.length / lectures.length) * 100).toFixed(1) : 0
                    }
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div className="bg-green-500 h-3 rounded-full" style={{ width: `${lectures.length > 0 ? ((completedLectures.length / lectures.length) * 100).toFixed(1) : 0}%` }}>
                  </div>
                </div>
              </div>

              <video
                src={lectures && lectures[currentVideo]?.lecture?.secure_url}
                className="object-fill rounded-tl-lg rounded-tr-lg w-full"
                controls
                disablePictureInPicture
                muted
                controlsList="nodownload"
              ></video>
              <div>
                <h1>
                  <span className="text-yellow-500">Title : </span>
                  {lectures && lectures[currentVideo]?.title}
                </h1>
                <p>
                  <span className="text-yellow-500 line-clamp-4">
                    Description :{" "}
                  </span>
                  {lectures && lectures[currentVideo]?.description}
                </p>
              </div>
            </div>

            {/* right section for displaying list of lectures */}
            <ul className="w-[28rem] p-2 rounded-lg shadow-[0_0_10px_black] space-y-4">
              <li className="font-semibold text-xl text-yellow-500 flex items-center justify-between">
                <p>Lectures list</p>
                {role == "ADMIN" && (
                  <button
                    onClick={() =>
                      navigate("/course/addlecture", { state: { ...state } })
                    }
                    className=" px-2 py-1 rounded-md font-semibold text-sm text-white bg-purple-600"
                  >
                    Add new lecture
                  </button>
                )}
              </li>
              {lectures &&
                lectures.map((curLecture, index) => {
                  return (
                    <li key={curLecture._id} className="space-y-2">
                      <p
                        className={`cursor-pointer ${completedLectures.some((lec) => lec.lectureId === curLecture._id) ? "text-green-400" : "text-white"}`}
                        onClick={() => setCurrentVideo(index)}
                      >
                        <span> Lecture {index + 1} : </span>
                        {curLecture?.title}
                      </p>
                      {role == "ADMIN" && (
                        <button
                          onClick={() =>
                            handleDeleteLecture(state?._id, curLecture?._id)
                          }
                          className="bg-red-500 px-2 py-1 rounded-md font-semibold text-sm"
                        >
                          Delete lecture
                        </button>
                      )}
                    </li>
                  );
                })}
            </ul>
          </div>
        ) : (
          role == "ADMIN" && (
            <button
              onClick={() =>
                navigate("/course/addlecture", { state: { ...state } })
              }
              className=" px-2 py-1 rounded-md font-semibold text-sm text-white bg-purple-600"
            >
              Add New Lecture
            </button>
          )
        )}
      </div>
    </HomeLayout>
  );
};

export default DisplayLectures;
