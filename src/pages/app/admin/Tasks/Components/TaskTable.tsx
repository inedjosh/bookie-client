import { TaskType } from "../../../../../types";
import Table from "../../../../../components/Table";
import { MODAL_ID } from "../../../../../Layouts/ModalLayouts";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { readableDate } from "../../../../../Utils/Helpers";
import { Typography } from "../../../../../components/Typography";

type Props = {
  data: TaskType[];
};

type TaskTypeTable = {
  _id: string;
  title: string;
  cohort: string;
  dueDate: string;
  numberOfSubmissions: number;
  taskType: string;
  submissionType: string;
  isScheduled: string;
};

function TaskTable({ data }: Props) {
  const { showModal } = useModal();

  const filteredData = data.map((task) => {
    return {
      _id: task._id,
      title: task.title,
      cohort: task.cohort.cohortName,
      dueDate: readableDate(new Date(task.dueDate)),
      numberOfSubmissions: task.taskCompletion.length,
      submissionType: task.submissionType,
      taskType: task.taskType,
      isScheduled: task.isUpdated ? "Scheduled" : "Not Scheduled",
    };
  });

  const actions = [
    {
      label: "View Details",
      onClick: (row: TaskTypeTable) =>
        showModal(MODAL_ID.TASK_DETAILS, {
          taskId: row._id,
        }),
    },
  ];
  return filteredData.length ? (
    <Table data={filteredData} actions={actions} hiddenFields={["_id"]} />
  ) : (
    <div className="w=full h-[300px] flex justify-center items-center">
      <Typography>No data found</Typography>
    </div>
  );
}

export default TaskTable;
