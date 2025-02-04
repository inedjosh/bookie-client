import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Typography } from "../../../components/Typography";
import { readableDate } from "../../../Utils/Helpers";
import { GoalOverviewType } from "../../../types";
import { useEffect, useState } from "react";
import { fetchData } from "../../../Utils/fetch";
import { ACCOUNT_TYPES } from "../../../constants";
import ProfileSkeleton from "./Component/Skeleton";
import { ProfileFrame, ProgressLoading, Star, Trophy } from "../../../assets";
import { useNavigate } from "react-router-dom";
import { IoIosClose } from "react-icons/io";
import { RiHomeSmile2Fill } from "react-icons/ri";
import EvaluationCard from "./Component/EvaluationCard";
import { IoChevronForward } from "react-icons/io5";

interface CategoryTotal {
  course: number;
  week: number;
  month: number;
}

interface TotalData {
  class: CategoryTotal;
  task: CategoryTotal;
  miniClass: CategoryTotal;
  content: CategoryTotal;
}

interface ProgressResult {
  goalsCovered: number;
  totalGoals: number;
  percentage: number;
}

function Profile() {
  const { user, cohort } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const [goal, setGoal] = useState<GoalOverviewType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const response = await Promise.all([
          fetchData<GoalOverviewType>(`user/goals/${user._id}`),
        ]);

        setGoal(response[0].data || null);
      } finally {
        setLoading(false);
      }
    };

    if (cohort?._id && user.role === ACCOUNT_TYPES.STUDENT) getData();
  }, [cohort?._id]);

  function calculateProgress(
    data: GoalOverviewType | null
  ): Record<string, ProgressResult> {
    const categories: (keyof TotalData)[] = [
      "class",
      "task",
      "miniClass",
      "content",
    ];
    const progress: Record<string, ProgressResult> = {};

    if (data)
      categories.forEach((category) => {
        const totalGoals = data.total[category].course; // Total goals expected for the course
        const goalsCovered = data.coursePoints[category].totalPoints; // Goals completed so far

        const percentage = (goalsCovered / totalGoals) * 100;

        progress[category] = {
          goalsCovered,
          totalGoals,
          percentage: percentage,
        };
      });

    return progress;
  }

  const progress = calculateProgress(goal);
  console.log(progress);
  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="p-0 mt-0 bg-[#F0F0F0]  ">
      <div className="flex bg-white py-6 px-5 md:px-20 justify-between items-center">
        <div className="flex items-center">
          <div onClick={() => navigate(-1)}>
            <RiHomeSmile2Fill className="text-[#25326A] text-2xl " />
          </div>
          <IoChevronForward className="mx-4 text-[#ACB4D5]" />

          <Typography variant="subheading" className=" text-[#ACB4D5]">
            Profile
          </Typography>
        </div>
        <div onClick={() => navigate(-1)}>
          <IoIosClose size="30px" />
        </div>
      </div>
      <div className="h-[50px]  md:h-[150px] mt-0 p-0 ">
        <img src={ProfileFrame} />
      </div>
      <div className="flex px-3 md:px-10 lg:px-20 flex-col md:flex-row justify-between">
        <div className="flex-[.3] px-3 md:px-5">
          <Typography variant="heading" as="h2">
            Student profile
          </Typography>
          <div className="bg-white flex flex-col justify-center items-center rounded-[32px] mt-5 p-5">
            <div className="bg-secondaryBlue mt-10 w-[130px] h-[130px] rounded-full">
              <img
                src={user.profileUrl}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="mt-5">
              <Typography
                variant="heading2"
                className="font-bold text-center"
                color="secondary2"
              >
                {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="body" color="secondary2">
                {user.email}
              </Typography>
            </div>
            <div className="w-full border-2 mt-10 border-[#F7F7F7]" />
            <div className="mt-10 rounded-[24px] bg-[#F7F7F7] p-3 md:p-5 w-full">
              <div className=" py-4  flex justify-between items-center w-full">
                <Typography variant="caption" color="muted-alt">
                  Course
                </Typography>
                <Typography className="text-right" variant="caption">
                  {cohort?.course.title}
                </Typography>
              </div>
              <hr />
              <div className=" py-4  flex justify-between items-center w-full">
                <Typography variant="caption" color="muted-alt">
                  Start Date
                </Typography>
                <Typography className="text-right" variant="caption">
                  {readableDate(new Date(cohort?.startDate as Date))}
                </Typography>
              </div>
              <hr />
              <div className=" py-4  flex justify-between items-center w-full">
                <Typography variant="caption" color="muted-alt">
                  End Date
                </Typography>
                <Typography className="text-right" variant="caption">
                  {readableDate(new Date(cohort?.endDate as Date))}
                </Typography>
              </div>
              <hr />
              <div className=" py-4  flex justify-between items-center w-full">
                <Typography variant="caption" color="muted-alt">
                  Duration{" "}
                </Typography>
                <Typography className="text-right" variant="caption">
                  3 Months{" "}
                </Typography>
              </div>
              <hr />
              <div className=" py-4  flex justify-between items-center w-full">
                <Typography variant="caption" color="muted-alt">
                  Cohort
                </Typography>
                <Typography className="text-right" variant="caption">
                  {cohort?.cohortName}{" "}
                </Typography>
              </div>
              <hr />
            </div>
            <div className="mt-14 pb-10">
              <Typography
                variant="caption"
                className="text-center"
                color="muted-alt"
              >
                Date Joined{" "}
              </Typography>
              <Typography variant="body" className="font-bold">
                {readableDate(new Date(user.createdAt))}
              </Typography>
            </div>
          </div>
        </div>
        <div className="flex-[.65] px-3 md:px-5 mt-10 md:mt-0">
          <Typography variant="heading" as="h2">
            Performance
          </Typography>
          <div className="bg-white rounded-[32px] mt-5 p-5 md:p-10">
            <div>
              <Typography variant="body">
                Track your progress and stay on top of your learning journey!
                This section gives you a clear overview of how you're performing
                across all assignments, tasks, and peer reviews.
              </Typography>
              <Typography variant="body" className="mt-5">
                <strong className="mt-5">
                  To successfully complete this cohort, aim for a minimum
                  overall average of 70%.
                </strong>
              </Typography>
            </div>
            <div className="flex bg-border w-full p-5 md:p-10 rounded-[24px] mt-10 flex-col">
              <div>
                <Typography variant="heading">52%</Typography>
                <Typography variant="body">Overall Progress</Typography>
              </div>
              <div className="flex items-center mt-10">
                <div className="w-[90%] md:w-[98%]  ">
                  <div className="bg-[#E5F0E5] w-full relative rounded-[100px] h-[14px]">
                    <img
                      src={Star}
                      className="w-8 absolute right-[30%] top-[-8px]"
                    />
                    <div className="w-[40%] absolute z-10 inset-0 bg-[#016F09] rounded-[100px]" />
                    <img
                      src={ProgressLoading}
                      className="absolute left-[40%] inset-0 w-[26%] z-0 h-[14px]"
                    />
                  </div>
                </div>
                <div className="w-[10%] md:w-[5%] ml-3">
                  <img src={Trophy} className="w-10 md:w-8 " />
                </div>
              </div>
            </div>
            <div className="mt-10">
              <Typography variant="subheading2" color="muted-alt">
                Breakdown
              </Typography>
              <div className="mt-5 flex flex-wrap justify-between">
                <EvaluationCard
                  bg="bg-[#EBE6FD]"
                  circleBg="bg-[#5B53FC]"
                  topic="Class Attended"
                  points={goal?.classTotalCount.overall ?? 0}
                  total={goal?.total.class.course || 0}
                />

                <EvaluationCard
                  bg="bg-[#FCE9DC]"
                  circleBg="bg-[#FD9346]"
                  topic="Task completed"
                  points={goal?.taskTotalCount.overall ?? 0}
                  total={goal?.total.task.course || 0}
                />

                <EvaluationCard
                  bg="bg-[#FFE5F3]"
                  circleBg="bg-[#F94E97]"
                  topic="Mini-Class attended"
                  points={goal?.miniClassTotalCount.overall ?? 0}
                  total={goal?.total.miniClass.course || 0}
                />

                <EvaluationCard
                  bg="bg-[#DDEBF8]"
                  circleBg="bg-[#4198FB]"
                  topic="Contents"
                  points={goal?.contentTotalCount.overall ?? 0}
                  total={goal?.total.content.course || 0}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
