import { Points } from "../assets";
import { Typography } from "./Typography";

type Props = {
  point: number;
  total: number;
};
const PointsEarnedGoalCard = ({ point, total }: Props) => {
  return (
    <div className="bg-[#FDF1D8] w-full ml-2 rounded-[12px] p-2 ">
      <div className="flex justify-end">
        <img src={Points} className="w-8" />
      </div>
      <Typography className="text-[#D5C090] my-5">Points earned</Typography>
      <Typography className="text-[#D5C090]">
        <span className="text-[#BC830B] text-5xl font-bold">{point}</span>/
        {total}
      </Typography>
    </div>
  );
};

export default PointsEarnedGoalCard;
