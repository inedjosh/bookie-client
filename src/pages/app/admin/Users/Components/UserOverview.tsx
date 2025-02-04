import Card from "../../../../../components/Card";
import { Typography } from "../../../../../components/Typography";

type Props = {
  totalUsers: number;
  verifiedUsers: number;
  enrolledStudents: number;
  isStudent: boolean;
};
function UserOverview({
  totalUsers,
  verifiedUsers,
  enrolledStudents,
  isStudent,
}: Props) {
  return (
    <Card variant="outlined">
      <Typography as="h4" variant="subheading">
        Overview
      </Typography>
      <div className="flex  flex-wrap flex-col md:flex-row md:justify-between mt-3 md:items-center">
        <div className="flex md:justify-center md:items-center flex-col flex-[.3]">
          <Typography variant="subheading2">Total Users</Typography>
          <Typography variant="subheading2">{totalUsers}</Typography>
        </div>
        <div className="border-1 border md:h-20 " />
        <div className="flex md:justify-center md:items-center flex-col flex-[.3]">
          <Typography variant="subheading2">Verified Users</Typography>
          <Typography variant="subheading2">{verifiedUsers}</Typography>
        </div>
        {isStudent && (
          <>
            <div className="border-1 border md:h-20 " />
            <div className="flex md:justify-center md:items-center flex-col flex-[.3]">
              <Typography variant="subheading2">Enrolled Students</Typography>
              <Typography variant="subheading2">{enrolledStudents}</Typography>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}

export default UserOverview;
