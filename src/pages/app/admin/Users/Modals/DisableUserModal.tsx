import Modal from "../../../../../components/Modal/Modal";
import { CourseType } from "../../../../../types";
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

function DisableUserModal({ modalId }: ModalComponentProps) {
  const { modalStates, hideModal } = useModal();
  const statesData = modalStates[modalId]?.props;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const disableUser = async () => {
    try {
      setLoading(true);
      await updateData<CourseType>(`/user/${statesData?.userid}/disable`, {});
    } finally {
      dispatch(setReload(true));
      setLoading(false);
      hideModal(modalId);
    }
  };

  return (
    <Modal modalId={modalId}>
      <ModalHeader modalId={modalId}>
        <Typography variant="subheading">Disable User </Typography>
      </ModalHeader>
      <div className="w-full h-[500px] px-5 md:px-10 mt-10 overflow-visible md:w-[800px]">
        {" "}
        <Typography variant="subheading" as="h2">
          Are you sure you want to disable this user?
        </Typography>
        <div className="flex mt-5 justify-between">
          <Button
            variant="destructive"
            loading={loading}
            disabled={loading}
            onClick={disableUser}
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default DisableUserModal;
