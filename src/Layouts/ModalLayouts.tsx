import FilterModal from "../components/Modal/FilterModal";
import { ModalProvider } from "../components/Modal/ModalProvider";
import ViewClassModal from "../pages/app/admin/Class/Modals/ViewClassModal";
import AssignTeacherToCohortModal from "../pages/app/admin/Cohort/Modals/AssignTeacherToCohortModal";
import CreateCohortModal from "../pages/app/admin/Cohort/Modals/CreateCohortModal";
import CreateScheduleModal from "../pages/app/admin/Cohort/Modals/CreateSheduleModal";
import DeleteCohortModal from "../pages/app/admin/Cohort/Modals/DeleteCohortModal";
import EditCohortModal from "../pages/app/admin/Cohort/Modals/EditCohortModal";
import StartCohortModal from "../pages/app/admin/Cohort/Modals/StartCohortModa";
import ViewCohortDetailsModal from "../pages/app/admin/Cohort/Modals/ViewCohortDetailsModal";
import CreateContentModal from "../pages/app/admin/Content/Modals/CreateContentModal";
import DeleteContentModal from "../pages/app/admin/Content/Modals/DeleteContentModal";
import EditContentModal from "../pages/app/teacher/Content/Modals/EditContentModal";
import ViewContentDetailsModal from "../pages/app/admin/Content/Modals/ViewContentDetailsModal";
import CreateCourseModal from "../pages/app/admin/Courses/Modals/CreateCourseModal";
import DeleteCourseDetailsModal from "../pages/app/admin/Courses/Modals/DeleteCourseModal";
import EditCourseModal from "../pages/app/admin/Courses/Modals/EditCourseModal";
import ViewCourseDetailsModal from "../pages/app/admin/Courses/Modals/ViewDetails";
import CreateAdminModal from "../pages/app/admin/Users/Modals/CreateAdmin";
import CreateTeacherModal from "../pages/app/admin/Users/Modals/CreateTeacher";
import DisableUserModal from "../pages/app/admin/Users/Modals/DisableUserModal";
import UserDetailsModal from "../pages/app/admin/Users/Modals/UserDetailsModal";
import EditTaskModal from "../pages/app/teacher/Tasks/Modals/EditTaskModal";
import ViewTaskDetailsModal from "../pages/app/teacher/Tasks/Modals/ViewTaskDetailsModal";
import EditClassModal from "../pages/app/teacher/Class/Modals/EditClassModal";
import ClassNotAvailableModal from "../pages/app/student/Class/Modals/ClassNotAvailableModal";
import ViewMyTaskModal from "../pages/app/student/Tasks/Modals/ViewMyTaskModal";
import CreateMiniClassModal from "../pages/app/admin/Cohort/Modals/CreateMiniClassModal";
import ViewMiniClassModal from "../pages/app/admin/Class/Modals/ViewMiniClassModal";
import EditMiniClassModal from "../pages/app/teacher/Class/Modals/EditMiniClassModal";
import ViewSubmissionModal from "../pages/app/teacher/Tasks/Modals/ViewSubmissionModal";
import PointEarnedModal from "../components/PointEarnedModal";
import CreateNewArticleModal from "../pages/app/teacher/Content/Modals/CreateNewArticleModal";
import CreateNewVideoModal from "../pages/app/teacher/Content/Modals/CreateNewVideoModal";
import EditVideoModal from "../pages/app/teacher/Content/Modals/EditVideoModal";
import EditArticleModal from "../pages/app/teacher/Content/Modals/EditArticleModal";
import ViewVideoDetailsModal from "../pages/app/teacher/Content/Modals/ViewVideoDetailsModal";
import ViewArticleDetailsModal from "../pages/app/teacher/Content/Modals/ViewArticleDetailsModal";
import DeleteVideoModal from "../pages/app/teacher/Content/Modals/DeleteVideoModal";
import DeleteArticleModal from "../pages/app/teacher/Content/Modals/DeleteArticleModal";
import CreateQuizModal from "../pages/app/teacher/Tasks/Modals/CreateQuizModal";
import CreateNewAssignmentModal from "../pages/app/teacher/Tasks/Modals/CreateAssignmentModal";
import EditAssignmentModal from "../pages/app/teacher/Tasks/Modals/EditAssignmentModal";
import DeleteAssignmentModal from "../pages/app/teacher/Tasks/Modals/DeleteAssignmentModal";
import ViewAssignmentDetailsModal from "../pages/app/teacher/Tasks/Modals/ViewAssignmentDetailsModal";
import EditQuizModal from "../pages/app/teacher/Tasks/Modals/EditQuizModal";
import QuizDetailsModal from "../pages/app/teacher/Tasks/Modals/QuizDetailsModal";
import DeleteQuizModal from "../pages/app/teacher/Tasks/Modals/DeleteQuizModal";
import CreateMentorModal from "../pages/app/admin/Users/Modals/CreateMentorModal";
import NotificationModal from "../pages/app/student/Modals/NotificationModal";
import ViewContentModal from "../pages/app/student/Content/Modals/ViewContentModal";
import QuizModal from "../pages/app/student/Tasks/Modals/QuizModal";
import CreateNewPeerModal from "../pages/app/teacher/Tasks/Modals/CreateNewPeerModal";
import EditPeerModal from "../pages/app/teacher/Tasks/Modals/EditPeerModal";
import DeletePeerModal from "../pages/app/teacher/Tasks/Modals/DeletePeerModal";
import AssignmentModal from "../pages/app/student/Tasks/Modals/AssignmentModal";
import ViewPeerModal from "../pages/app/teacher/Tasks/Modals/ViewPeerModal";

