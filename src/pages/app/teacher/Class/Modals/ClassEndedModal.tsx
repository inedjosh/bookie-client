import Modal from "../../../../../components/Modal/Modal";
import { Typography } from "../../../../../components/Typography";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { useState } from "react";
import { Button } from "../../../../../components/Buttons";
import ModalHeader from "../../../../../components/Modal/ModalHeader";
import { updateData } from "../../../../../Utils/fetch";

interface ModalComponentProps {
  modalId: string;
}

function ClassEndedModal({ modalId }: ModalComponentProps) {
  const { modalStates } = useModal();
  const statesData = modalStates[modalId]?.props;
  const [loadingEnd, setLoadingEnd] = useState(false);

  const classEnded = async () => {
    try {
      setLoadingEnd(true);
      await updateData(`class/class-ended/${statesData?.classId}`, {});
    } finally {
      setLoadingEnd(false);
    }
  };

  return (
    <Modal modalId={modalId}>
      <ModalHeader modalId={modalId}>
        <Typography variant="subheading" as="h2">
          Class Ended
        </Typography>
      </ModalHeader>
      <div className="w-full h-[220px] px-5 md:px-10 overflow-visible md:w-[500px]">
        <div>
          <Typography variant="subheading" as="h2" className="my-5">
            This would calculate the attendance and assign marks to the students{" "}
          </Typography>

          <div className="flex mt-10 justify-between">
            <Button
              variant="destructive"
              onClick={classEnded}
              loading={loadingEnd}
              disabled={loadingEnd}
              type="submit"
            >
              End Class
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ClassEndedModal;
