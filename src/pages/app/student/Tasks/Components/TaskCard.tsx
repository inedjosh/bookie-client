import Card from "../../../../../components/Card";
import { IoDocumentTextOutline } from "react-icons/io5";
import { Typography } from "../../../../../components/Typography";
import { LuCalendarClock } from "react-icons/lu";
import { Button } from "../../../../../components/Buttons";
import { IMG_LIST } from "../../../../../constants";

type Props = {
  type: "task";
  alignment?: "horizontal" | "vertical";
  topic: string;
  week: number;
  lecture: number;
  date: string;
};
function TaskCard({
  type,
  topic,
  week,
  lecture,
  date,
  alignment = "vertical",
}: Props) {
  const randomImage = IMG_LIST[Math.floor(Math.random() * IMG_LIST.length)];

  return (
    <>
      {alignment === "vertical" ? (
        <Card
          variant="outlined"
          className="flex-1 md:min-w-[250px] min-w-full md:max-w-[300px] my-2 md:mr-2"
        >
          <img
            src={randomImage}
            className="w-full object-cover h-[80px] rounded-[5px]"
          />
          <div className="flex mt-2">
            <IoDocumentTextOutline className="text-secondary" />
            <Typography variant="caption" color="muted-alt">
              {type}
            </Typography>
          </div>
          <Typography
            variant="subheading"
            color="blackText"
            as="h3"
            className="py-1"
          >
            {topic}
          </Typography>
          <div className="flex flex-wrap mt-2 items-center">
            <div className="bg-border rounded-xl w-fit mr-2 px-2 py-1">
              <Typography variant="xSmall" color="muted-alt">
                Week {week}{" "}
              </Typography>
            </div>
            <div className="bg-border rounded-xl w-fit px-2 py-1">
              <Typography variant="xSmall" color="muted-alt">
                Lecture {lecture}{" "}
              </Typography>
            </div>
          </div>
          <div className="flex w-full justify-between mt-5 items-center">
            <div className="flex items-center">
              <LuCalendarClock className="text-muted-alt text-sm" />
              <Typography variant="body" color="blackText" className="pl-1">
                {date}
              </Typography>
            </div>
            <Button
              variant="outline"
              className="border w-[55px] h-[25px] border-border "
            >
              <Typography color="primary">Start</Typography>
            </Button>
          </div>
        </Card>
      ) : (
        <Card
          variant="outlined"
          className="flex-1 flex min-w-full md:min-w-[500px] max-w-full md:max-w-[800px] my-2 md:mr-2"
        >
          <img
            src={randomImage}
            className="w-[100px] md:w-[220px] object-cover  rounded-[5px]"
          />
          <div className="ml-3 w-full">
            <div>
              <div className="flex mt-2">
                <IoDocumentTextOutline className="text-secondary" />
                <Typography variant="caption" color="muted-alt">
                  {type}
                </Typography>
              </div>
              <Typography
                variant="subheading"
                color="blackText"
                as="h3"
                className="py-1 "
              >
                {topic}
              </Typography>
            </div>
            <div className="flex flex-wrap mt-2 items-center">
              <div className="bg-border rounded-xl w-fit mr-2 px-2 py-1">
                <Typography variant="xSmall" color="muted-alt">
                  Week {week}
                </Typography>
              </div>
              <div className="bg-border rounded-xl w-fit px-2 py-1">
                <Typography variant="xSmall" color="muted-alt">
                  Lecture {lecture}
                </Typography>
              </div>
            </div>
            <div className="flex w-full justify-between mt-5 items-center">
              <div className="flex items-center">
                <LuCalendarClock className="text-muted-alt text-sm" />
                <Typography variant="body" color="blackText" className="pl-1">
                  {date}
                </Typography>
              </div>
              <div className="w-[80px]">
                <Button
                  variant="outline"
                  className="border w-[40px] h-[25px] border-border "
                >
                  <Typography color="primary">Start</Typography>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}

export default TaskCard;
