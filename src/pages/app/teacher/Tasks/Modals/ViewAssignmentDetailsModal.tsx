import Modal from "../../../../../components/Modal/Modal";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { fetchData } from "../../../../../Utils/fetch";
import { useEffect, useState } from "react";
import { AssignmentType } from "../../../../../types";
import ModalHeader from "../../../../../components/Modal/ModalHeader";
import { Typography } from "../../../../../components/Typography";
import { readableDate } from "../../../../../Utils/Helpers";
import EditContentSkeleton from "../../Content/Components/EditContentSkeleton";

interface ModalComponentProps {
  modalId: string;
}

function ViewAssignmentDetailsModal({ modalId }: ModalComponentProps) {
  const { modalStates } = useModal();
  const assignmentId = modalStates[modalId]?.props?.assignmentId;
  const [loading, setLoading] = useState(false);
  const [assignment, setAssignment] = useState<AssignmentType | null>();

  useEffect(() => {
    const getCourse = async () => {
      try {
        setLoading(true);
        const response = await fetchData<AssignmentType>(
          `/assignment/${assignmentId}`
        );
        setAssignment(response.data || null);
      } finally {
        setLoading(false);
      }
    };

    if (modalStates[modalId]?.isOpen) getCourse();
  }, [assignmentId, modalStates[modalId]?.isOpen]);

  return (
    <Modal modalId={modalId}>
      {assignment ? (
        <ModalHeader modalId={modalId}>
          <Typography variant="subheading">{assignment.topic}</Typography>
          <Typography variant="caption" color="muted-alt">
            {readableDate(new Date(assignment.createdAt))}
          </Typography>
        </ModalHeader>
      ) : null}
      <div className="w-full h-[400px] px-5 md:px-10 mt-10 overflow-visible md:w-[800px]">
        {loading ? (
          <EditContentSkeleton />
        ) : (
          <div>
            <div className="mt-10">
              <Typography>
                <strong>Question</strong>
              </Typography>
              {assignment ? (
                <Typography as="div" className="mt-3" color="muted-alt">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: assignment.description,
                    }}
                  />
                </Typography>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default ViewAssignmentDetailsModal;
