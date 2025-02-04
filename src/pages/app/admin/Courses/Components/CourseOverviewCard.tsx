import Card from "../../../../../components/Card";
import { Typography } from "../../../../../components/Typography";

type Props = {
  totalCourses: number;
  totalEnrollment: number;
  completionRate: number;
};
function CourseOverviewCard({
  totalCourses,
  totalEnrollment,
  completionRate,
}: Props) {
  return (
    <Card variant="outlined">
      <Typography as="h4" variant="subheading">
        Overview
      </Typography>
      <div className="flex  flex-wrap flex-col md:flex-row md:justify-between mt-3 md:items-center">
        <div className="flex md:justify-center md:items-center flex-col flex-[.3]">
          <Typography variant="subheading2">Total Courses</Typography>
          <Typography variant="subheading2">{totalCourses}</Typography>
        </div>
        <div className="border-1 border md:h-20 " />
        <div className="flex md:justify-center md:items-center flex-col flex-[.3]">
          <Typography variant="subheading2">Total Enrollment</Typography>
          <Typography variant="subheading2">{totalEnrollment}</Typography>
        </div>
        <div className="border-1 border md:h-20 " />
        <div className="flex md:justify-center md:items-center flex-col flex-[.3]">
          <Typography variant="subheading2">Completion Rate</Typography>
          <Typography variant="subheading2">{completionRate}</Typography>
        </div>
      </div>
    </Card>
  );
}

export default CourseOverviewCard;
