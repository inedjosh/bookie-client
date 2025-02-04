import { useSelector } from "react-redux";
import Container from "../../../../components/Container";
import { Typography } from "../../../../components/Typography";
import { RootState } from "../../../../redux/store";
import Card from "../../../../components/Card";

function TeacherOverview() {
  const { user, cohort } = useSelector((state: RootState) => state.auth);

  return (
    <Container>
      <Card variant="outlined">
        <Typography as="h2" variant="heading2" className="capitalize">
          Welcome {user.firstName} {user.lastName}
        </Typography>
        <Typography
          variant="subheading"
          color="muted-alt"
          className="capitalize"
        >
          {cohort?.course.title}
        </Typography>
        <Typography
          variant="subheading"
          color="muted-alt"
          className="capitalize"
        >
          {cohort?.cohortName}
          {}{" "}
        </Typography>
      </Card>
    </Container>
  );
}

export default TeacherOverview;
