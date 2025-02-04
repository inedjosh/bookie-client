import Card from "../../../../../components/Card";
import { Typography } from "../../../../../components/Typography";
import { Button } from "../../../../../components/Buttons";
import { IMG_LIST, TASK_TYPE } from "../../../../../constants";
import { formatDateWithNumbers } from "../../../../../Utils/Helpers";
import { TaskCompletion } from "../../../../../types";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { MODAL_ID } from "../../../../../Layouts/ModalLayouts";
import { Calendar, ColorStar, Cup, Star } from "../../../../../assets";

type Props = {
  _id: string;
  type: string;
  topic: string;
  deadline: string;
  alignment: "horizontal" | "vertical";
  week: number;
  taskCompletion: TaskCompletion[];
};

function TaskCard({
  _id,
  type,
  topic,
  deadline,
  alignment,
  taskCompletion,
}: // week,
Props) {
  const { user } = useSelector((state: RootState) => state.auth);
  const randomImage = IMG_LIST[Math.floor(Math.random() * IMG_LIST.length)];

  const { showModal } = useModal();

  const viewTask = () => {
    if (type === TASK_TYPE.QUIZ) {
      showModal(MODAL_ID.QUIZ_MODAL, { taskId: _id });
    } else if (type === TASK_TYPE.ASSIGNMENT) {
      showModal(MODAL_ID.ASSIGNMENT_MODAL, { taskId: _id });
    } else if (type === TASK_TYPE.PEER) {
      showModal(MODAL_ID.VIEW_PEER, { taskId: _id });
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
                Task
              </Typography>
            </div>
          </div>
          <div className="flex flex-col md:flex-row mt-3">
            <div className="flex flex-[.7]">
              <div>
                <Typography
                  variant="subheading"
                  color="blackText"
                  fontWeight="bold"
                  className="py-1  truncate"
                >
                  {topic}
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
                      {formatDateWithNumbers(deadline)}
                    </Typography>
                  </div>
                  <div className="flex items-center ml-4">
                    <img src={ColorStar} className="w-5" />

                    <Typography
                      variant="caption"
                      color="muted-alt"
                      className="pl-1"
                    >
                      {taskCompletion.length
                        ? taskCompletion.find(
                            (task) => task.studentId === user._id
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
                      {type}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex-[.28] mt-5 ">
              <Button onClick={viewTask} variant="default">
                <Typography variant="caption"> Start Task</Typography>{" "}
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
                    {formatDateWithNumbers(deadline)}
                  </Typography>
                </div>
                <div className="flex items-center ml-4">
                  <img src={ColorStar} className="w-5" />

                  <Typography
                    variant="caption"
                    color="muted-alt"
                    className="pl-1"
                  >
                    {taskCompletion.length
                      ? taskCompletion.find(
                          (task) => task.studentId === user._id
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
                    {type}
                  </Typography>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-[.15] flex items-center">
            <div className="w-4 h-4 rounded-full bg-secondaryOrange" />
            <Typography variant="caption" color="secondary" className="ml-1">
              Task
            </Typography>
          </div>
          <div
            onClick={viewTask}
            className="flex-[.15] cursor-pointer flex items-center"
          >
            <Typography variant="body" color="secondary2" className="uppercase">
              Start Task
            </Typography>
          </div>
        </Card>
      )}
    </>
  );
}

export default TaskCard;
