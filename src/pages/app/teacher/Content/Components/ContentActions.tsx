import { useState } from "react";
import { Typography } from "../../../../../components/Typography";
import { CONTENT_TYPES } from "../../../../../constants";
import { Button } from "../../../../../components/Buttons";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { MODAL_ID } from "../../../../../Layouts/ModalLayouts";

type Props = {
  setContent: (role: CONTENT_TYPES) => void;
};

const options = [
  { label: "Content", value: 0, type: CONTENT_TYPES.CONTENT },
  { label: "Article", value: 1, type: CONTENT_TYPES.ARTICLE },
  { label: "Video", value: 2, type: CONTENT_TYPES.VIDEO },
];

function ContentActions({ setContent }: Props) {
  const { showModal } = useModal();
  const [selectedOption, setSelectedOption] = useState(0);

  const handleSelection = (value: number, type: CONTENT_TYPES) => {
    setContent(type);
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
          <Button onClick={() => showModal(MODAL_ID.CREATE_ARTICLE)}>
            Create New Article
          </Button>
        ) : null}
        {selectedOption === 2 ? (
          <Button onClick={() => showModal(MODAL_ID.CREATE_VIDEO)}>
            Create New Video
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export default ContentActions;
