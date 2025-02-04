import Modal from "../../../../../components/Modal/Modal";
import { ClassType } from "../../../../../types";
import { Typography } from "../../../../../components/Typography";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { useEffect, useState } from "react";
import { fetchData } from "../../../../../Utils/fetch";
import ContentDetailsSkeleton from "../Components/TaskDetailsSkeleton";
import { readableDate } from "../../../../../Utils/Helpers";
import ModalHeader from "../../../../../components/Modal/ModalHeader";
import { Button } from "../../../../../components/Buttons";

interface ModalComponentProps {
  modalId: string;
}

function ViewClassModal({ modalId }: ModalComponentProps) {
  const { modalStates } = useModal();
  const classId = modalStates[modalId]?.props?.classId;
  const [schedule, setSchedule] = useState<ClassType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getAssignment = async () => {
      try {
        setLoading(true);
        const response = await fetchData<ClassType>(`/class/${classId}`);

        setSchedule(response.data);
      } finally {
        setLoading(false);
      }
    };

    if (modalStates[modalId]?.isOpen) getAssignment();
  }, [classId, modalStates[modalId]?.isOpen]);

  return (
    <Modal modalId={modalId}>
      <div className="w-full h-[500px] overflow-visible md:w-[500px]">
        {loading ? (
          <ContentDetailsSkeleton />
        ) : schedule ? (
          <div>
            <ModalHeader modalId={modalId}>
              <Typography variant="subheading">
                {schedule.cohort.cohortName}
              </Typography>
              <div className=" flex items-center">
                <Typography variant="body" color="muted-alt" className="">
                  Week Number: {schedule.weekNumber}
                </Typography>
                <Typography variant="body" color="muted-alt" className="">
                  Lecture Date:
                  {readableDate(new Date(schedule.lectureStartDate))}
                </Typography>
              </div>
            </ModalHeader>

            <div className="pt-5 px-5 md:px-10">
              <Typography variant="body" className="py-2">
                Content: {schedule.content.title}
              </Typography>
              <Typography variant="body" className="py-2">
                Task:
                {schedule.task.title}
              </Typography>
              {schedule.startUrl && (
                <a
                  href={schedule.startUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button>Join Class</Button>
                </a>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </Modal>
  );
}

export default ViewClassModal;
