import Card from "./Card";
import { Dart, Pattern } from "../assets";
import { Typography } from "./Typography";

type Props = {
  weekNumberByProgress: number;
};
function CatchUpDiv({ weekNumberByProgress }: Props) {
  return (
    <Card
      className=" p-5 w-full flex-col flex relative  overflow-hidden"
      variant="dark"
    >
      <img src={Pattern} className="absolute inset-0" />
      <div className="flex justify-between w-full items-start">
        <div>
          <Typography
            variant="subheading"
            color="white"
            className="lg:pl-5 mt-3 lg:mt-0"
            as="h3"
          >
            Catch up
          </Typography>
          <Typography variant="body" color="muted-alt" className="lg:pl-5 mt-5">
            You are behind on the course schedule. Please complete week{" "}
            {weekNumberByProgress} tasks, content, classes, and mini class to
            proceed and avoid falling further behind!
          </Typography>
        </div>
        <img src={Dart} className="w-16" alt="Catch up icon" />
      </div>
    </Card>
  );
}

export default CatchUpDiv;
