import { Button } from "../../../../components/Buttons";
import { Typography } from "../../../../components/Typography";

type Props = {
  bg: string;
  circleBg: string;
  topic: string;
  points: number;
  total: number;
};
function EvaluationCard({ bg, circleBg, topic, points, total }: Props) {
  return (
    <div
      className={`${bg} w-full md:w-[48%] mr-3 mb-5 p-3 py-5  rounded-[20px]`}
    >
      <div className="flex items-center justify-between">
        <div className="w-[40px] h-[40px] rounded-full flex justify-center items-center bg-white">
          <div className={` w-[20px] h-[20px] rounded-full ${circleBg} `} />
        </div>
        <div className="w-[120px]">
          <Button color="white" className="bg-white ">
            <Typography variant="caption" color="primary">
              Explore
            </Typography>
          </Button>
        </div>
      </div>
      <div className="mt-10">
        <Typography variant="body" className="text-[#4D4D4D]">
          {topic}
        </Typography>
        <Typography variant="subheading2" color="muted-alt">
          <strong className="text-4xl text-black">{points}</strong>/{total}
        </Typography>
      </div>
    </div>
  );
}

export default EvaluationCard;
