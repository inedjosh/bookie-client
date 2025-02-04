import Modal from "../../../../../components/Modal/Modal";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { fetchData } from "../../../../../Utils/fetch";
import { useEffect, useState } from "react";
import { PeerType } from "../../../../../types";
import ModalHeader from "../../../../../components/Modal/ModalHeader";
import { Typography } from "../../../../../components/Typography";
import { readableDate } from "../../../../../Utils/Helpers";
import EditContentSkeleton from "../../Content/Components/EditContentSkeleton";

interface ModalComponentProps {
  modalId: string;
}

function ViewPeerModal({ modalId }: ModalComponentProps) {
  const { modalStates } = useModal();
  const peerId = modalStates[modalId]?.props?.peerId;
  const [loading, setLoading] = useState(false);
  const [assignment, setAssignment] = useState<PeerType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getCourse = async () => {
      if (!peerId) return;

      try {
        setLoading(true);
        setError(null); // Reset error before fetching
        const response = await fetchData<PeerType>(`/peer/${peerId}`);
        setAssignment(response.data || null);
      } catch (err) {
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (modalStates[modalId]?.isOpen) getCourse();
  }, [peerId, modalStates[modalId]?.isOpen]);

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
        ) : error ? (
          <Typography color="destructive">{error}</Typography>
        ) : (
          <div>
            <div className="mt-10">
              <Typography>
                <strong>Course</strong>
              </Typography>
              <Typography className="mt-3" color="muted-alt">
                {assignment?.course}
              </Typography>
            </div>
            <div className="mt-10">
              <Typography>
                <strong>Peer</strong>
              </Typography>
              {/* <Typography className="mt-3" color="muted-alt">
                {assignment?.peer}
              </Typography> */}
            </div>
            <div className="mt-10">
              <Typography>
                <strong>Topic</strong>
              </Typography>
              <Typography className="mt-3" color="muted-alt">
                {assignment?.topic}
              </Typography>
            </div>
            {assignment?.imageUrl && (
              <div className="mt-10">
                <Typography>
                  <strong>Image</strong>
                </Typography>
                <img
                  src={assignment?.imageUrl}
                  alt="Assignment Image"
                  className="mt-3"
                />
              </div>
            )}
            <div className="mt-10">
              <Typography>
                <strong>Description</strong>
              </Typography>
              <Typography as="div" className="mt-3" color="muted-alt">
                <div
                  dangerouslySetInnerHTML={{
                    __html: assignment?.description || "",
                  }}
                />
              </Typography>
            </div>
            <div className="mt-10">
              <Typography>
                <strong>Instructions</strong>
              </Typography>
              <Typography className="mt-3" color="muted-alt">
                {assignment?.instructions}
              </Typography>
            </div>
            <div className="mt-10">
              <Typography>
                <strong>Grading Criteria</strong>
              </Typography>
              {assignment?.gradingCriteria &&
              assignment.gradingCriteria.length > 0 ? (
                assignment.gradingCriteria.map((criteria, index) => (
                  <div key={index} className="mt-3">
                    <Typography>
                      <strong>{criteria.criteria}</strong>
                    </Typography>
                    <Typography className="mt-1" color="muted-alt">
                      {criteria.description}
                    </Typography>
                    <Typography className="mt-1" color="muted-alt">
                      Max Points: {criteria.maxPoint}
                    </Typography>
                    {criteria.gradingFields.map((field, idx) => (
                      <div key={idx} className="mt-3">
                        <Typography className="ml-5">
                          Field: {field.fieldName} - Grade: {field.grade}
                        </Typography>
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <Typography>No grading criteria available.</Typography>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default ViewPeerModal;
