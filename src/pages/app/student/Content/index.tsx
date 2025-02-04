import { useEffect, useRef, useState } from "react";
import Container from "../../../../components/Container";
import { Typography } from "../../../../components/Typography";
import { useDispatch, useSelector } from "react-redux";
import { setReload } from "../../../../redux/slices/uiActions.slice";
import { RootState } from "../../../../redux/store";
import {
  AxiosContentType,
  AxiosWeekAndDayType,
  ContentType,
  GoalOverviewType,
} from "../../../../types";
import { fetchData } from "../../../../Utils/fetch";
import CourseSkeleton from "../../admin/Courses/Components/CourseSkeleton";
import ContentCard from "./Components/ContentCard";
import Card from "../../../../components/Card";
import { ContentListTable } from "./Components/ContentListTable";
import ContentGoalCard from "./Components/ContentGoalCard";
import { ContentTypeList } from "../../../../constants";
import CatchUpDiv from "../../../../components/CatchUpDiv";
import { calculateCurrentWeek } from "../../../../Utils/Helpers";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";

const contentTypeArr = [
  ContentTypeList.ALL,
  ContentTypeList.ARTICLE,
  ContentTypeList.VIDEO,
];

function StudentContent() {
  const [contents, setContent] = useState<
    { id: string; title: string; contents: ContentType[] }[] | null
  >(null);
  const [selected, setSelected] = useState<ContentTypeList>(
    ContentTypeList.ALL
  );

  const [WeeklyContents, setWeeklyContent] = useState<ContentType[] | []>([]);
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

  const scrollableDivRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);

  useEffect(() => {
    const getContent = async () => {
      try {
        const response = await Promise.all([
          fetchData<AxiosContentType>(
            `/course-content/${cohort?._id}/cohort/${user._id}`
          ),
          fetchData<ContentType[]>(
            `/course-content/${cohort?._id}/weekly/${user._id}`
          ),
          fetchData<GoalOverviewType>(`user/goals/${user._id}`),
          fetchData<AxiosWeekAndDayType>(
            `cohort/${cohort?._id}/current-week-day`
          ),
        ]);

        const groupedData: Record<string, ContentType[]> = {};

        response[0].data?.data.forEach((item) => {
          const weekTitle = `Week ${item.weekNumber}`; // Generate the general title

          if (!groupedData[weekTitle]) {
            groupedData[weekTitle] = []; // Initialize the array for this week
          }

          groupedData[weekTitle].push(item); // Push content into the array
        });

        // Format as an array of objects
        const filteredContent = Object.keys(groupedData).map(
          (weekTitle, index) => ({
            id: (index + 1).toString(),
            title: weekTitle,
            contents: groupedData[weekTitle],
          })
        );

        setContent(filteredContent);
        setWeeklyContent(response[1].data || []);
        setGoal(response[2].data || null);
        setWeekAndDay({
          date: response[3].data?.currentDay || "",
          day: response[3].data?.day || 0,
          week: response[3].data?.week || 0,
        });
      } finally {
        setLoading(false);
        dispatch(setReload(false));
      }
    };

    if (cohort?._id) getContent();
  }, [reload, cohort?._id]);

  useEffect(() => {
    if (user) {
      console.log({ user });
      const week = calculateCurrentWeek(user.totalScore);
      console.log({ week });
      setWeekNumberByProgress(week);
    }
  }, [user]);

  const getFilteredContent = () => {
    if (!WeeklyContents?.length) return [];

    return WeeklyContents.filter((content) => {
      switch (selected) {
        case ContentTypeList.VIDEO:
          return ContentTypeList.VIDEO === content.contentType;
        case ContentTypeList.ARTICLE:
          return ContentTypeList.ARTICLE === content.contentType;

        default:
          return true;
      }
    });
  };

  const filteredContent = getFilteredContent();

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
    return <CourseSkeleton />;
  }

  return (
    <Container className="">
      <div className="flex flex-col lg:flex-row justify-between">
        <div className="w-full mr-5 lg:w-[70%]">
          <Card
            variant="outlined"
            className="flex relative mt-10 flex-col py-10 justify-between"
          >
            <div>
              {" "}
              <Typography variant="subheading2" as="h3">
                This week's resources{" "}
              </Typography>
              <div className="flex mt-2 items-center">
                {contentTypeArr.map((contentType, index) => (
                  <div
                    className={`mr-3 p-2 ${
                      contentType === selected
                        ? "bg-[#EBEDF5] rounded-[32px] px-4"
                        : ""
                    } cursor-pointer`}
                    onClick={() => setSelected(contentType)}
                  >
                    <Typography
                      key={index}
                      variant="body"
                      color="muted-alt"
                      className="font-extrabold"
                    >
                      {contentType}
                    </Typography>
                  </div>
                ))}
              </div>
            </div>

            <div
              ref={scrollableDivRef}
              className="flex mt-10 scrollable-div pr-5  w-[100%] overflow-scroll "
            >
              {filteredContent
                ? filteredContent.map((task) => (
                    <div className="w-[450px] mr-5">
                      <ContentCard
                        key={task._id}
                        topic={task.title}
                        alignment="vertical"
                        week={task.weekNumber}
                        _id={task._id}
                        type={task.contentType}
                        participation={task.participation} // deadline={task.dueDate}
                        contentType={task.contentType}
                        scheduleDate={task.scheduleDate} // taskCompletion={task.taskCompletion}
                      />
                    </div>
                  ))
                : null}
              {isAtStart && (
                <div
                  onClick={scrollLeft}
                  className=" w-12 h-12 absolute bg-white left-[-2%] top-[50%] flex justify-center items-center rounded-full border "
                >
                  <SlArrowLeft className="text-black " size="20px" />
                </div>
              )}
              {isAtStart && (
                <div
                  onClick={scrollRight}
                  className=" w-12 h-12 absolute bg-white right-[-2%] top-[50%] flex justify-center items-center rounded-full border "
                >
                  <SlArrowRight className="text-black " size="20px" />
                </div>
              )}
            </div>
          </Card>

          <Card variant="outlined" className="w-full mt-10 p-4">
            <Typography
              variant="heading2"
              as="h3"
              className="font-extrabold my-3"
            >
              Course resources{" "}
            </Typography>
            {contents?.length ? (
              contents.map((section, index) => (
                <ContentListTable
                  key={index}
                  section={section}
                  weekNumber={weekAndDay.week}
                  dayNumber={weekAndDay.day}
                />
              ))
            ) : (
              <div className="w-full h-[300] flex justify-center items-center">
                <Typography variant="body" color="muted-alt">
                  No Content available yet!
                </Typography>
              </div>
            )}
          </Card>
        </div>
        <div className=" mt-20 lg:mt-0 lg:flex-[25%] sticky top-0 h-fit">
          {weekNumberByProgress < weekAndDay.week && (
            <CatchUpDiv weekNumberByProgress={weekNumberByProgress} />
          )}
          <div className="mt-10">
            {goals && <ContentGoalCard goals={goals} />}{" "}
          </div>{" "}
        </div>
      </div>
    </Container>
  );
}
export default StudentContent;
