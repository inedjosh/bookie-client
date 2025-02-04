import { useState } from "react";
import { Typography } from "../../../../../components/Typography";
import { TASK_TYPES } from "../../../../../constants";
import { Button } from "../../../../../components/Buttons";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { MODAL_ID } from "../../../../../Layouts/ModalLayouts";

type Props = {
  setTask: (role: TASK_TYPES) => void;
};

const options = [
  { label: "Task", value: 0, type: TASK_TYPES.TASK },
  { label: "Quiz", value: 1, type: TASK_TYPES.QUIZ },
  { label: "Assignment", value: 2, type: TASK_TYPES.ASSIGNMENT },
  { label: "Peer", value: 3, type: TASK_TYPES.PEER },
];

function ContentActions({ setTask }: Props) {
  const { showModal } = useModal();
  const [selectedOption, setSelectedOption] = useState(0);

  const handleSelection = (value: number, type: TASK_TYPES) => {
    setTask(type);
    setSelectedOption(value);
  };

  return (
    <div className="flex justify-between flex-col md:flex-row">
      <div className="flex justify-between border-b-2 w-full md:w-fit border-primary flex-col md:flex-row">
        {options.map(({ label, value, type }) => (
          <div
            key={value}
            className={`cursor-pointer py-3 px-10 ${
              selectedOption === value
                ? "bg-border text-primary"
                : "bg-white text-foreground"
            }`}
            onClick={() => handleSelection(value, type)}
          >
            <Typography variant="subheading2">{label}</Typography>
          </div>
        ))}
      </div>
      <div>
        {selectedOption === 1 ? (
          <Button onClick={() => showModal(MODAL_ID.CREATE_QUIZ)}>
            Create New Quiz
          </Button>
        ) : null}
        {selectedOption === 2 ? (
          <Button onClick={() => showModal(MODAL_ID.CREATE_ASSIGNMENT)}>
            Create New Assignment
          </Button>
        ) : null}
        {selectedOption === 3 ? (
          <Button onClick={() => showModal(MODAL_ID.CREATE_PEER)}>
            Create New Peer Assignment
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export default ContentActions;
