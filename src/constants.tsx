import { Img3, Img4, Img5, Img6, Img7, Img8 } from "./assets";

export enum ACCOUNT_TYPES {
  STUDENT = "student",
  ADMIN = "admin",
  TEACHER = "teacher",
  MENTOR = "mentor",
}

export enum CLASS_TYPES {
  CLASS = "class",
  MINI_CLASS = "mini-class",
}

export enum CONTENT_TYPES {
  CONTENT = "content",
  ARTICLE = "article",
  VIDEO = "video",
}

export enum TASK_TYPES {
  TASK = "task",
  QUIZ = "quiz",
  ASSIGNMENT = "assignment",
  PEER = "peer",
}

export enum OTP_TYPE {
  EMAIL = "email",
  FORGOT_PASSWORD = "forgot_password",
  NONE = "none",
}

export enum FILTER {
  USERS = "users",
}

export const DaysOfTheWeek = [
  { key: "Monday", value: "Monday" },
  { key: "Tuesday", value: "Tuesday" },
  { key: "Wednesday", value: "Wednesday" },
  { key: "Thursday", value: "Thursday" },
  { key: "Friday", value: "Friday" },
  { key: "Saturday", value: "Saturday" },
];

export const IMG_LIST = [Img3, Img4, Img5, Img6, Img7, Img8];

export enum ClassTypeList {
  ALL = "All",
  COMPLETED = "Finished",
  NOT_STARTED = "Not Started",
  IN_PROGRESS = "In Progress",
}

export enum ContentTypeList {
  ALL = "All",
  ARTICLE = "Article",
  VIDEO = "Video",
}

export enum MINI_CLASS {
  TASK_REVIEW = "Task Review",
  LIVE_PRACTICE = "Live Practice",
  COMMUNITY_DISCUSSION = "Community Discussion",
  PROJECT_SHOWCASE = "Project Showcase",
  PEER_LEARNING = "Peer Learning",
  Q_AND_A = "Q&A Session",
  GUEST_TALK = "Guest Talk",
  TEAM_CHALLENGE = "Team Challenge",
}

export const MINI_CLASS_LIST = [
  { value: MINI_CLASS.TASK_REVIEW, key: MINI_CLASS.TASK_REVIEW },
  { value: MINI_CLASS.LIVE_PRACTICE, key: MINI_CLASS.LIVE_PRACTICE },
  {
    value: MINI_CLASS.COMMUNITY_DISCUSSION,
    key: MINI_CLASS.COMMUNITY_DISCUSSION,
  },
  { value: MINI_CLASS.PROJECT_SHOWCASE, key: MINI_CLASS.PROJECT_SHOWCASE },
  { value: MINI_CLASS.PEER_LEARNING, key: MINI_CLASS.PEER_LEARNING },
  { value: MINI_CLASS.Q_AND_A, key: MINI_CLASS.Q_AND_A },
  { value: MINI_CLASS.GUEST_TALK, key: MINI_CLASS.GUEST_TALK },
  { value: MINI_CLASS.TEAM_CHALLENGE, key: MINI_CLASS.TEAM_CHALLENGE },
];

export enum COURSE_CATEGORY {
  FRONT_END_DEV = "front_end_dev",
  BACK_END_DEV = "back_end_dev",
  UI = "ui",
  DATA_ANALYTICS = "data_analytics",
  CYBER_SECURITY = "cyber_security",
}

export enum TASK_SUBMISSION_TYPE {
  PDF = "pdf",
  CSV = "csv",
  ZIP = "zip",
}

export enum TASK_TYPE {
  ASSIGNMENT = "Assignment",
  QUIZ = "Quiz",
  PEER = "Peer",
}

export enum CONTENT_TYPE {
  ARTICLE = "Article",
  VIDEO = "Video",
}
