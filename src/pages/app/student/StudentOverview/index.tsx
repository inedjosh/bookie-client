import { useSelector } from "react-redux";
import Card from "../../../../components/Card";
import Container from "../../../../components/Container";
import { Typography } from "../../../../components/Typography";
import { RootState } from "../../../../redux/store";
import CircularProgressWithLabel from "../../../../components/ProgressBar";
import { TbBrandZoom, TbClipboardCheck } from "react-icons/tb";
import { GoTasklist } from "react-icons/go";
import CourseGoalCard from "./Components/CourseGoalCard";
import TaskCard from "./Components/TaskCard";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { fetchData } from "../../../../Utils/fetch";
import {
  AxiosContentType,
  AxiosWeekAndDayType,
  ClassType,
  ContentType,
  GoalOverviewType,
  MiniClassType,
  TaskType,
} from "../../../../types";
import { StudentOverviewSkeleton } from "../../../../Layouts/Skeleton";
import { calculateCurrentWeek, readableDate } from "../../../../Utils/Helpers";
import { IoAlertCircleOutline } from "react-icons/io5";
import Tooltip from "@mui/material/Tooltip";
import { IconButton } from "@mui/material";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import useIsMobile from "../../../../components/Hooks/UseIsMobile";
import CatchUpDiv from "../../../../components/CatchUpDiv";
import ClassCard from "./Components/ClassCard";
import MiniClassCard from "../MiniClass/Component/MiniClassCard";
import ContentCard from "../Content/Components/ContentCard";

