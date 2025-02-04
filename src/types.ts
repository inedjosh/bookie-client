import {
  ClassTypeList,
  ContentTypeList,
  MINI_CLASS,
  TASK_SUBMISSION_TYPE,
  TASK_TYPE,
} from "./constants";

export type UserType = {
  _id: string;
  role: string;
  email: string;
  firstName: string;
  lastName: string;
  profileUrl: string;
  country: string;
  phoneNumber: string;
  lastLoginDate: string;
  accountActive: boolean;
  createdAt: string;
  totalScore: number;
  unreadNotifications: number;
};

export type NotificationType = {
  title: string;
  description: string;
  user: string;
  _id: string;
  read: boolean;
  createdAt: string;
};

export type AxiosSingleUserType = {
  user: UserType;
  cohort: CohortType;
};

export type AxiosUserType = {
  data: UserType[];
  page: number;
  totalPages?: number;
  currentPage?: number;
  totalItems?: number;
};

export type TokenType = {
  refreshToken: string;
  accessToken: string;
};

export type CreateAdminType = {
  email: string;
  firstName: string;
  lastName: string;
  country: string;
  phoneNumber: string;
};

export type CourseType = {
  _id: string;
  title: string;
  description: string;
  durationInMonths: number;
  category: string;
  price: number;
  curriculum: string[];
  averageRating: number;
  reviews: string[];
  thumbnail: string;
  language: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  courseCode: string;
};

export type TeacherDetailsType = {
  _id: string;
  firstName: string;
  lastName: string;
};

export type StudentDetailsType = {
  _id: string;
  firstName: string;
  lastName: string;
};

export type AxiosCourseType = {
  data: CourseType[];
  page: number;
  totalPages?: number;
  currentPage?: number;
  totalItems?: number;
};

export type CohortType = {
  _id: string;
  cohortName: string;
  cohortCode: string;
  lectures: { day: string; time: string }[];
  startDate: Date | string;
  endDate: Date | string;
  description: string;
  course: CourseType;
  students: StudentDetailsType[];
  teachers: TeacherDetailsType[];
  status: string;
  language?: string;
  hasSchedule?: boolean;
  completionRate?: number;
};

export type AxiosCohortType = {
  data: CohortType[];
  page: number;
  totalPages?: number;
  currentPage?: number;
  totalItems?: number;
};

export type ContentType = {
  _id: string;
  title: string;
  content: VideoType | ArticleType;
  contentType: ContentTypeList;
  createdAt: string;
  cohort: { cohortName: string };
  weekNumber: number;
  dayNumber: number;
  participation: AttendanceType[];
  isUpdated: boolean;
  scheduleDate: string;
};

export type AxiosContentType = {
  data: ContentType[];
  page: number;
  totalPages?: number;
  currentPage?: number;
  totalItems?: number;
};

export type TaskCompletion = {
  studentId: string;
  submissionDate: Date;
  remark: string;
  submission: string;
  firstName: string;
  lastName: string;
  point: number;
  evaluated: boolean;
};

// export type SubmissionType = {
//   studentId: string;
//   submissionDate: Date;
//   remark: string;
//   submission: string;
//   firstName: string;
//   lastName: string;
// };

export type TaskType = {
  _id: string;
  cohort: { cohortName: string; totalStudentEnrollment: number };
  title: string;
  weekNumber: number;
  dueDate: string;
  taskCompletion: TaskCompletion[];
  dayNumber: number;
  isUpdated: boolean;
  submissionType: TASK_SUBMISSION_TYPE;
  task: QuizType | AssignmentType | PeerType;
  taskType: TASK_TYPE;
};

export type SubmissionType = {
  _id: string;
  student: string;
  task: string;
  fileName: string;
  url: string;
  weekNumber: number;
  dayNumber: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  taskCompletion: SingleTaskCompletion;
};

export type SubmissionListType = {
  student: { firstName: string; lastName: string; _id: string };
  _id: string;
  task: string;
  fileName: string;
  url: string;
  weekNumber: number;
  dayNumber: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  taskCompletion: SingleTaskCompletion;
};

export type AxiosSubmissionAndTask = {
  task: TaskType;
  totalSubmissions: SubmissionListType[];
};

type SingleTaskCompletion = {
  studentId: string;
  submissionDate: string;
  remark: string;
  submission: string;
  _id: string;
  point: number;
  evaluated: boolean;
};

export type AxiosTaskType = {
  data: TaskType[];
  page: number;
  totalPages?: number;
  currentPage?: number;
  totalItems?: number;
};

export type AxiosAnalyticsType = {
  totalEnrolledStudents: number;
  totalSubmittedTask: number;
  totalCompletedTask: number;
};

export type AssignmentCompletion = {
  studentId: string;
  submissionDate: Date;
  remark: string;
  submission: string;
};

export type Lecture = {
  lectureDate: Date;
};

export type AttendanceType = {
  studentId: string;
  status: string;
  _id: string;
  id: string;
  point: number;
};

