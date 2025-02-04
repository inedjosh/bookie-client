import * as yup from "yup";

export const createAdminSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address"),
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  country: yup.string().required("Country is required"),
  phoneNumber: yup.string().required("Phone Number is required"),
});

export const createCourseSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  courseCode: yup.string().required("Course code is required"),
  description: yup.string().required("Description is required"),
  durationInMonths: yup.number().required("Duration in months is required"),
  category: yup.string().required("Category is required"),
  price: yup.number().required("Price is required"),
  thumbnail: yup.string().required("Thumbnail is required"),
});

export const createContentSchema = yup.object().shape({
  content: yup.string().required("Content is required"),
  contentType: yup.string().required("Content Type is required"),
});

export const createArticleSchema = yup.object().shape({
  topic: yup.string().required("Topic is required"),
  description: yup.string().required("Article is required"),
});

export const updateArticleSchema = yup.object().shape({
  topic: yup.string().required("Topic is required"),
  description: yup.string().required("Article is required"),
});

export const createAssignmentSchema = yup.object().shape({
  topic: yup.string().required("Topic is required"),
  description: yup.string().required("Description is required"),
  submissionType: yup.string().required("Submission type is required"),
});

export const createVideoSchema = yup.object().shape({
  topic: yup.string().required("Topic is required"),
  description: yup.string().required("Description is required"),
  url: yup.string().required("Video URL in months is required"),
});

export const updateVideoSchema = yup.object().shape({
  topic: yup.string().required("Topic is required"),
  description: yup.string().required("Description is required"),
  url: yup.string().required("Video URL in months is required"),
});

export const assignTeacherSchema = yup.object().shape({
  teacher: yup.string().required("Teacher is required"),
});

export const createCohortSchema = yup.object().shape({
  cohortName: yup.string().required("Cohort name is required"),
  startDate: yup
    .date()
    .required("Start date is required")
    .typeError("Start date must be a valid date"),
  description: yup.string().required("Description is required"),
  course: yup.string().required("Course is required"),
});

export const updateTaskSchema = yup.object().shape({
  taskType: yup.string().required("Task Type is required"),
  task: yup.string().required("Task is required"),
  submissionType: yup.string().required("Submission type is required"),
});

export const scheduleValidationSchema = yup.object({
  classType: yup
    .string()
    .oneOf(
      ["zoom", "meet", "youtube"],
      "Class type must be one of: zoom, meet, youtube"
    )
    .nullable(),

  topic: yup.string().nullable(),
});

const submitTaskSchema = yup.object().shape({
  urls: yup.string().optional().url("Invalid URL format"),

  answer: yup.string().required("Answer is required"),

  weekNumber: yup
    .number()
    .required("Week number is required")
    .integer("Week number must be an integer")
    .positive("Week number must be a positive value"),
});

export const createQuizSchema = yup.object({
  topic: yup.string().required("Topic is required"),
  description: yup.string().required("Description is required"),
  quiz: yup
    .array()
    .of(
      yup.object({
        question: yup.string().required("Question is required"),
        options: yup
          .array()
          .of(yup.string().required("Option is required"))
          .min(4, "There must be at least 4 options")
          .max(4, "There must be exactly 4 options"),
        correctAnswer: yup
          .string()
          .required("Correct answer is required")
          .test(
            "correctAnswer-match",
            "Correct answer must match one of the options",
            function (value) {
              const { options } = this.parent; // Access the options array
              return options.includes(value); // Ensure correctAnswer matches one of the options
            }
          ),
      })
    )
    .required("Quiz questions are required"),
});

export default submitTaskSchema;
