import Modal from "../../../../../components/Modal/Modal";
import { Typography } from "../../../../../components/Typography";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { useState } from "react";
import { updateData } from "../../../../../Utils/fetch";
import { Button } from "../../../../../components/Buttons";
import { setReload } from "../../../../../redux/slices/uiActions.slice";
import { useDispatch } from "react-redux";
import ModalHeader from "../../../../../components/Modal/ModalHeader";

interface ModalComponentProps {
  modalId: string;
}

function StartCohortModal({ modalId }: ModalComponentProps) {
  const { modalStates, hideModal } = useModal();
  const cohortId = modalStates[modalId]?.props?.cohortId;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const startCohort = async () => {
    try {
      setLoading(true);
      await updateData(`/cohort/${cohortId}/start-cohort`, {});
    } finally {
      dispatch(setReload(true));
      setLoading(false);
      hideModal(modalId);
    }
  };

  return (
    <Modal modalId={modalId}>
      <ModalHeader modalId={modalId}>
        <Typography variant="subheading" as="h2">
          Start Cohort{" "}
        </Typography>
      </ModalHeader>
      <div className="w-full h-[170px] py-5 px-5 md:px-10 overflow-visible md:w-[500px]">
        <Typography variant="subheading" as="h2">
          Are you sure you want to start this cohort?
        </Typography>
        <div className="flex mt-5 justify-between">
          <Button loading={loading} disabled={loading} onClick={startCohort}>
            Start Cohort
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default StartCohortModal;
