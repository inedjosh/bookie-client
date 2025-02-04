import Modal from "../../../../../components/Modal/Modal";
import { CourseType } from "../../../../../types";
import { Typography } from "../../../../../components/Typography";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { useState } from "react";
import { deleteData } from "../../../../../Utils/fetch";
import { Button } from "../../../../../components/Buttons";
import { setReload } from "../../../../../redux/slices/uiActions.slice";
import { useDispatch } from "react-redux";
import ModalHeader from "../../../../../components/Modal/ModalHeader";

interface ModalComponentProps {
  modalId: string;
}

function DeleteCohortModal({ modalId }: ModalComponentProps) {
  const { modalStates, hideModal } = useModal();
  const cohortId = modalStates[modalId]?.props?.cohortId;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const deleteCohort = async () => {
    try {
      setLoading(true);
      await deleteData<CourseType>(`/cohort/${cohortId}`);
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
          Delete Cohort
        </Typography>
      </ModalHeader>
      <div className="w-full h-[200px] px-5 md:px-10 py-10 overflow-visible md:w-[500px]">
        <Typography variant="subheading" as="h2">
          Are you sure you want to delete this cohort?
        </Typography>
        <div className="flex mt-5 justify-between">
          <Button
            variant="destructive"
            loading={loading}
            disabled={loading}
            onClick={deleteCohort}
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default DeleteCohortModal;
