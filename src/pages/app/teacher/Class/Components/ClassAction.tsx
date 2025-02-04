import { useState } from "react";
import { Typography } from "../../../../../components/Typography";
import { CLASS_TYPES } from "../../../../../constants";

type Props = {
  setClass: (role: CLASS_TYPES) => void;
};

const options = [
  { label: "Class", value: 0, type: CLASS_TYPES.CLASS },
  { label: "Mini Class", value: 1, type: CLASS_TYPES.MINI_CLASS },
];

function ClassActions({ setClass }: Props) {
  const [selectedOption, setSelectedOption] = useState(0);

  const handleSelection = (value: number, type: CLASS_TYPES) => {
    setClass(type);
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
    </div>
  );
}

export default ClassActions;
