import { FC } from "react";
import { useModal } from "./ModalProvider";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

interface ModalProps {
  modalId: string;
  title?: string;
  children: React.ReactNode;
  closeModalFromOutside?: boolean;
}

const Modal: FC<ModalProps> = ({
  modalId,
  children,
  closeModalFromOutside = true,
}) => {
  const { modalStates, hideModal } = useModal();
  const isOpen = modalStates[modalId]?.isOpen;

  if (!isOpen) return null;

  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-10 focus:outline-none"
      onClose={() => {
        closeModalFromOutside ? hideModal(modalId) : {};
      }}
    >
      <DialogBackdrop className="fixed inset-0 bg-black/70 w-full" />
      <div className="fixed inset-0 z-10 w-screen p-4">
        <div className="flex min-h-full  items-center justify-center">
          <DialogPanel
            transition
            className="w-fit h-fit rounded-[50px] relative overflow-y-scroll bg-white shadow-md backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
          >
            <div>{children}</div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default Modal;
