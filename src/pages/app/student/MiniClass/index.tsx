import { useEffect, useState } from "react";
import Container from "../../../../components/Container";
import { Typography } from "../../../../components/Typography";
import {
  AxiosWeekAndDayType,
  GoalOverviewType,
  MiniClassType,
} from "../../../../types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { fetchData } from "../../../../Utils/fetch";
import { setReload } from "../../../../redux/slices/uiActions.slice";
import TaskSkeleton from "../Class/Components/TaskSkeleton";
import MiniClassOverviewCard from "./Component/MiniClassOverviewCard";
import MiniClassCard from "./Component/MiniClassCard";
import { ClassTypeList } from "../../../../constants";
import Card from "../../../../components/Card";
import { calculateCurrentWeek, readableDate } from "../../../../Utils/Helpers";
import useIsMobile from "../../../../components/Hooks/UseIsMobile";
import CatchUpDiv from "../../../../components/CatchUpDiv";

const classTypeArr = [
  ClassTypeList.ALL,
  ClassTypeList.COMPLETED,
  ClassTypeList.IN_PROGRESS,
  ClassTypeList.NOT_STARTED,
];

function StudentMiniClass() {
  const [weeklyMiniCLass, setWeeklyMiniClass] = useState<MiniClassType | null>(
    null
  );
  const [miniClasses, setMiniClasses] = useState<MiniClassType[] | null>([]);
  const [selected, setSelected] = useState<ClassTypeList>(ClassTypeList.ALL);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { reload } = useSelector((state: RootState) => state.uiActions);
  const { cohort, user } = useSelector((state: RootState) => state.auth);
  const [goals, setGoal] = useState<GoalOverviewType | null>(null);
  const [weekNumberByProgress, setWeekNumberByProgress] = useState(0);
  const [weekAndDay, setWeekAndDay] = useState({
    date: "",
    day: 0,
    week: 0,
  });
  const [todaysMiniClasses, setTodaysMiniClass] =
    useState<MiniClassType | null>(null);

  const isMobile = useIsMobile();

  useEffect(() => {
    const getCourses = async () => {
      try {
        const response = await Promise.all([
          fetchData<MiniClassType[]>(
            `/mini-class/${cohort?._id}/cohort/${user._id}/student`
          ),
          fetchData<MiniClassType>(
            `/mini-class/${cohort?._id}/cohort/${user._id}/weekly`
          ),
          fetchData<GoalOverviewType>(`user/goals/${user._id}`),
          fetchData<AxiosWeekAndDayType>(
            `cohort/${cohort?._id}/current-week-day`
          ),
          fetchData<MiniClassType>(
            `mini-class/${cohort?._id}/cohort/${user._id}/today`
          ),
        ]);

        setMiniClasses(response[0].data || []);
        setWeeklyMiniClass(response[1].data || null);
        setGoal(response[2].data || null);
        setWeekAndDay({
          date: response[3].data?.currentDay || "",
          day: response[3].data?.day || 0,
          week: response[3].data?.week || 0,
        });
        setTodaysMiniClass(response[4].data || null);
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
    if (!miniClasses?.length) return [];

    return miniClasses.filter((schedule) => {
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

  const filteredClasses = getFilteredClasses();

  if (loading) {
    return <TaskSkeleton />;
  }

  return (
    <Container className="">
      <div className="flex relative flex-col justify-between lg:flex-row">
        {/* Main Content */}
        <div className="w-full lg:w-[70%]">
          {/* Daily Activity Card */}
          <Card
            variant="outlined"
            className="flex relative flex-col mt-10  py-10 justify-between"
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
            {todaysMiniClasses &&
            Object.keys(todaysMiniClasses).length > 0 &&
            todaysMiniClasses._id ? (
              <MiniClassCard
                _id={todaysMiniClasses._id}
                type="mini-class"
                topic={todaysMiniClasses.topic}
                activity={todaysMiniClasses.activity}
                date={todaysMiniClasses.date}
                status={todaysMiniClasses.status}
                attendance={todaysMiniClasses.attendance}
                week={todaysMiniClasses.weekNumber}
                recordedUrl={todaysMiniClasses.recordedUrl}
                students={todaysMiniClasses.students}
                lead={todaysMiniClasses.lead}
              />
            ) : (
              <div className="w-full h-[200px] flex justify-center items-center flex-col">
                <Typography color="secondary2" as="h3" variant="heading">
                  You have no Mini-Class today.
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
                Upcoming
              </Typography>
              <Typography variant="heading2" as="h3" className="font-extrabold">
                This Week
              </Typography>
            </div>

            {/* Scrollable Class List */}
            <div className="flex mt-10 scrollable-div pr-5 w-full overflow-scroll">
              {weeklyMiniCLass ? (
                <MiniClassCard
                  key={weeklyMiniCLass._id}
                  topic={weeklyMiniCLass.topic}
                  date={weeklyMiniCLass.date}
                  alignment="vertical"
                  week={weeklyMiniCLass.weekNumber}
                  attendance={weeklyMiniCLass.attendance}
                  status={ClassTypeList.ALL}
                  recordedUrl={weeklyMiniCLass.recordedUrl}
                  _id={weeklyMiniCLass._id}
                  type={"mini-class"}
                  activity={""}
                  students={weeklyMiniCLass.students}
                  lead={weeklyMiniCLass.lead}
                />
              ) : null}
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
                All Mini-Classes
              </Typography>
            </div>
            <div className="flex mt-5 items-center">
              {classTypeArr.map((classAction, index) => (
                <div
                  className={`mr-3 p-2 ${
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
                  <MiniClassCard
                    key={schedule._id}
                    type="mini-class"
                    topic={schedule.topic}
                    date={schedule.date}
                    alignment={isMobile ? "vertical" : "horizontal"}
                    week={schedule.weekNumber}
                    attendance={schedule.attendance}
                    status={ClassTypeList.ALL}
                    recordedUrl={schedule.recordedUrl}
                    _id={schedule._id}
                    activity={schedule.activity}
                    students={schedule.students}
                    lead={schedule.lead}
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
          <div className="flex-[.2] mt-10 h-fit">
            {goals && <MiniClassOverviewCard goals={goals} />}
          </div>
        </div>
      </div>
    </Container>
  );
}
export default StudentMiniClass;
