import Modal from "../../../../../components/Modal/Modal";
import { TaskType } from "../../../../../types";
import { Typography } from "../../../../../components/Typography";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { useEffect, useState } from "react";
import { fetchData } from "../../../../../Utils/fetch";
import ContentDetailsSkeleton from "../Components/TaskDetailsSkeleton";
import { readableDate } from "../../../../../Utils/Helpers";

interface ModalComponentProps {
  modalId: string;
}

function ViewTaskDetailsModal({ modalId }: ModalComponentProps) {
  const { modalStates } = useModal();
  const taskId = modalStates[modalId]?.props?.taskId;
  const [task, setTask] = useState<TaskType | null>(null);
  const [loading, setLoading] = useState(false);

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

    if (modalStates[modalId]?.isOpen) getAssignment();
  }, [taskId, modalStates[modalId]?.isOpen]);

  return (
    <Modal modalId={modalId}>
      <div className="w-full h-[500px] overflow-visible md:w-[500px]">
        {loading ? (
          <ContentDetailsSkeleton />
        ) : task ? (
          <div>
            <div className="">
              <Typography variant="subheading">
                {task.cohort.cohortName} - {task.title}
              </Typography>
            </div>
            <Typography variant="caption" color="secondary">
              Due Date: {readableDate(new Date(task.dueDate))}
            </Typography>
            <div>
              <div>
                <Typography as="h3" variant="subheading">
                  Submissions
                </Typography>
                {task.taskCompletion.length === 0 ? (
                  <div className="h-[300px] w-full">
                    <Typography color="muted-alt">
                      No Submission yet!
                    </Typography>
                  </div>
                ) : (
                  task.taskCompletion.map((submission, index) => (
                    <div key={index} className="flex mt-5 items-center">
                      <div>
                        <Typography variant="heading2" as="h2">
                          {index + 1}
                        </Typography>
                      </div>
                      <div className="flex w-full flex-col pl-5">
                        <Typography variant="subheading2">
                          {submission.firstName} {submission.lastName}
                        </Typography>
                        <Typography variant="caption" color="secondary">
                          Submission Date:{" "}
                          {readableDate(new Date(submission.submissionDate))}
                        </Typography>
                        {submission.remark && (
                          <Typography variant="caption">
                            Remark:
                            {submission.remark}
                          </Typography>
                        )}
                        <hr className="mt-5  w-full border border-1" />
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
