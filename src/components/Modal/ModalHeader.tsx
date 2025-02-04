import React from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useModal } from "./ModalProvider";

type Props = {
  modalId: string;
  children: React.ReactNode;
  showClose?: boolean;
};
function ModalHeader({ children, modalId, showClose = true }: Props) {
  const { hideModal } = useModal();
  return (
    <div className="justify-between shadow-lg  md:px-10 px-5 py-5 flex relative w-full items-center">
      <div>{children}</div>
      {showClose ? (
        <div className="cursor-pointer " onClick={() => hideModal(modalId)}>
          <IoIosCloseCircleOutline size="30px" />
        </div>
      ) : null}
    </div>
  );
}

export default ModalHeader;
