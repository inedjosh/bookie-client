import Card from "../../../../../components/Card";
import { Typography } from "../../../../../components/Typography";
import { Button } from "../../../../../components/Buttons";
import { ContentTypeList, IMG_LIST } from "../../../../../constants";
import { AttendanceType } from "../../../../../types";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { Calendar, ColorStar, Cup, Star } from "../../../../../assets";
import { formatDateWithNumbers } from "../../../../../Utils/Helpers";
import { useNavigate } from "react-router-dom";

type Props = {
  _id: string;
  type: string;
  alignment?: "horizontal" | "vertical";
  topic: string;
  week: number;
  participation: AttendanceType[];
  contentType: ContentTypeList;
  scheduleDate: string;
};
function ContentCard({
  _id,
  topic,
  participation,
  scheduleDate,
  alignment = "vertical",
  contentType,
}: // contentUrl,
Props) {
  const navigate = useNavigate();
  const randomImage = IMG_LIST[Math.floor(Math.random() * IMG_LIST.length)];
  const { user } = useSelector((state: RootState) => state.auth);
  const userHasViewedContent = participation.filter(
    (participation) => participation.studentId == user._id
  );

  return (
    <>
      {alignment === "vertical" ? (
        <Card
          variant="outlined"
          className="w-full mr-5 md:w-[450px] my-2 md:mr-2"
        >
          <div className="relative w-full  object-cover h-[300px] md:h-[400px] rounded-[32px]">
            <img
              src={randomImage}
              className="w-full  object-cover h-full rounded-[32px]"
            />
            <div className="flex-[.15] bg-white w-fit px-5 py-3 top-5 right-5 shadow-sm rounded-[23px] absolute flex items-center">
              <div className="w-4 h-4 rounded-full bg-secondaryOrange" />
              <Typography variant="caption" color="secondary" className="ml-1">
                {contentType}
              </Typography>
            </div>
          </div>
          <div className="flex flex-col md:flex-row mt-3">
            <div className="flex flex-[.7]">
              <div>
                <Typography
                  variant="body"
                  color="blackText"
                  fontWeight="bold"
                  className="py-1  truncate"
                >
                  <strong> {topic}</strong>{" "}
                </Typography>
                <div className="flex mt-2 items-center">
                  <div className="flex items-center">
                    <img src={Calendar} className="w-5" />

                    <Typography
                      variant="caption"
                      color="muted-alt"
                      className="pl-1"
                      fontWeight="bold"
                    >
                      {scheduleDate ? formatDateWithNumbers(scheduleDate) : ""}
                    </Typography>
                  </div>
                  <div className="flex items-center ml-4">
                    <img src={ColorStar} className="w-5" />
                    <Typography
                      variant="caption"
                      color="muted-alt"
                      className="pl-1"
                    >
                      {participation.length
                        ? participation.find(
                            (schedule) => schedule.studentId === user._id
                          )?.point
                        : "-"}{" "}
                      Pts
                    </Typography>
                  </div>
                  <div className="flex items-center ml-4">
                    <img src={Star} className="w-5" />

                    <Typography
                      variant="caption"
                      color="muted-alt"
                      className="pl-1"
                    >
                      {contentType}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex-[.28] mt-5 ">
              <Button
                onClick={() => {
                  navigate(
                    contentType === ContentTypeList.ARTICLE
                      ? `/student/content/article/${_id}`
                      : `/student/content/video/${_id}`
                  );
                }}
                variant="default"
              >
                <Typography variant="caption">
                  {userHasViewedContent.length ? "Continue" : "View"}
                </Typography>{" "}
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Card
          variant="outlined"
          className="flex w-full h-full justify-between mt-1 items-center"
        >
          <div className="flex-[.7] h-full flex items-center">
            <div className="w-[100px] rounded-[24px] bg-secondaryBlue ">
              <img src={Cup} className="w-full object-cover h-full" />
            </div>
            <div className="flex-[.7] flex flex-col justify-between py-1  h-[90px]  ml-4">
              <Typography variant="body" fontWeight="bold" className="pt-2">
                <strong> {topic}</strong>{" "}
              </Typography>
              <div className="flex mt-3 items-center ">
                <div className="flex items-center">
                  <img src={Calendar} className="w-5" />

                  <Typography
                    variant="caption"
                    color="muted-alt"
                    className="pl-1"
                    fontWeight="bold"
                  >
                    {scheduleDate ? formatDateWithNumbers(scheduleDate) : ""}
                  </Typography>
                </div>
                <div className="flex items-center ml-4">
                  <img src={ColorStar} className="w-5" />

                  <Typography
                    variant="caption"
                    color="muted-alt"
                    className="pl-1"
                  >
                    {participation.length
                      ? participation.find(
                          (schedule) => schedule.studentId === user._id
                        )?.point
                      : "-"}{" "}
                    Pts
                  </Typography>
                </div>
                <div className="flex items-center ml-4">
                  <img src={Star} className="w-5" />

                  <Typography
                    variant="caption"
                    color="muted-alt"
                    className="pl-1"
                  >
                    {contentType}
                  </Typography>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-[.15] flex items-center">
            <div className="w-4 h-4 rounded-full bg-secondaryOrange" />
            <Typography variant="caption" color="secondary" className="ml-1">
              Resources
            </Typography>
          </div>
          <div
            onClick={() => {
              navigate(
                contentType === ContentTypeList.ARTICLE
                  ? `/student/content/article/${_id}`
                  : `/student/content/video/${_id}`
              );
            }}
            className="flex-[.15] flex items-center"
          >
            <Typography
              variant="caption"
              color="secondary2"
              className="uppercase"
            >
              {userHasViewedContent.length ? "Continue" : "View"}
            </Typography>
          </div>
        </Card>
      )}
    </>
  );
}

export default ContentCard;
