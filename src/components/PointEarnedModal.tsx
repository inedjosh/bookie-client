import Modal from "./Modal/Modal";
import ModalHeader from "./Modal/ModalHeader";
import { Typography } from "./Typography";
import { GoGoal } from "react-icons/go";
import { useModal } from "./Modal/ModalProvider";
import { Button } from "./Buttons";

interface ModalComponentProps {
  modalId: string;
}

function PointEarnedModal({ modalId }: ModalComponentProps) {
  const { modalStates, hideModal } = useModal();
  const statesData = modalStates[modalId]?.props;

  return (
    <Modal modalId={modalId} title="Update Course">
      <div className="w-full h-[420px] overflow-visible md:w-[400px]">
        <ModalHeader modalId={modalId}>
          <Typography variant="subheading">Point earned </Typography>
        </ModalHeader>
        <div className="w-full px-5 md:px-10 h-[350x]  items-center">
          <div className="w-full flex justify-center my-5">
            <GoGoal size="50px" className=" text-muted-alt " />
          </div>{" "}
          <Typography className="my-5 text-center" variant="subheading">
            You just earned <strong>{statesData?.point} points</strong> for
            completing a <strong>{statesData?.activity} activity</strong>
          </Typography>
          <Typography className="my-5 text-center" variant="subheading">
            Keep learning and stacking up points champ 🚀
          </Typography>
          <div>
            <Button onClick={() => hideModal(modalId)}>Close</Button>
          </div>
          <Typography
            className="my-5 text-center"
            variant="body"
            color="muted-alt"
          >
            Leaderboard coming soon!!!{" "}
          </Typography>
        </div>
      </div>
    </Modal>
  );
}

export default PointEarnedModal;
