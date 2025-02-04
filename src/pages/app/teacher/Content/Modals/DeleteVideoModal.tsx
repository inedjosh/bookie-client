import Modal from "../../../../../components/Modal/Modal";
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

function DeleteVideoModal({ modalId }: ModalComponentProps) {
  const { modalStates, hideModal } = useModal();
  const videoId = modalStates[modalId]?.props?.videoId;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const deleteVideo = async () => {
    try {
      setLoading(true);
      await deleteData(`video/${videoId}/`);
    } finally {
      setLoading(false);

      dispatch(setReload(true));
      hideModal(modalId);
    }
  };

  return (
    <Modal modalId={modalId}>
      <ModalHeader modalId={modalId}>
        <Typography variant="subheading" as="h2">
          Delete Video{" "}
        </Typography>
      </ModalHeader>
      <div className="w-full h-[220px] px-5 md:px-10 overflow-visible md:w-[500px]">
        <div>
          <Typography variant="subheading" as="h2" className="my-5">
            Are you sure you want to delete this video?
          </Typography>

          <div className="flex mt-10 justify-between">
            <Button
              variant="destructive"
              onClick={deleteVideo}
              loading={loading}
              disabled={loading}
              type="submit"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default DeleteVideoModal;
