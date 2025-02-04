// SlideInModal.tsx
import { FC } from "react";
import { Button } from "../Buttons";
import Modal from "./Modal";

interface ModalComponentProps {
  modalId: string;
}

const FilterModal: FC<ModalComponentProps> = ({ modalId }) => {
  return (
    <Modal modalId={modalId} title={"Filter"}>
      <div className=" w-[200px] flex flex-col justify-between h-[80%]">
        <div className="w-[100px] mt-5">
          {" "}
          <Button>Apply</Button>
        </div>{" "}
      </div>
    </Modal>
  );
};

export default FilterModal;
