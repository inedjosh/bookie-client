import { useEffect, useState } from "react";
import Container from "../../../../components/Container";
import { Typography } from "../../../../components/Typography";
import {
  AxiosWeekAndDayType,
  ClassType,
  GoalOverviewType,
} from "../../../../types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { fetchData } from "../../../../Utils/fetch";
import { setReload } from "../../../../redux/slices/uiActions.slice";
import TaskSkeleton from "./Components/TaskSkeleton";
import ClassCard from "../StudentOverview/Components/ClassCard";
import ClassGoalCard from "./Components/ClassGoalCard";
import { ClassTypeList } from "../../../../constants";
import { calculateCurrentWeek, readableDate } from "../../../../Utils/Helpers";
import Card from "../../../../components/Card";
import useIsMobile from "../../../../components/Hooks/UseIsMobile";
import CatchUpDiv from "../../../../components/CatchUpDiv";

const classTypeArr = [
  ClassTypeList.ALL,
  ClassTypeList.COMPLETED,
  ClassTypeList.IN_PROGRESS,
  ClassTypeList.NOT_STARTED,
];

function StudentClass() {
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [todaysClass, setTodaysClasses] = useState<ClassType | null>(null);
  const [selected, setSelected] = useState<ClassTypeList>(ClassTypeList.ALL);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { reload } = useSelector((state: RootState) => state.uiActions);
  const { cohort, user } = useSelector((state: RootState) => state.auth);
  const [classesThisWeek, setClassesThisWeek] = useState<ClassType[]>([]);
  const [goals, setGoal] = useState<GoalOverviewType | null>(null);
  const [weekNumberByProgress, setWeekNumberByProgress] = useState(0);
  const [weekAndDay, setWeekAndDay] = useState({
    date: "",
    day: 0,
    week: 0,
  });
  const isMobile = useIsMobile();

  useEffect(() => {
    const getCourses = async () => {
      try {
        const response = await Promise.all([
          fetchData<ClassType[]>(
            `/class/${cohort?._id}/cohort/${user._id}/active`
          ),
          fetchData<ClassType[]>(`class/${cohort?._id}/weekly/${user._id}`),
          fetchData<GoalOverviewType>(`user/goals/${user._id}`),
          fetchData<AxiosWeekAndDayType>(
            `cohort/${cohort?._id}/current-week-day`
          ),
          fetchData<ClassType>(`class/${cohort?._id}/today/${user._id}`),
        ]);

        setClasses(response[0].data || []);
        setClassesThisWeek(response[1].data || []);
        setGoal(response[2].data || null);
        setWeekAndDay({
          date: response[3].data?.currentDay || "",
          day: response[3].data?.day || 0,
          week: response[3].data?.week || 0,
        });
        setTodaysClasses(response[4].data || null);
      } finally {
        setLoading(false);
        dispatch(setReload(false));
      }
    };

    if (cohort?._id) getCourses();
  }, [reload, cohort?._id]);

  useEffect(() => {
    if (user) {
      const week = calculateCurrentWeek(user.totalScore);

      setWeekNumberByProgress(week);
    }
  }, [user]);

  const getFilteredClasses = () => {
    if (!classes?.length) return [];

    return classes.filter((schedule) => {
      switch (selected) {
        case ClassTypeList.COMPLETED:
          return ClassTypeList.COMPLETED === schedule.status;
        case ClassTypeList.NOT_STARTED:
          return ClassTypeList.NOT_STARTED === schedule.status;
        case ClassTypeList.IN_PROGRESS:
          return ClassTypeList.IN_PROGRESS === schedule.status;

        default:
          return true;
      }
    });
  };

  if (loading) {
    return <TaskSkeleton />;
  }

  const filteredClasses = getFilteredClasses();

  return (
    <Container className="">
      <div className="flex relative flex-col justify-between lg:flex-row">
        {/* Main Content */}
        <div className="w-full lg:w-[70%]">
          {/* Daily Activity Card */}
          <Card
            variant="outlined"
            className="flex relative mt-10 flex-col py-10 justify-between"
          >
            {/* Header */}
            <div>
              <Typography variant="body" color="muted-alt">
                {readableDate(new Date(weekAndDay.date))}
              </Typography>
              <Typography variant="heading2" as="h3" className="font-extrabold">
                Today{" "}
              </Typography>
            </div>
            {todaysClass &&
            Object.keys(todaysClass).length > 0 &&
            todaysClass._id ? (
              <ClassCard
                _id={todaysClass._id}
                type="class"
                topic={todaysClass.topic}
                week={todaysClass.weekNumber}
                lecture={todaysClass.lectureNumber}
                date={todaysClass.lectureStartDate}
                status={todaysClass.status}
                attendance={todaysClass.attendance}
                recordedUrl={todaysClass.recordedUrl}
              />
            ) : (
              <div className="w-full h-[200px] flex justify-center items-center flex-col">
                <Typography color="secondary2" as="h3" variant="heading">
                  You have no class today.
                </Typography>
                <Typography color="primaryGradient" variant="subheading2">
                  Be sure to catch up on your daily activity{" "}
                </Typography>
              </div>
            )}
          </Card>

          {/* Daily Activity Card */}
          <Card
            variant="outlined"
            className="flex relative flex-col mt-10 py-10 justify-between"
          >
            {/* Header */}
            <div>
              <Typography variant="body" color="muted-alt">
                Upcoming{" "}
              </Typography>
              <Typography variant="heading2" as="h3" className="font-extrabold">
                This Week{" "}
              </Typography>
            </div>
            {/* Scrollable Class List */}
            <div className="flex mt-10 scrollable-div pr-5 w-full overflow-scroll">
              {classesThisWeek.map((schedule) => (
                <ClassCard
                  key={schedule._id}
                  type="class"
                  topic={schedule.topic}
                  date={schedule.lectureStartDate}
                  alignment="vertical"
                  week={schedule.weekNumber}
                  attendance={schedule.attendance}
                  lecture={0}
                  status={ClassTypeList.ALL}
                  recordedUrl={schedule.recordedUrl}
                  _id={schedule._id}
                />
              ))}
            </div>
          </Card>

          {/* Upcoming Week Card */}
          <Card
            variant="outlined"
            className="flex flex-col mt-10 py-10 justify-between"
          >
            {/* Header */}
            <div>
              <Typography variant="heading2" as="h3" className="font-extrabold">
                All Classes{" "}
              </Typography>
            </div>
            <div className="flex mt-5 items-center">
              {classTypeArr.map((classAction, index) => (
                <div
                  className={`mr-3 p-3 ${
                    classAction === selected
                      ? "bg-[#EBEDF5] rounded-[32px] px-4"
                      : ""
                  } cursor-pointer`}
                  onClick={() => setSelected(classAction)}
                >
                  <Typography
                    key={index}
                    variant="body"
                    color="muted-alt"
                    className="font-extrabold"
                  >
                    {classAction}{" "}
                  </Typography>
                </div>
              ))}
            </div>
            {/* Class List */}
            <div className="flex flex-col mt-10">
              {filteredClasses.map((schedule) => (
                <div className="my-3">
                  {" "}
                  <ClassCard
                    key={schedule._id}
                    type="class"
                    topic={schedule.topic}
                    date={schedule.lectureStartDate}
                    alignment={isMobile ? "vertical" : "horizontal"}
                    week={schedule.weekNumber}
                    attendance={schedule.attendance}
                    lecture={0}
                    status={ClassTypeList.ALL}
                    recordedUrl={schedule.recordedUrl}
                    _id={schedule._id}
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="w-full mt-10 lg:mt-0 lg:w-[28%] h-fit">
          {/* Catch Up Card */}
          {weekNumberByProgress < weekAndDay.week && (
            <CatchUpDiv weekNumberByProgress={weekNumberByProgress} />
          )}
          {/* Goals Section */}
          <div className="mt-10">
            {goals && <ClassGoalCard goals={goals} />}
          </div>{" "}
        </div>
      </div>
    </Container>
  );
}
export default StudentClass;
