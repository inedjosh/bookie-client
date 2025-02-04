import Modal from "../../../../../components/Modal/Modal";
import {
  TaskType,
  AssignmentType,
  QuizType,
  PeerType,
} from "../../../../../types";
import { Typography } from "../../../../../components/Typography";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { useEffect, useState } from "react";
import { fetchData } from "../../../../../Utils/fetch";
import ContentDetailsSkeleton from "../Components/TaskDetailsSkeleton";
import { readableDate } from "../../../../../Utils/Helpers";
import ModalHeader from "../../../../../components/Modal/ModalHeader";

interface ModalComponentProps {
  modalId: string;
}

function ViewTaskDetailsModal({ modalId }: ModalComponentProps) {
  const { modalStates } = useModal();
  const taskId = modalStates[modalId]?.props?.taskId;
  const [task, setTask] = useState<TaskType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getTaskDetails = async () => {
      try {
        setLoading(true);
        const response = await fetchData<TaskType>(`/task/${taskId}`);
        setTask(response.data);
      } finally {
        setLoading(false);
      }
    };

    if (modalStates[modalId]?.isOpen) getTaskDetails();
  }, [taskId, modalStates[modalId]?.isOpen]);

  const renderTaskDetails = () => {
    if (!task) return null;

    if (task.taskType === "Quiz") {
      const quiz = task.task as QuizType;
      return (
        <>
          <Typography variant="subheading">Quiz Details</Typography>
          <Typography as="p">
            <strong>Topic:</strong> {quiz.topic}
          </Typography>
          <Typography as="p">
            <strong>Description:</strong>
            <p dangerouslySetInnerHTML={{ __html: quiz.description }} />
          </Typography>
          <Typography as="p">
            <strong>Course:</strong> {quiz.course.name}
          </Typography>
          {quiz.quiz.map((question, index) => (
            <div key={index} className="my-2">
              <Typography>
                <strong>Q{index + 1}:</strong> {question.question}
              </Typography>
              <ul>
                {question.options.map((option, idx) => (
                  <li
                    className={`${
                      option === question.correctAnswer
                        ? "text-accent"
                        : "text-muted-alt"
                    }`}
                    key={idx}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </>
      );
    } else if (task.taskType === "Assignment") {
      const assignment = task.task as AssignmentType;
      return (
        <>
          <Typography variant="subheading">Assignment Details</Typography>
          <Typography as="p">
            <strong>Topic:</strong> {assignment.topic}
          </Typography>
          <Typography as="p">
            <strong>Description:</strong> {assignment.description}
          </Typography>
          <Typography as="p">
            <strong>Course:</strong> {assignment.course.name}
          </Typography>
          <Typography as="p">
            <strong>Submission Type:</strong> {assignment.submissionType}
          </Typography>
        </>
      );
    } else if (task.taskType === "Peer") {
      const peer = task.task as PeerType;
      return (
        <>
          <Typography variant="subheading">Peer Review Details</Typography>
          <Typography as="p">
            <strong>Topic:</strong> {peer.topic}
          </Typography>
          <Typography as="p">
            <strong>Description:</strong>
            <p dangerouslySetInnerHTML={{ __html: peer.description }} />
          </Typography>

          <Typography as="p">
            <strong>Review Criteria:</strong>
          </Typography>
          {peer.gradingCriteria.map((criterion, index) => (
            <Typography key={index} as="p">
              <strong>{criterion.criteria}:</strong> Max Points:{" "}
              {criterion.maxPoint}
            </Typography>
          ))}
        </>
      );
    }
    return null;
  };

  return (
    <Modal modalId={modalId}>
      <div className="w-full  overflow-visible  md:w-[800px] md:h-[600px] ">
        {loading ? (
          <ContentDetailsSkeleton />
        ) : task ? (
          <div>
            <ModalHeader modalId={modalId}>
              <Typography variant="subheading">
                {task.cohort.cohortName} - {task.title}
              </Typography>
              <div className="flex items-center">
                <Typography
                  variant="caption"
                  className="uppercase"
                  color="secondary"
                >
                  {task.taskType}
                </Typography>
              </div>
            </ModalHeader>

            <div className="mt-5 px-5 md:px-10">
              {/* {task. && (
                <div>
                  <Typography variant="subheading2" className="py-3">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: task?.description,
                      }}
                    />
                  </Typography>
                </div>
              )} */}
              <hr className="my-5 w-full border border-1" />

              {/* Task-Specific Details */}
              {renderTaskDetails()}

              <hr className="my-5 w-full border border-1" />

              <div className="pb-20">
                <Typography as="h3" variant="subheading">
                  Submissions
                </Typography>
                {task.taskCompletion.length === 0 ? (
                  <div className="h-[100px] w-full">
                    <Typography color="muted-alt">
                      No Submission yet!
                    </Typography>
                  </div>
                ) : (
                  task.taskCompletion.map((submission, index) => (
                    <div key={index} className="flex mt-5 items-center">
                      <div>
                        <Typography>
                          {submission.firstName} {submission.lastName}
                        </Typography>
                        <Typography color="muted">
                          Submitted on:{" "}
                          {readableDate(new Date(submission.submissionDate))}
                        </Typography>
                        <Typography>
                          <strong>Remark:</strong> {submission.remark}
                        </Typography>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </Modal>
  );
}

export default ViewTaskDetailsModal;
