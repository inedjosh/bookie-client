import { Button } from "../../../../../components/Buttons";
import Modal from "../../../../../components/Modal/Modal";
import ModalHeader from "../../../../../components/Modal/ModalHeader";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { Typography } from "../../../../../components/Typography";

interface ModalComponentProps {
  modalId: string;
}

function ClassNotAvailableModal({ modalId }: ModalComponentProps) {
  const { hideModal } = useModal();
  return (
    <Modal modalId={modalId}>
      <ModalHeader modalId={modalId}>
        <Typography as="h2" variant="subheading">
          Recording not available yet
        </Typography>
      </ModalHeader>
      <div className="w-full h-[400px] py-5 px-5 md:px-10 overflow-visible md:w-[500px]">
        <div className="pt-5">
          <Typography variant="body">
            The recording you’re looking for has not been made available at the
            moment. <br />
            <br />
            We understand that you may be eagerly awaiting access to this
            recording, and we assure you that it’s being processed or will be
            uploaded shortly. <br />
            <br />
            <strong>What happens next?</strong> As soon as the recording becomes
            available, you will receive a notification via email. This ensures
            that you don’t have to constantly check back; instead, you’ll be
            informed as soon as it’s ready for viewing. <br />
            <br />
            <strong> What to do in the meantime?</strong> You can explore other
            available resources, course content, or lectures that may complement
            the recording you're waiting for.
          </Typography>
        </div>
        <div className="my-5">
          <Button onClick={() => hideModal(modalId)}>Okay</Button>
        </div>
      </div>
    </Modal>
  );
}

export default ClassNotAvailableModal;
