import Modal from "../../../../../components/Modal/Modal";
import { MiniClassType } from "../../../../../types";
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

function ViewMiniClassModal({ modalId }: ModalComponentProps) {
  const { modalStates } = useModal();
  const classId = modalStates[modalId]?.props?.classId;
  const [miniClass, setMiniClass] = useState<MiniClassType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getAssignment = async () => {
      try {
        setLoading(true);
        const response = await fetchData<MiniClassType>(
          `/mini-class/${classId}/class`
        );

        setMiniClass(response.data);
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
        ) : miniClass ? (
          <div>
            <ModalHeader modalId={modalId}>
              <Typography variant="subheading">
                {miniClass.cohort.cohortName}
              </Typography>
              <div className=" flex items-center">
                <Typography variant="body" color="muted-alt" className="">
                  Week Number: {miniClass.weekNumber}
                </Typography>
                <Typography variant="body" color="muted-alt" className="">
                  Lecture Date:
                  {readableDate(new Date(miniClass.startTime))}
                </Typography>
              </div>
            </ModalHeader>
          </div>
        ) : null}
      </div>
    </Modal>
  );
}

export default ViewMiniClassModal;
