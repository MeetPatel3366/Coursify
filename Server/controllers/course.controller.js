import Course from "../models/course.model.js";
import AppError from "../utils/error.util.js";
import handleFileUpload from "../utils/file.util.js";
import cloudinary from "cloudinary";

const getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({}).select("-lectures");

    res.status(200).json({
      success: true,
      message: "All Courses",
      courses,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

const getLecturesByCourseId = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return next(new AppError("Invalid course id", 400));
    }

    res.status(200).json({
      success: true,
      message: "Course lectures fetched successfully",
      lectures: course.lectures,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

const createCourse = async (req, res, next) => {
  try {
    const { title, description, category, createdBy } = req.body;

    if (!title || !description || !category || !createdBy) {
      return next(new AppError("All fields are required", 400));
    }

    const course = await Course.create({
      title,
      description,
      category,
      createdBy,
      thumbnail: {
        public_id: title,
        secure_url:
          "https://res.cloudinary.com/dyk3roggj/image/upload/v1739538302/lms/j4vc6n2nvm9hprijpnns.png",
      },
    });

    if (!course) {
      return next(
        new AppError("Course could not create,please try again ", 500)
      );
    }

    if (req.file) {
      await handleFileUpload(req, course, "thumbnail");
    }

    await course.save();

    res.status(200).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Course.findByIdAndUpdate(
      id,
      { $set: req.body },
      { runValidators: true, new: true }
    );

    if (!course) {
      return next(new AppError("Course with given id does not exist", 500));
    }

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

const removeCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Course.findByIdAndDelete(id);

    if (!course) {
      return next(new AppError("Course with given id does not exist", 404));
    }

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
      course,
    });
  } catch (err) {
    return next(new AppError(err.message), 500);
  }
};

const addLectureToCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!title || !description) {
      return next(new AppError("All fields are required", 400));
    }

    const course = await Course.findById(id);

    if (!course) {
      return next(new AppError("Course with given id does not exist", 404));
    }

    const lectureData = { title, description, lecture: "" };

    if (req.file) {
      await handleFileUpload(req, lectureData, "lecture", "video");
    }

    course.lectures.push(lectureData);
    course.numbersOfLectures = course.lectures.length;

    await course.save();

    res.status(200).json({
      success: true,
      message: "Lecture successfully added",
      course,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

const removeLecture = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;

    if (!courseId) {
      return next(new AppError("Course ID is required", 400));
    }
    if (!lectureId) {
      return next(new AppError("Lecture ID is required", 400));
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return next(new AppError("Invalid ID or Course does not exist.", 400));
    }

    const lectureIndex = course?.lectures?.findIndex(
      (lecture) => lecture._id.toString() == lectureId.toString()
    );

    if (lectureIndex == -1) {
      return next(new AppError("lecture does not exists"));
    }

    await cloudinary.v2.uploader.destroy(
      course.lectures[lectureIndex].lecture.public_id,
      {
        resource_type: "video",
      }
    );

    course.lectures.splice(lectureIndex, 1);

    await course.save();

    res.status(200).json({
      success: true,
      message: "Remove course successfully",
      course,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

export {
  getAllCourses,
  getLecturesByCourseId,
  createCourse,
  updateCourse,
  removeCourse,
  addLectureToCourse,
  removeLecture,
};
