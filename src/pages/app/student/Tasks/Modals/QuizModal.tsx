import Modal from "../../../../../components/Modal/Modal";
import { TaskType } from "../../../../../types";
import { Typography } from "../../../../../components/Typography";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { useEffect, useState } from "react";
import { fetchData } from "../../../../../Utils/fetch";
import ContentDetailsSkeleton from "../Components/TaskDetailsSkeleton";
import { Button } from "../../../../../components/Buttons";
import ModalHeader from "../../../../../components/Modal/ModalHeader";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../../../redux/store";

enum TASK_SECTION {
  TASK = "task",
  GRADE = "grade",
}

const taskSectionArray = [TASK_SECTION.TASK, TASK_SECTION.GRADE];

interface ModalComponentProps {
  modalId: string;
}

function QuizModal({ modalId }: ModalComponentProps) {
  const { modalStates, hideModal } = useModal();
  const taskId = modalStates[modalId]?.props?.taskId;
  const [task, setTask] = useState<TaskType | null>(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<TASK_SECTION>(TASK_SECTION.TASK);
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const getAssignment = async () => {
      try {
        setLoading(true);
        const response = await fetchData<TaskType>(`/task/${taskId}`);

        setTask(response.data);
      } finally {
        setLoading(false);
      }
    };

    if (modalStates[modalId]?.isOpen) {
      getAssignment();
    }
  }, [taskId, modalStates[modalId]?.isOpen]);

  const handleStartQuiz = () => {
    hideModal(modalId);
    navigate(`student/tasks/quiz/${taskId}`);
  };

  return (
    <Modal modalId={modalId}>
      <div className="w-full h-[760px] overflow-visible md:w-[800px]">
        {loading ? (
          <ContentDetailsSkeleton />
        ) : task ? (
          <>
            <ModalHeader modalId={modalId}>
              <div className="flex items-center">
                <Typography variant="subheading" as="h3">
                  {task.cohort.cohortName}
                </Typography>
                <Typography variant="caption" className="ml-3" color="accent">
                  {task.taskType}
                </Typography>
              </div>
            </ModalHeader>
            <div className="flex mt-10 px-5 md:px-10 flex-col">
              <div className="flex items-center">
                {taskSectionArray.map((section, index) => (
                  <div
                    className={`mr-3 p-3 ${
                      section === selected
                        ? "bg-[#EBEDF5] rounded-[32px] px-4"
                        : ""
                    } cursor-pointer`}
                    onClick={() => setSelected(section)}
                  >
                    <Typography
                      key={index}
                      variant="body"
                      color={section === selected ? "primary" : "muted-alt"}
                      className="font-extrabold"
                    >
                      {section}
                    </Typography>
                  </div>
                ))}
              </div>
              <div>
                {selected === TASK_SECTION.TASK ? (
                  <>
                    <Typography
                      variant="caption"
                      className="mt-5 pb-2 text-[#6A6A6A]"
                    >
                      <strong> Quiz Details</strong>{" "}
                    </Typography>
                    <Typography
                      variant="heading2"
                      as="h3"
                      className=" text-[#6A6A6A]"
                    >
                      {task.task.topic}
                    </Typography>
                    <div
                      className=" text-md text-[#6A6A6A]"
                      dangerouslySetInnerHTML={{
                        __html: task.task.description,
                      }}
                    />
                    <Typography
                      variant="caption"
                      className="font-bold pt-3"
                      color="primary"
                    >
                      <strong> Time: 10Mins</strong>
                    </Typography>
                    <hr className="my-5" />
                    <div className="bg-[#FDF1D8] rounded-[32px] px-10 py-5">
                      <Typography
                        as="h3"
                        variant="heading2"
                        className="py-3 text-[#BC830B]"
                      >
                        INSTRUCTIONS
                      </Typography>

                      <Typography as="p" className="py-3 text-[#212121]">
                        <strong className="text-black">
                          &#x2022; Automatic Submission:
                        </strong>
                        <br />
                        <br />
                        If you quit before submitting, the quiz will be
                        automatically submitted and you'll receive a zero for
                        the quiz.
                      </Typography>
                      <Typography as="p" className="py-3 text-[#212121]">
                        <strong className="text-black">&#x2022; Score:</strong>
                        <br /> <br />
                        After submitting, your score will be displayed
                        immediately.
                      </Typography>
                    </div>
                  </>
                ) : (
                  <>
                    <Typography
                      variant="xSmall"
                      className="mt-5 pb-2 text-[#6A6A6A]"
                    >
                      To Pass
                    </Typography>
                    <Typography variant="heading2" as="h3" color="blackText">
                      Score 5 points or above
                    </Typography>

                    <hr className="my-10" />
                    <div className="bg-[#F7F7F7] rounded-[32px] w-full h-[200px] flex justify-center items-center px-10 py-5">
                      {!task.taskCompletion.filter(
                        (participation) => participation.studentId == user._id
                      ).length ? (
                        <Typography
                          variant="body"
                          className="py-3 text-[#ACB4D5]"
                        >
                          No grade yet
                        </Typography>
                      ) : (
                        <Typography variant="heading" as="h3" className="py-3 ">
                          {
                            task.taskCompletion.filter(
                              (participation) =>
                                participation.studentId == user._id
                            )[0].point
                          }
                        </Typography>
                      )}
                    </div>
                  </>
                )}
              </div>
              <div className="justify-end items-center flex mt-10">
                <div className="w-[150px]">
                  <Typography
                    className="ml-5 bg-transparent"
                    variant="link"
                    onClick={() => hideModal(modalId)}
                  >
                    Close Quiz
                  </Typography>
                </div>
                {!task.taskCompletion.filter(
                  (participation) => participation.studentId == user._id
                ).length ? (
                  <div className="w-[200px]">
                    <Button size="lg" onClick={handleStartQuiz}>
                      Start Quiz
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </Modal>
  );
}

export default QuizModal;
