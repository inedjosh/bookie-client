import Modal from "../../../../../components/Modal/Modal";
import {
  AxiosSubmissionAndTask,
  SubmissionListType,
  TaskType,
} from "../../../../../types";
import { Typography } from "../../../../../components/Typography";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { useEffect, useState } from "react";
import { fetchData, postData } from "../../../../../Utils/fetch";
import ContentDetailsSkeleton from "../Components/TaskDetailsSkeleton";
import ModalHeader from "../../../../../components/Modal/ModalHeader";
import { readableDate } from "../../../../../Utils/Helpers";
import { Button } from "../../../../../components/Buttons";
import { useDispatch } from "react-redux";
import { setReload } from "../../../../../redux/slices/uiActions.slice";

interface ModalComponentProps {
  modalId: string;
}

function ViewSubmissionModal({ modalId }: ModalComponentProps) {
  const { modalStates } = useModal();
  const taskId = modalStates[modalId]?.props?.taskId;
  const [submissions, setSubmissions] = useState<SubmissionListType[]>([]);
  const [task, setTask] = useState<TaskType | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingEvaluation, setLoadingEvaluation] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const getSubmissions = async () => {
      try {
        setLoading(true);
        const response = await fetchData<AxiosSubmissionAndTask>(
          `/task/submission/${taskId}`
        );

        setSubmissions(response.data?.totalSubmissions || []);
        setTask(response.data?.task || null);
      } finally {
        setLoading(false);
      }
    };

    if (modalStates[modalId]?.isOpen) getSubmissions();
  }, [taskId, modalStates[modalId]?.isOpen]);

  const evaluate = async (fileName: string, userId: string, taskId: string) => {
    try {
      setLoadingEvaluation(true);
      await postData("task/evaluate", {
        fileName,
        userId,
        taskId,
        fileType: task?.submissionType,
      });
      dispatch(setReload(true));
    } finally {
      setLoadingEvaluation(false);
      dispatch(setReload(true));
    }
  };

  return (
    <Modal modalId={modalId}>
      <div className="w-full h-[600px] overflow-visible md:w-[800px]">
        {loading ? (
          <ContentDetailsSkeleton />
        ) : task ? (
          <div>
            <ModalHeader modalId={modalId}>
              <Typography variant="subheading">{task.title}</Typography>
              <div className=" flex items-center">
                <Typography variant="caption" color="secondary">
                  Due Date: {readableDate(new Date(task.dueDate))}
                </Typography>
              </div>
            </ModalHeader>
            <div className="mt-3 px-5 md:px-10">
              <Typography variant="subheading" className="mb-5">
                Submissions
              </Typography>
              <div>
                {submissions.map((submission, index) => {
                  return (
                    <div
                      className="flex border-b pb-5 justify-between items-center"
                      key={submission._id}
                    >
                      <div className="flex items-center">
                        <Typography variant="subheading" color="muted-alt">
                          {index + 1}.
                        </Typography>
                        <div>
                          <Typography variant="subheading2" className="pl-2">
                            {submission.student.firstName}&nbsp;
                            {submission.student.lastName}
                          </Typography>
                        </div>
                        &nbsp;
                        <a href={submission.url} target="_blank">
                          <Typography variant="subheading2" color="secondary">
                            - Link
                          </Typography>
                        </a>
                      </div>
                      <div>
                        <div>
                          {submission.taskCompletion?.evaluated ? (
                            <div className="w-[100px]">
                              <Typography
                                variant="subheading2"
                                color="secondary"
                              >
                                {submission.taskCompletion.point} Pts
                              </Typography>
                            </div>
                          ) : (
                            <div className="w-[100px]">
                              <Button
                                onClick={() =>
                                  evaluate(
                                    submission.fileName,
                                    submission.student._id,
                                    submission.task
                                  )
                                }
                                loading={loadingEvaluation}
                                disabled={loadingEvaluation}
                              >
                                Evaluate
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </Modal>
  );
}

export default ViewSubmissionModal;
