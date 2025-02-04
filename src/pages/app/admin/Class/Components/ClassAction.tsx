import { useState } from "react";
import { Typography } from "../../../../../components/Typography";
import { CLASS_TYPES } from "../../../../../constants";

type Props = {
  setClass: (role: CLASS_TYPES) => void;
};
function ClassActions({ setClass }: Props) {
  const [selectedOption, setSelectedOption] = useState(0);

  const handleSelection = (value: number) => {
    if (value == 0) {
      setClass(CLASS_TYPES.CLASS);
    } else if (value == 1) {
      setClass(CLASS_TYPES.MINI_CLASS);
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
          <Typography variant="subheading2">Class</Typography>
        </div>{" "}
        <div
          className={` cursor-pointer ${
            selectedOption === 1
              ? "bg-border text-primary"
              : "bg-white text-foreground"
          } py-3 px-10`}
          onClick={() => handleSelection(1)}
        >
          <Typography variant="subheading2">Mini Class</Typography>
        </div>{" "}
      </div>
    </div>
  );
}

export default ClassActions;
