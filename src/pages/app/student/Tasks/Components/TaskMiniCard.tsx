import { Cup } from "../../../../../assets";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { Typography } from "../../../../../components/Typography";
import { TASK_TYPE } from "../../../../../constants";
import { MODAL_ID } from "../../../../../Layouts/ModalLayouts";

type Props = {
  taskType: string;
  _id: string;
};

function TaskMiniCard({ taskType, _id }: Props) {
  const { showModal } = useModal();

  const viewTask = () => {
    if (taskType === TASK_TYPE.QUIZ) {
      showModal(MODAL_ID.QUIZ_MODAL, { taskId: _id });
    } else if (taskType === TASK_TYPE.ASSIGNMENT) {
      showModal(MODAL_ID.ASSIGNMENT_MODAL, { taskId: _id });
    } else if (taskType === TASK_TYPE.PEER) {
      showModal(MODAL_ID.VIEW_PEER, { taskId: _id });
    }
  };
  return (
    <div
      onClick={viewTask}
      className="rounded-[50px] flex justify-center items-center relative w-[48%] h-[200px] md:w-[220px] bg-[#424242]"
    >
      <div className="flex-[.15] bg-white w-fit px-5 py-3 top-5 left-5 shadow-sm rounded-[23px] absolute flex items-center">
        <div className="w-4 h-4 rounded-full bg-secondaryOrange" />
        <Typography variant="caption" color="secondary" className="ml-1">
          {taskType}
        </Typography>
      </div>
      <img src={Cup} className="w-[180px]" />
    </div>
  );
}

export default TaskMiniCard;
