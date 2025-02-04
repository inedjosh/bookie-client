import Card from "../../../../../components/Card";
import { Typography } from "../../../../../components/Typography";
import { Button } from "../../../../../components/Buttons";
import { ClassTypeList, IMG_LIST } from "../../../../../constants";
import { formatDateWithNumbers } from "../../../../../Utils/Helpers";
import { updateData } from "../../../../../Utils/fetch";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { useState } from "react";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { MODAL_ID } from "../../../../../Layouts/ModalLayouts";
import { AttendanceType, StudentDetailsType } from "../../../../../types";
import { setReload } from "../../../../../redux/slices/uiActions.slice";
import { Calendar, Cap, ColorStar, Star } from "../../../../../assets";

type Props = {
  _id: string;
  type: "mini-class";
  alignment?: "horizontal" | "vertical";
  topic: string;
  activity: string;
  week: number;
  date: string;
  link?: string;
  status: ClassTypeList;
  attendance: AttendanceType[];
  recordedUrl: string;
  students: StudentDetailsType[];
  lead: StudentDetailsType;
};

function MiniClassCard({
  _id,
  activity,
  topic,
  date,
  link,
  status,
  attendance,
  alignment = "vertical",
  recordedUrl,
}: Props) {
  const randomImage = IMG_LIST[Math.floor(Math.random() * IMG_LIST.length)];
  const { user } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(false);
  const { showModal } = useModal();
  const dispatch = useDispatch();

  // Convert date to a Date object

  // Determine button text and visibility based on the time difference
  let buttonText = "";
  if (status === ClassTypeList.COMPLETED) {
    buttonText = "Re-watch"; // If the class is in the past (2 hours ahead of lecture start)
  } else if (status === ClassTypeList.IN_PROGRESS) {
    buttonText = "Join"; // If the class is within 2 hours from now
  } else {
    buttonText = "Not Started"; // If the class is in the future
  }

  const joinClass = async () => {
    try {
      setLoading(true);
      if (status === ClassTypeList.COMPLETED) {
        if (!recordedUrl) {
          showModal(MODAL_ID.CLASS_NOT_AVAILABLE);
        } else {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const response = await updateData<any>(
            `mini-class/${user?._id}/student/${_id}/attendance?joined=late`,
            {},
            false
          );
          window.open(recordedUrl, "_blank");
          if (response?.data?.pointsAwarded > 0) {
            showModal(MODAL_ID.POINT_MODAL, {
              point: response?.data?.pointsAwarded,
              activity: "Mini-Class",
            });
          }
        }
      } else if (status === ClassTypeList.IN_PROGRESS) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await updateData<any>(
          `mini-class/${user?._id}/student/${_id}/attendance?joined=early`,
          {},
          false
        );
        window.open(link, "_blank");
        if (response?.data?.pointsAwarded > 0) {
          showModal(MODAL_ID.POINT_MODAL, {
            point: response?.data?.pointsAwarded,
            activity: "Class",
          });
        }
      }
    } finally {
      setLoading(false);
      dispatch(setReload(true));
    }
  };

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
                Mini-Class
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
                      {formatDateWithNumbers(date)}
                    </Typography>
                  </div>
                  <div className="flex items-center ml-4">
                    <img src={ColorStar} className="w-5" />
                    <Typography
                      variant="caption"
                      color="muted-alt"
                      className="pl-1"
                    >
                      {attendance.length
                        ? attendance.find(
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
                      {activity}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex-[.28] mt-5 ">
              <Button
                loading={loading}
                disabled={loading}
                onClick={joinClass}
                variant="default"
              >
                <Typography variant="caption"> {buttonText}</Typography>{" "}
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
              <img src={Cap} className="w-full object-cover h-full" />
            </div>
            <div className="flex-[.7] flex flex-col justify-between py-1  h-[90px]  ml-4">
              <Typography variant="body" fontWeight="bold" className="pt-2">
                {topic}
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
                    {formatDateWithNumbers(date)}
                  </Typography>
                </div>
                <div className="flex items-center ml-4">
                  <img src={ColorStar} className="w-5" />

                  <Typography
                    variant="caption"
                    color="muted-alt"
                    className="pl-1"
                  >
                    {attendance.length
                      ? attendance.find(
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
                    {activity}
                  </Typography>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-[.15] flex items-center">
            <div className="w-4 h-4 rounded-full bg-secondaryOrange" />
            <Typography variant="caption" color="secondary" className="ml-1">
              Mini-Class
            </Typography>
          </div>
          <div onClick={joinClass} className="flex-[.15] flex items-center">
            <Typography
              variant="caption"
              color="secondary2"
              className="uppercase"
            >
              {loading ? "..." : buttonText}
            </Typography>
          </div>
        </Card>
      )}
    </>
  );
}

export default MiniClassCard;
