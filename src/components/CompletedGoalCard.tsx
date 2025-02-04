import { Completed } from "../assets";
import { Typography } from "./Typography";

type Props = {
  point: number;
  total: number;
};

const CompletedGoalCard = ({ point, total }: Props) => {
  return (
    <div className="bg-[#E9F3E9]  w-full mr-2 rounded-[12px] p-2 ">
      <div className="flex justify-end">
        <img src={Completed} className="w-8" />
      </div>
      <Typography className="text-[#9FCB9F] my-5">Completed</Typography>
      <Typography className="text-[#9FCB9F]">
        <span className="text-[#016F09] text-5xl font-bold">{point}</span>/
        {total}
      </Typography>
    </div>
  );
};

export default CompletedGoalCard;
