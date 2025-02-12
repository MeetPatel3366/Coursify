import { model, Schema } from "mongoose";

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      minLength: [8, "Title must be atleast 8 characters"],
      maxLength: [50, "title should be less than 50 characters"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Title is required"],
      minLength: [10, "Title must be atleast 10 characters"],
      maxLength: [200, "title should be less than 200 characters"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    thumbnail: {
      public_id: {
        type: String,
        required: [true, "public_id is required"],
      },
      secure_url: {
        type: String,
        required: [true, "secure_url is required"],
      },
    },
    lectures: [
      {
        title: String,
        description: String,
        lecture: {
          public_id: {
            type: String,
            required: [true, "public_id is required"],
          },
          secure_url: {
            type: String,
            required: [true, "secure_url is required"],
          },
        },
      },
    ],
    numbersOfLectures: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: String,
      required: [true, "createdBy is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Course = model("Course", courseSchema);

export default Course;
