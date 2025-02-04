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

function DeleteContentModal({ modalId }: ModalComponentProps) {
  const { modalStates, hideModal } = useModal();
  const statesData = modalStates[modalId]?.props;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const deleteCourse = async () => {
    try {
      setLoading(true);
      await deleteData<CourseType>(`/course/${statesData?.courseId}`);
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
          Delete Content{" "}
        </Typography>
      </ModalHeader>
      <div className="w-full h-[300px] px-5 md:px-10 overflow-visible md:w-[500px]">
        <Typography variant="subheading" as="h2">
          Are you sure you want to delete this course?
        </Typography>
        <div className="flex mt-5 justify-between">
          <Button
            variant="destructive"
            loading={loading}
            disabled={loading}
            onClick={deleteCourse}
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default DeleteContentModal;
