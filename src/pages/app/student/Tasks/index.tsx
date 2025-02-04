import { useEffect, useState } from "react";
import Container from "../../../../components/Container";
import { Typography } from "../../../../components/Typography";
import {
  AxiosWeekAndDayType,
  GoalOverviewType,
  TaskType,
} from "../../../../types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { fetchData } from "../../../../Utils/fetch";
import { setReload } from "../../../../redux/slices/uiActions.slice";
import TaskSkeleton from "./Components/TaskSkeleton";
import TaskGoalCard from "./Components/TaskGoalCard";
import TaskCard from "../StudentOverview/Components/TaskCard";
import useIsMobile from "../../../../components/Hooks/UseIsMobile";
import Card from "../../../../components/Card";
import { calculateCurrentWeek, readableDate } from "../../../../Utils/Helpers";
import TaskMiniCard from "./Components/TaskMiniCard";
import CatchUpDiv from "../../../../components/CatchUpDiv";

function StudentTasks() {
  const [tasks, setTasks] = useState<TaskType[] | []>([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { reload } = useSelector((state: RootState) => state.uiActions);
  const { cohort, user } = useSelector((state: RootState) => state.auth);
  const [todaysTask, setTodaysTask] = useState<TaskType[] | []>([]);
  const [goals, setGoal] = useState<GoalOverviewType | null>(null);
  const [weekNumberByProgress, setWeekNumberByProgress] = useState(0);
  const [weekAndDay, setWeekAndDay] = useState({
    date: "",
    day: 0,
    week: 0,
  });
  const isMobile = useIsMobile();
  const [weeklyTasks, setWeeklyTasks] = useState<TaskType[] | []>([]);

  useEffect(() => {
    const getCourses = async () => {
      try {
        const response = await Promise.all([
          fetchData<TaskType[]>(`/task/${cohort?._id}/cohort/${user._id}`),
          fetchData<TaskType[]>(`/task/${cohort?._id}/today/${user._id}`),
          fetchData<GoalOverviewType>(`user/goals/${user._id}`),
          fetchData<AxiosWeekAndDayType>(
            `cohort/${cohort?._id}/current-week-day`
          ),
          fetchData<TaskType[]>(`/task/${cohort?._id}/weekly/${user._id}`),
        ]);

        setTasks(response[0].data || []);
        setTodaysTask(response[1].data || []);
        setGoal(response[2].data || null);
        setWeekAndDay({
          date: response[3].data?.currentDay || "",
          day: response[3].data?.day || 0,
          week: response[3].data?.week || 0,
        });
        setWeeklyTasks(response[4].data || []);
      } finally {
        setLoading(false);
        dispatch(setReload(false));
      }
    };

    if (cohort?._id) {
      getCourses();
    }
  }, [reload, cohort?._id]);

  useEffect(() => {
    if (user) {
      console.log({ user });
      const week = calculateCurrentWeek(user.totalScore);
      console.log({ week });
      setWeekNumberByProgress(week);
    }
  }, [user]);

  if (loading) {
    return <TaskSkeleton />;
  }

  return (
    <Container className="">
      <div className="flex relative flex-col justify-between lg:flex-row">
        <div className="w-full lg:w-[70%]">
          <Card
            variant="outlined"
            className="flex relative mt-10 flex-col py-10 justify-between"
          >
            <div>
              <Typography variant="body" color="muted-alt">
                {readableDate(new Date(weekAndDay.date))}
              </Typography>
              <Typography variant="heading2" as="h3" className="font-extrabold">
                Today{" "}
              </Typography>
            </div>

            <div className="flex mt-10 scrollable-div pr-5 w-full overflow-scroll">
              {todaysTask ? (
                todaysTask.map((task) => (
                  <TaskCard
                    key={task._id}
                    topic={task.title}
                    alignment="vertical"
                    week={task.weekNumber}
                    _id={task._id}
                    type={task.taskType}
                    deadline={task.dueDate}
                    taskCompletion={task.taskCompletion}
                  />
                ))
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
            </div>
          </Card>

          <Card
            variant="outlined"
            className="flex flex-col mt-10 py-10 justify-between"
          >
            <div>
              <Typography
                variant="body"
                color="muted-alt"
                className="font-extrabold"
              >
                Upcoming
              </Typography>
              <Typography variant="heading2" as="h3" className="font-extrabold">
                This week
              </Typography>
            </div>
            <div className="flex  flex-wrap mt-10">
              {weeklyTasks.map((task) => (
                <div className="my-3 mr-5">
                  <TaskMiniCard _id={task._id} taskType={task.taskType} />
                </div>
              ))}
            </div>
          </Card>
          <Card
            variant="outlined"
            className="flex flex-col mt-10 py-10 justify-between"
          >
            <div>
              <Typography variant="heading2" as="h3" className="font-extrabold">
                All Task{" "}
              </Typography>
            </div>
            <div className="flex  flex-col">
              {tasks.map((task) => (
                <div className="my-3 mr-5">
                  <TaskCard
                    key={task._id}
                    topic={task.title}
                    alignment={isMobile ? "vertical" : "horizontal"}
                    week={task.weekNumber}
                    _id={task._id}
                    type={task.taskType}
                    deadline={task.dueDate}
                    taskCompletion={task.taskCompletion}
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="w-full mt-10 lg:mt-0 lg:w-[28%] h-fit">
          {weekNumberByProgress < weekAndDay.week && (
            <CatchUpDiv weekNumberByProgress={weekNumberByProgress} />
          )}
          <div className="flex-[.2] mt-5 h-fit">
            {goals && <TaskGoalCard goals={goals} />}
          </div>
        </div>
      </div>
    </Container>
  );
}

export default StudentTasks;
