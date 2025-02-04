import { ReactNode } from "react";
import { Typography } from "../../../../../components/Typography";
import { Button } from "../../../../../components/Buttons";

type Props = {
  title: string;
  icon: ReactNode;
  buttonText: string;
  progress: number;
  goalNumber: number;
  onClick: () => void;
  bg: string;
  circleBg: string;
};
function CourseGoalCard({
  title,
  // icon,
  buttonText,
  progress,
  goalNumber,
  onClick,
  bg,
  circleBg,
}: Props) {
  return (
    <div
      className={`flex rounded-[20px] px-5 mt-3 h-[80px] justify-between items-center ${bg}`}
    >
      <div className="flex items-center">
        <div className="w-12 h-12 flex justify-center items-center rounded-full bg-white">
          <div className={`${circleBg} h-5 w-5 rounded-full`} />
        </div>
        <div className="ml-3">
          <Typography variant="caption" color="blackText">
            {title}
          </Typography>
          <Typography variant="caption" color="muted-alt">
            <span className="text-2xl text-black font-bold"> {progress}</span>/{" "}
            {goalNumber}
          </Typography>
        </div>
      </div>

      <div>
        <Button
          onClick={onClick}
          variant="default"
          className="h-[30px] bg-white hover:bg-white text-sm border border-border"
        >
          <Typography color="primary"> {buttonText}</Typography>
        </Button>
      </div>
    </div>
  );
}

export default CourseGoalCard;
