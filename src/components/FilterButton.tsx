import { VscSettings } from "react-icons/vsc";
import { Button } from "./Buttons";
import { useModal } from "./Modal/ModalProvider";

type Props = {
  filter: string;
  modalId: string;
  className?: string;
};
function FilterButton({ filter, className, modalId }: Props) {
  const { showModal } = useModal();

  return (
    <div className={`w-[60px] ${className}`}>
      <Button onClick={() => showModal(modalId, { filter })}>
        <VscSettings />
      </Button>
    </div>
  );
}

export default FilterButton;
