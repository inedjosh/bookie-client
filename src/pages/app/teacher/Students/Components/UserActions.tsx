import { useState } from "react";
import { Typography } from "../../../../../components/Typography";
import { Button } from "../../../../../components/Buttons";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { MODAL_ID } from "../../../../../Layouts/ModalLayouts";
import { ACCOUNT_TYPES } from "../../../../../constants";

type Props = {
  setRole: (role: ACCOUNT_TYPES) => void;
};
function UserActions({ setRole }: Props) {
  const [selectedOption, setSelectedOption] = useState(0);
  const { showModal } = useModal();

  const handleSelection = (value: number) => {
    if (value == 0) {
      setRole(ACCOUNT_TYPES.STUDENT);
    } else if (value == 1) {
      setRole(ACCOUNT_TYPES.TEACHER);
    } else if (value == 2) {
      setRole(ACCOUNT_TYPES.ADMIN);
    }
    setSelectedOption(value);
  };

  return (
    <div className="flex justify-between flex-col md:flex-row">
      <div className="flex justify-between border-b-2 w-full md:w-fit border-primary flex-col md:flex-row">
        <div
          className={` cursor-pointer ${
            selectedOption === 0
              ? "bg-border text-primary"
              : "bg-white text-foreground"
          } py-3 px-10`}
          onClick={() => handleSelection(0)}
        >
          <Typography variant="subheading2">Students</Typography>
        </div>{" "}
        <div
          className={` cursor-pointer ${
            selectedOption === 1
              ? "bg-border text-primary"
              : "bg-white text-foreground"
          } py-3 px-10`}
          onClick={() => handleSelection(1)}
        >
          <Typography variant="subheading2">Teachers</Typography>
        </div>{" "}
        <div
          className={` cursor-pointer ${
            selectedOption === 2
              ? "bg-border text-primary"
              : "bg-white text-foreground"
          } py-3 px-10`}
          onClick={() => handleSelection(2)}
        >
          <Typography variant="subheading2">Admins</Typography>
        </div>
      </div>
      <div className="mt-5 md:mt-0">
        {selectedOption === 1 && (
          <Button
            onClick={() => showModal(MODAL_ID.CREATE_TEACHER)}
            variant="default"
          >
            Create Teacher
          </Button>
        )}
        {selectedOption === 2 && (
          <Button
            onClick={() => showModal(MODAL_ID.CREATE_ADMIN)}
            variant="default"
          >
            Create Admin
          </Button>
        )}
      </div>
    </div>
  );
}

export default UserActions;