function StudentOverview() {
  const { user, cohort } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [weekAndDay, setWeekAndDay] = useState({
    date: "",
    day: 0,
    week: 0,
  });
  const [todaysClass, setTodaysClass] = useState<ClassType | null>(null);
  const [todaysMiniClasses, setTodaysMiniClass] =
    useState<MiniClassType | null>(null);
  const [goal, setGoal] = useState<GoalOverviewType | null>(null);
  const [WeeklyContents, setWeeklyContent] = useState<ContentType[] | []>([]);
  const [todaysContents, setTodaysContent] = useState<ContentType[] | []>([]);
  const [weeklyTasks, setWeeklyTasks] = useState<TaskType[] | []>([]);
  const [weeklyClasses, setWeeklyClasses] = useState<ClassType[] | []>([]);
  const [weeklyMiniClasses, setWeeklyMiniClasses] =
    useState<MiniClassType | null>(null);
  const [todaysTasks, setTodaysTasks] = useState<TaskType[] | []>([]);
  const [weekNumberByProgress, setWeekNumberByProgress] = useState(0);

  const scrollableDivRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const response = await Promise.all([
          fetchData<AxiosWeekAndDayType>(
            `cohort/${cohort?._id}/current-week-day`
          ),
          fetchData<ClassType>(`class/${cohort?._id}/today/${user._id}`),
          fetchData<MiniClassType>(
            `mini-class/${cohort?._id}/cohort/${user._id}/today`
          ),
          fetchData<GoalOverviewType>(`user/goals/${user._id}`),
          fetchData<AxiosContentType>(
            `/course-content/${cohort?._id}/today/${user._id}`
          ),
          fetchData<TaskType[]>(`/task/${cohort?._id}/today/${user._id}`),
          fetchData<TaskType[]>(`/task/${cohort?._id}/weekly/${user._id}`),
          fetchData<ContentType[]>(
            `/course-content/${cohort?._id}/weekly/${user._id}`
          ),
          fetchData<ClassType[]>(`/class/${cohort?._id}/weekly/${user._id}`),
          fetchData<MiniClassType>(
            `/mini-class/${cohort?._id}/cohort/${user._id}/weekly`
          ),
        ]);

        setWeekAndDay({
          date: response[0].data?.currentDay || "",
          day: response[0].data?.day || 0,
          week: response[0].data?.week || 0,
        });

        setTodaysClass(response[1].data || null);
        setTodaysMiniClass(response[2].data || null);
        setGoal(response[3].data);
        setTodaysContent(response[4]?.data?.data || []);
        setTodaysTasks(response[5].data || []);
        setWeeklyClasses(response[8].data || []);
        setWeeklyMiniClasses(response[9].data || null);
        setWeeklyContent(response[7].data || []);
        setWeeklyTasks(response[6].data || []);
      } finally {
        setLoading(false);
      }
    };

    if (cohort?._id) getData();
  }, [cohort?._id]);

  useEffect(() => {
    if (user) {
      console.log({ user });
      const week = calculateCurrentWeek(user.totalScore);
      console.log({ week });
      setWeekNumberByProgress(week);
    }
  }, [user]);

  console.log({
    weeklyTasks,
    weeklyClasses,
    weeklyMiniClasses,
    WeeklyContents,
  });

  const calculateWeeklyProgress = () => {
    const classProgress = ((goal?.classTotalCount.weekly || 0) / 2) * 100;
    const contentProgress = ((goal?.contentTotalCount.weekly || 0) / 7) * 100;
    const taskProgress = ((goal?.taskTotalCount.weekly || 0) / 7) * 100;

    const weeklyProgress = (classProgress + contentProgress + taskProgress) / 3;
    return weeklyProgress;
  };

  const scrollRight = () => {
    if (scrollableDivRef.current) {
      scrollableDivRef.current.scrollBy({
        left: 100, // Positive value to scroll right
        behavior: "smooth", // Smooth scrolling
      });
    }
  };

  const scrollLeft = () => {
    if (scrollableDivRef.current) {
      scrollableDivRef.current.scrollBy({
        left: -100, // Negative value to scroll left
        behavior: "smooth", // Smooth scrolling
      });
    }
  };

  // Check if the div is at the start
  const handleScroll = () => {
    if (scrollableDivRef.current) {
      setIsAtStart(scrollableDivRef.current.scrollLeft === 0);
    }
  };

  // Attach scroll listener to the div
  useEffect(() => {
    const scrollableDiv = scrollableDivRef.current;

    if (scrollableDiv) {
      scrollableDiv.addEventListener("scroll", handleScroll);

      // Cleanup the event listener on unmount
      return () => {
        scrollableDiv.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  if (loading) {
    return <StudentOverviewSkeleton />;
  }

  return (
    <Container>
      <div className="flex flex-col lg:flex-row justify-between">
        <div className=" lg:w-[70%]">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div className="flex-[.4]">
              <Typography as="h2" variant="heading" className="capitalize">
                Hello, {user.firstName} {user.lastName}
              </Typography>
              <Typography
                variant="body"
                color="muted-alt"
                className="capitalize"
              >
                Welcome to training, Hope you have a wonderful day today{" "}
              </Typography>
            </div>
            <Card
              className="flex justify-between  bg-border lg:flex-[.4] w-full items-center mt-5 lg:mt-0 "
              variant="muted"
            >
              <div className="flex flex-[.2] justify-center items-center flex-col">
                <Typography
                  variant="caption"
                  color="muted-alt"
                  className="capitalize"
                >
                  Day
                </Typography>
                <Typography variant="heading" as="h1" className="capitalize">
                  <span className=" ml-2 text-black">{weekAndDay.day}</span>
                </Typography>
              </div>
              <div className="h-5 border border-muted-alt" />
              <div className="flex flex-[.2] justify-center items-center flex-col">
                <Typography
                  variant="caption"
                  color="muted-alt"
                  className="capitalize"
                >
                  Week
                </Typography>
                <Typography variant="heading" as="h1" className="capitalize">
                  <span className=" mr-3 text-black">{weekAndDay.week}</span>
                </Typography>
              </div>
              <div className="h-5 border border-muted-alt" />
              <div className="flex flex-[.3] items-center flex-col">
                <Typography
                  variant="caption"
                  color="muted-alt"
                  className="capitalize"
                >
                  Progress
                </Typography>
                {weekNumberByProgress < weekAndDay.week ? (
                  <Tooltip title="Complete any pending tasks to unlock your weekly progress insights and stay on track.">
                    <IconButton>
                      <IoAlertCircleOutline className="text-4xl cursor-pointer text-black" />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <CircularProgressWithLabel
                    value={calculateWeeklyProgress()}
                  />
                )}
              </div>
            </Card>
          </div>

          <Card
            variant="outlined"
            className="flex relative flex-col mt-10 py-10 justify-between"
          >
            <div>
              <Typography variant="caption" color="muted-alt">
                {readableDate(new Date(weekAndDay.date))}
              </Typography>
              <Typography
                variant="heading2"
                as="h3"
                className=" font-extrabold"
              >
                Daily activity
              </Typography>
            </div>
            <div
              ref={scrollableDivRef}
              className="flex mt-10 scrollable-div pr-5  w-[100%] overflow-scroll "
            >
              {todaysClass &&
                Object.keys(todaysClass).length > 0 &&
                todaysClass._id && (
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
                )}

              {todaysMiniClasses &&
                Object.keys(todaysMiniClasses).length > 0 &&
                todaysMiniClasses._id && (
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
                )}

              {todaysTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  type={"task"}
                  topic={task.title}
                  deadline={task.dueDate}
                  alignment={"vertical"}
                  week={task.weekNumber}
                  taskCompletion={task.taskCompletion}
                  _id={task._id}
                />
              ))}
              {todaysContents.map((content) => (
                <ContentCard
                  key={content._id}
                  _id={content._id}
                  type={content.contentType}
                  topic={content.title}
                  week={content.weekNumber}
                  participation={content.participation}
                  contentType={content.contentType}
                  scheduleDate={content.scheduleDate}
                />
              ))}

              {!(
                (todaysClass &&
                  Object.keys(todaysClass).length > 0 &&
                  todaysClass._id) ||
                (todaysMiniClasses &&
                  Object.keys(todaysMiniClasses).length > 0 &&
                  todaysMiniClasses._id) ||
                (todaysTasks && todaysTasks.length > 0) ||
                (todaysContents && todaysContents.length > 0)
              ) && (
                <div className="flex justify-center items-center w-full pb-10">
                  <Typography variant="subheading" color="primary" as="h3">
                    No activities available for today.
                  </Typography>
                </div>
              )}

              {((todaysClass &&
                Object.keys(todaysClass).length > 0 &&
                todaysClass._id) ||
                (todaysMiniClasses &&
                  Object.keys(todaysMiniClasses).length > 0 &&
                  todaysMiniClasses._id) ||
                (todaysTasks && todaysTasks.length > 0) ||
                (todaysContents && todaysContents.length > 0)) &&
                isAtStart && (
                  <div
                    onClick={scrollLeft}
                    className=" w-12 h-12 absolute bg-white left-[-2%] top-[50%] flex justify-center items-center rounded-full border "
                  >
                    <SlArrowLeft className="text-black " size="20px" />
                  </div>
                )}
              {((todaysClass &&
                Object.keys(todaysClass).length > 0 &&
                todaysClass._id) ||
                (todaysMiniClasses &&
                  Object.keys(todaysMiniClasses).length > 0 &&
                  todaysMiniClasses._id) ||
                (todaysTasks && todaysTasks.length > 0) ||
                (todaysContents && todaysContents.length > 0)) &&
                isAtStart && (
                  <div
                    onClick={scrollRight}
                    className=" w-12 h-12 absolute bg-white right-[-2%] top-[50%] flex justify-center items-center rounded-full border "
                  >
                    <SlArrowRight className="text-black " size="20px" />
                  </div>
                )}
            </div>
          </Card>
          <Card
            variant="outlined"
            className="flex flex-col mt-10 py-10 justify-between"
          >
            <div>
              <Typography variant="caption" color="muted-alt">
                Upcoming
              </Typography>
              <Typography variant="heading2" as="h3" className="font-extrabold">
                This Week
              </Typography>
            </div>
            <div className=" mt-10">
              {weeklyTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  type={"task"}
                  topic={task.title}
                  deadline={task.dueDate}
                  alignment={isMobile ? "vertical" : "horizontal"}
                  week={task.weekNumber}
                  taskCompletion={task.taskCompletion}
                  _id={task._id}
                />
              ))}
              {WeeklyContents.map((content) => (
                <ContentCard
                  key={content._id}
                  _id={content._id}
                  type={content.contentType}
                  topic={content.title}
                  week={content.weekNumber}
                  participation={content.participation}
                  contentType={content.contentType}
                  scheduleDate={content.scheduleDate}
                  alignment={isMobile ? "vertical" : "horizontal"}
                />
              ))}
              {weeklyClasses.map((weeklyClass) => (
                <ClassCard
                  _id={weeklyClass._id}
                  type="class"
                  topic={weeklyClass.topic}
                  week={weeklyClass.weekNumber}
                  lecture={weeklyClass.lectureNumber}
                  date={weeklyClass.lectureStartDate}
                  status={weeklyClass.status}
                  attendance={weeklyClass.attendance}
                  recordedUrl={weeklyClass.recordedUrl}
                  alignment={isMobile ? "vertical" : "horizontal"}
                />
              ))}
              {weeklyMiniClasses &&
                Object.keys(weeklyMiniClasses).length > 0 &&
                weeklyMiniClasses._id && (
                  <MiniClassCard
                    _id={weeklyMiniClasses._id}
                    type="mini-class"
                    topic={weeklyMiniClasses.topic}
                    activity={weeklyMiniClasses.activity}
                    date={weeklyMiniClasses.date}
                    status={weeklyMiniClasses.status}
                    attendance={weeklyMiniClasses.attendance}
                    week={weeklyMiniClasses.weekNumber}
                    recordedUrl={weeklyMiniClasses.recordedUrl}
                    students={weeklyMiniClasses.students}
                    lead={weeklyMiniClasses.lead}
                    alignment={isMobile ? "vertical" : "horizontal"}
                  />
                )}
            </div>
          </Card>
        </div>

        <div className=" mt-10 lg:mt-0 lg:w-[28%]">
          {weekNumberByProgress < weekAndDay.week ? (
            <CatchUpDiv weekNumberByProgress={weekNumberByProgress} />
          ) : null}
          <Card variant="outlined" className="flex-[.3]  py-10 mt-5 lg:mt-10">
            <Typography variant="subheading" as="h3">
              Course Goal
            </Typography>
            <Typography variant="caption" color="muted-alt" className="mt-3">
              Track your course goals and monitor your progress along the way.
            </Typography>
            <CourseGoalCard
              title="Contents"
              icon={<TbClipboardCheck className="text-2xl" />}
              buttonText="Explore"
              progress={goal?.contentTotalCount.overall ?? 0}
              goalNumber={goal?.total.content.course || 0}
              onClick={() => navigate("/student/content")}
              bg="bg-[#EBE6FD]"
              circleBg="bg-[#5B53FC]"
            />
            <CourseGoalCard
              title="Classes"
              icon={<TbBrandZoom className="text-2xl" />}
              buttonText="Explore"
              progress={goal?.classTotalCount.overall ?? 0}
              goalNumber={goal?.total.class.course || 0}
              onClick={() => navigate("/student/class")}
              bg="bg-[#FFE5F3]"
              circleBg="bg-[#F94E97]"
            />
            <CourseGoalCard
              title="Task"
              icon={<GoTasklist className="text-2xl" />}
              buttonText="Explore"
              progress={goal?.taskTotalCount.overall ?? 0}
              goalNumber={goal?.total.task.course || 0}
              onClick={() => navigate("/student/tasks")}
              bg="bg-[#FCE9DC]"
              circleBg="bg-[#FD9346]"
            />
            <CourseGoalCard
              title="Mini Class"
              icon={<GoTasklist className="text-2xl" />}
              buttonText="Explore"
              progress={goal?.miniClassTotalCount.overall ?? 0}
              goalNumber={goal?.total.miniClass.course || 0}
              onClick={() => navigate("/student/mini-class")}
              bg="bg-[#DDEBF8]"
              circleBg="bg-[#4198FB]"
            />
          </Card>
        </div>
      </div>
    </Container>
  );
}
export default StudentOverview;