export enum MODAL_ID {
  FILTER = "filter",
  USER_DETAILS = "user_details",
  CREATE_ADMIN = "create_admin",
  CREATE_TEACHER = "create_teacher",
  COURSE_DETAILS_MODAL = "course_details_modal",
  CREATE_COURSE = "create_course",
  EDIT_COURSE = "edit_course",
  DELETE_COURSE = "delete_course",
  DISABLE_USER = "disable_user",
  CREATE_CONTENT = "create_content",
  EDIT_CONTENT = "edit_content",
  DELETE_CONTENT = "delete_content",
  CONTENT_DETAILS = "content_details",
  TASK_DETAILS = "task_details",
  ASSIGNMENT_DETAILS = "assignment_details",
  ASSIGN_TEACHER = "assign_teacher",
  CREATE_SCHEDULE = "create_schedule",
  DELETE_COHORT = "delete_cohort",
  START_COHORT = "start_cohort",
  COHORT_DETAILS = "cohort_details",
  CREATE_COHORT = "create_cohort",
  EDIT_COHORT = "edit_cohort",
  VIEW_CLASS = "view_class",
  EDIT_TASK = "edit_task",
  EDIT_ASSIGNMENT = "edit_assignment",
  EDIT_CLASS = "edit_class",
  CLASS_NOT_AVAILABLE = "class_not_available",
  VIEW_MY_TASK = "view_my_task",
  CREATE_MINI_CLASS = "create_mini_class",
  VIEW_MINI_CLASS = "view_mini_class",
  EDIT_MINI_CLASS = "edit_mini_class",
  VIEW_TASK_SUBMISSION = "view_task_submission",
  POINT_MODAL = "point_modal",
  CREATE_VIDEO = "create_video",
  CREATE_ARTICLE = "create_article",
  EDIT_VIDEO = "edit_video",
  EDIT_ARTICLE = "edit_article",
  VIEW_VIDEO_DETAILS = "view_video_details",
  VIEW_ARTICLE_DETAILS = "view_article_details",
  DELETE_VIDEO = "delete_video",
  DELETE_ARTICLE = "delete_article",
  CREATE_QUIZ = "create_quiz",
  CREATE_ASSIGNMENT = "create_assignment",
  DELETE_ASSIGNMENT = "delete_assignment",
  VIEW_ASSIGNMENT = "view_assignment",
  EDIT_QUIZ = "edit_quiz",
  VIEW_QUIZ = "view_QUIZ",
  DELETE_QUIZ = "delete_quiz",
  CREATE_MENTOR = "create_mentor",
  VIEW_TASK_MODAl = "view_task_modal",
  NOTIFICATION = "notification",
  VIEW_CONTENT_MODAL = "view_content_modal",
  QUIZ_MODAL = "quiz_modal",
  CREATE_PEER = "create_peer",
  EDIT_PEER = "edit_peer",
  DELETE_PEER = "delete_peer",
  VIEW_PEER = "view_peer",
  ASSIGNMENT_MODAL = "assignment_modal",
}

interface ModalLayoutProps {
  children: React.ReactNode;
}

