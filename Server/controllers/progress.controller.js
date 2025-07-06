import Course from "../models/course.model.js";
import Progress from "../models/progress.model.js";
import AppError from "../utils/error.util.js";
import { isValidObjectId } from "../utils/validate.util.js";

const markLectureCompleted = async (req, res, next) => {
  try {
    const { courseId, lectureId } = req.body;
    const userId = req.user.id;

    if (!isValidObjectId(courseId) || !isValidObjectId(lectureId)) {
      return next(new AppError("Invalid courseId or lectureId format", 400));
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return next(new AppError("Course not found", 404));
    }

    const lecture = course.lectures.find((curLecture) =>
      curLecture._id.equals(lectureId)
    );

    if (!lecture) {
      return next(new AppError("Lecture not found", 404));
    }

    let progress = await Progress.findOne({ user: userId, course: courseId });

    if (!progress) {
      progress = await Progress.create({
        user: userId,
        course: courseId,
        completedLectures: [
          {
            lectureId,
            title: lecture.title,
          },
        ],
      });
    } else {
      const alreadyCompleted = progress.completedLectures.some((curLecture) => {
        return curLecture.lectureId.toString() === lectureId.toString();
      });

      if (!alreadyCompleted) {
        progress.completedLectures.push({
          lectureId,
          title: lecture.title,
          completedAt: new Date(),
        });
      }
      progress.lastAccessed = new Date();
      await progress.save();
    }

    return res.status(200).json({
      success: true,
      message: "Lecture marked as completed",
      progress,
    });
  } catch (error) {
    console.error("Error completing lecture:", error);
    return next(new AppError(err.message, 500));
  }
};

const getProgress = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    if (!isValidObjectId(courseId)) {
      return next(new AppError("Invalid courseId format", 400));
    }

    const progress = await Progress.findOne({ user: userId, course: courseId });

    if (!progress) {
      return res.status(200).json({
        completedLectures: [],
        percentage: 0,
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return next(new AppError("Course not found", 404));
    }

    const totalLectures = course.lectures.length || 1;
    const totalCompletedLectures = progress.completedLectures.length;
    const percentage = ((totalCompletedLectures / totalLectures) * 100).toFixed(
      1
    );

    res.status(200).json({
      completedLectures: progress.completedLectures,
      percentage,
    });
  } catch (error) {
    return next(new AppError("Error in fetching progress", 500));
  }
};

export { markLectureCompleted, getProgress };
