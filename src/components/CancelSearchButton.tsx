import { Button } from "./Buttons";
import { RiCloseLargeLine } from "react-icons/ri";

type Props = {
  handleClick: () => void;
  className?: string;
};
function CancelSearchButton({ className, handleClick }: Props) {
  return (
    <div className={`w-[40px] ${className}`}>
      <Button onClick={handleClick}>
        <RiCloseLargeLine color="#fff" size="25px" />
      </Button>
    </div>
  );
}

export default CancelSearchButton;