const ModalLayout: React.FC<ModalLayoutProps> = ({ children }) => {
  return (
    <ModalProvider>
      <FilterModal modalId={MODAL_ID.FILTER} />
      <UserDetailsModal modalId={MODAL_ID.USER_DETAILS} />
      <DisableUserModal modalId={MODAL_ID.DISABLE_USER} />
      <CreateAdminModal modalId={MODAL_ID.CREATE_ADMIN} />
      <CreateTeacherModal modalId={MODAL_ID.CREATE_TEACHER} />
      <ViewCourseDetailsModal modalId={MODAL_ID.COURSE_DETAILS_MODAL} />
      <CreateCourseModal modalId={MODAL_ID.CREATE_COURSE} />
      <EditCourseModal modalId={MODAL_ID.EDIT_COURSE} />
      <DeleteCourseDetailsModal modalId={MODAL_ID.DELETE_COURSE} />
      <CreateContentModal modalId={MODAL_ID.CREATE_CONTENT} />
      <EditContentModal modalId={MODAL_ID.EDIT_CONTENT} />
      <DeleteContentModal modalId={MODAL_ID.DELETE_CONTENT} />
      <ViewContentDetailsModal modalId={MODAL_ID.CONTENT_DETAILS} />
      <ViewTaskDetailsModal modalId={MODAL_ID.TASK_DETAILS} />
      <AssignTeacherToCohortModal modalId={MODAL_ID.ASSIGN_TEACHER} />
      <CreateScheduleModal modalId={MODAL_ID.CREATE_SCHEDULE} />
      <DeleteCohortModal modalId={MODAL_ID.DELETE_COHORT} />
      <StartCohortModal modalId={MODAL_ID.START_COHORT} />
      <ViewCohortDetailsModal modalId={MODAL_ID.COHORT_DETAILS} />
      <CreateCohortModal modalId={MODAL_ID.CREATE_COHORT} />
      <EditCohortModal modalId={MODAL_ID.EDIT_COHORT} />
      <ViewClassModal modalId={MODAL_ID.VIEW_CLASS} />
      <EditTaskModal modalId={MODAL_ID.EDIT_TASK} />
      <EditClassModal modalId={MODAL_ID.EDIT_CLASS} />
      <ClassNotAvailableModal modalId={MODAL_ID.CLASS_NOT_AVAILABLE} />
      <ViewMyTaskModal modalId={MODAL_ID.VIEW_MY_TASK} />
      <CreateMiniClassModal modalId={MODAL_ID.CREATE_MINI_CLASS} />
      <ViewMiniClassModal modalId={MODAL_ID.VIEW_MINI_CLASS} />
      <EditMiniClassModal modalId={MODAL_ID.EDIT_MINI_CLASS} />
      <ViewSubmissionModal modalId={MODAL_ID.VIEW_TASK_SUBMISSION} />
      <PointEarnedModal modalId={MODAL_ID.POINT_MODAL} />
      <CreateNewArticleModal modalId={MODAL_ID.CREATE_ARTICLE} />
      <CreateNewVideoModal modalId={MODAL_ID.CREATE_VIDEO} />
      <EditVideoModal modalId={MODAL_ID.EDIT_VIDEO} />
      <EditArticleModal modalId={MODAL_ID.EDIT_ARTICLE} />
      <ViewVideoDetailsModal modalId={MODAL_ID.VIEW_VIDEO_DETAILS} />
      <ViewArticleDetailsModal modalId={MODAL_ID.VIEW_ARTICLE_DETAILS} />
      <DeleteVideoModal modalId={MODAL_ID.DELETE_VIDEO} />
      <DeleteArticleModal modalId={MODAL_ID.DELETE_ARTICLE} />
      <CreateQuizModal modalId={MODAL_ID.CREATE_QUIZ} />
      <CreateNewAssignmentModal modalId={MODAL_ID.CREATE_ASSIGNMENT} />
      <EditAssignmentModal modalId={MODAL_ID.EDIT_ASSIGNMENT} />
      <DeleteAssignmentModal modalId={MODAL_ID.DELETE_ASSIGNMENT} />
      <ViewAssignmentDetailsModal modalId={MODAL_ID.VIEW_ASSIGNMENT} />
      <EditQuizModal modalId={MODAL_ID.EDIT_QUIZ} />
      <QuizDetailsModal modalId={MODAL_ID.VIEW_QUIZ} />
      <DeleteQuizModal modalId={MODAL_ID.DELETE_QUIZ} />
      <CreateMentorModal modalId={MODAL_ID.CREATE_MENTOR} />
      <NotificationModal modalId={MODAL_ID.NOTIFICATION} />
      <ViewContentModal modalId={MODAL_ID.VIEW_CONTENT_MODAL} />
      <QuizModal modalId={MODAL_ID.QUIZ_MODAL} />
      <CreateNewPeerModal modalId={MODAL_ID.CREATE_PEER} />
      <EditPeerModal modalId={MODAL_ID.EDIT_PEER} />
      <DeletePeerModal modalId={MODAL_ID.DELETE_PEER} />
      <ViewPeerModal modalId={MODAL_ID.VIEW_PEER} />
      <AssignmentModal modalId={MODAL_ID.ASSIGNMENT_MODAL} />
      {children}
    </ModalProvider>
  );
};

export default ModalLayout;
