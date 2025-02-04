import Card from "../../../../../components/Card";
import { Typography } from "../../../../../components/Typography";

type Props = {
  totalTask: number;
  totalSubmittedTask: number;
  totalCompletedTask: number;
  totalEnrolledStudents: number;
};
function TaskOverview({
  totalCompletedTask,
  totalEnrolledStudents,
  totalSubmittedTask,
  totalTask,
}: Props) {
  return (
    <Card variant="outlined">
      <Typography as="h4" variant="subheading">
        Overview
      </Typography>
      <div className="flex  flex-wrap flex-col md:flex-row md:justify-between mt-3 md:items-center">
        <div className="flex md:justify-center md:items-center flex-col flex-[.3]">
          <Typography variant="subheading2">Total Tasks</Typography>
          <Typography variant="subheading2">{totalTask}</Typography>
        </div>
        <div className="border-1 border md:h-20 " />
        <div className="flex md:justify-center md:items-center flex-col flex-[.3]">
          <Typography variant="subheading2">Total Submitted Tasks</Typography>
          <Typography variant="subheading2">{totalCompletedTask}</Typography>
        </div>
        <div className="border-1 border md:h-20 " />
        <div className="flex md:justify-center md:items-center flex-col flex-[.3]">
          <Typography variant="subheading2" className="text-center">
            Total Students assigned tasks
          </Typography>
          <Typography variant="subheading2">{totalEnrolledStudents}</Typography>
        </div>
        <div className="border-1 border md:h-20 " />
        <div className="flex md:justify-center md:items-center flex-col flex-[.3]">
          <Typography variant="subheading2">Total Submitted Tasks</Typography>
          <Typography variant="subheading2">{totalSubmittedTask}</Typography>
        </div>
      </div>
    </Card>
  );
}

export default TaskOverview;
