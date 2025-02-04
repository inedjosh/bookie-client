import Modal from "../../../../../components/Modal/Modal";
import { Typography } from "../../../../../components/Typography";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { useState } from "react";
import { postData } from "../../../../../Utils/fetch";
import { Button } from "../../../../../components/Buttons";
import { setReload } from "../../../../../redux/slices/uiActions.slice";
import { useDispatch } from "react-redux";
import ModalHeader from "../../../../../components/Modal/ModalHeader";

interface ModalComponentProps {
  modalId: string;
}

function CreateMiniClassModal({ modalId }: ModalComponentProps) {
  const { modalStates, hideModal } = useModal();
  const cohortId = modalStates[modalId]?.props?.cohortId;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const createSchedule = async () => {
    try {
      setLoading(true);
      await postData(`mini-class/${cohortId}/create`, {});
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
          Create Mini Class
        </Typography>
      </ModalHeader>
      <div className="w-full px-5 md:px-10 h-[200px] py-10 overflow-visible md:w-[500px]">
        <Typography variant="subheading" as="h2">
          Are you sure you want to create the mini classes for this cohort?
        </Typography>
        <div className="flex mt-10 justify-between">
          <Button
            variant="destructive"
            loading={loading}
            disabled={loading}
            onClick={createSchedule}
          >
            Create Mini Classes
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default CreateMiniClassModal;