export type ClassType = {
  _id: string;
  cohort: {
    _id: string;
    cohortName: string;
    totalStudentEnrollment: string;
  };
  weekNumber: number;
  lectureStartDate: string;
  lectureEndDate: string;
  topic: string;
  content: {
    _id: string;
    title: string;
    weekNumber: number;
  };
  classUrl: string;
  recordedUrl: string;
  joinUrl: string;
  startUrl: string;
  classType: "zoom" | "meet" | "youtube";
  task: {
    _id: string;
    title: string;
    weekNumber: number;
  };
  status: ClassTypeList;
  attendance: AttendanceType[];
  lectureNumber: number;
  isScheduled: boolean;
};

export type AxiosClassType = {
  data: ClassType[];
  page: number;
  totalPages?: number;
  currentPage?: number;
  totalItems?: number;
};

export interface Attendance {
  studentId: string;
  status: "present" | "absent";
  point: number;
}

export type MiniClassType = {
  _id: string;
  cohort: { _id: string; cohortName: string; totalStudentEnrollment: number };
  students: StudentDetailsType[];
  instructors: TeacherDetailsType[];
  lead: StudentDetailsType;
  weekNumber: number;
  date: string;
  topic: string;
  isScheduled: boolean;
  classUrl?: string;
  startTime: string;
  endTime: string;
  attendance: AttendanceType[];
  status: ClassTypeList;
  recordedUrl: string;
  activity: MINI_CLASS;
};

export type AxiosMiniClassType = {
  data: MiniClassType[];
  page: number;
  totalPages?: number;
  currentPage?: number;
  totalItems?: number;
};

export type AxiosWeekAndDayType = {
  currentDay: string;
  week: number;
  day: number;
};

export type CategoryPointsType = {
  totalPoints: number;
  totalCount: number;
};

export type GoalOverviewType = {
  weeklyPoints: {
    class: { totalPoints: number };
    content: { totalPoints: number };
    task: { totalPoints: number };
    miniClass: { totalPoints: number };
  };
  monthlyPoints: {
    class: { totalPoints: number };
    content: { totalPoints: number };
    task: { totalPoints: number };
    miniClass: { totalPoints: number };
  };
  coursePoints: {
    class: { totalPoints: number };
    content: { totalPoints: number };
    task: { totalPoints: number };
    miniClass: { totalPoints: number };
  };
  taskTotalCount: {
    weekly: number;
    monthly: number;
    overall: number;
  };
  contentTotalCount: {
    weekly: number;
    monthly: number;
    overall: number;
  };
  classTotalCount: {
    weekly: number;
    monthly: number;
    overall: number;
  };
  miniClassTotalCount: {
    weekly: number;
    monthly: number;
    overall: number;
  };
  total: {
    class: {
      course: number;
      week: number;
      month: number;
    };
    miniClass: {
      course: number;
      week: number;
      month: number;
    };
    task: {
      course: number;
      week: number;
      month: number;
    };
    content: {
      course: number;
      week: number;
      month: number;
    };
  };
};

export type VideoType = {
  _id: string;
  url: string;
  topic: string;
  description: string;
  createdAt: string;
  course: {
    _id: string;
    name: string;
  };
};

export type AxiosVideoType = {
  data: VideoType[];
  page: number;
  totalPages?: number;
  currentPage?: number;
  totalItems?: number;
};

export type ArticleType = {
  _id: string;
  topic: string;
  createdAt: string;
  description: string;
  article: string;
  course: {
    _id: string;
    name: string;
  };
};

export type AxiosArticleType = {
  data: ArticleType[];
  page: number;
  totalPages?: number;
  currentPage?: number;
  totalItems?: number;
};

export type Quiz = {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  createdAt: string;
};

export type QuizType = {
  _id: string;
  topic: string;
  description: string;
  course: {
    _id: string;
    name: string;
  };
  quiz: Quiz[];
  createdAt: string;
};

export type AxiosQuizType = {
  data: QuizType[];
  page: number;
  totalPages?: number;
  currentPage?: number;
  totalItems?: number;
};

export type AssignmentType = {
  _id: string;
  topic: string;
  description: string;
  course: {
    _id: string;
    name: string;
  };
  createdAt: string;
  submissionType: string;
};

export type AxiosAssignmentType = {
  data: AssignmentType[];
  page: number;
  totalPages?: number;
  currentPage?: number;
  totalItems?: number;
};

export type GradingCriteria = {
  _id?: string;
  criteria: string;
  maxPoint: number;
  description: string;
  gradingFields: { _id?: string; fieldName: string; grade: number }[];
};

export type PeerType = {
  _id: string;
  course: string; // Link to the cohort (Course ID)
  peer: {
    firstName: string;
    lastName: string;
    _id: string;
  };
  topic: string; // Topic of the peer assignment
  imageUrl: string; // Optional image URL for the assignment
  description: string; // Optional description of the assignment
  instructions: string; // Optional instructions for the assignment
  gradingCriteria: GradingCriteria[]; // Array of grading criteria (optional)
  createdAt: Date; // Timestamp when the peer was created (from Mongoose timestamps)
};

export type AxiosPeerType = {
  data: PeerType[];
  page: number;
  totalPages?: number;
  currentPage?: number;
  totalItems?: number;
};
