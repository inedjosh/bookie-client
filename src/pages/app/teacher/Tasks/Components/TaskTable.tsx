import { TaskType } from "../../../../../types";
import Table from "../../../../../components/Table";
import { MODAL_ID } from "../../../../../Layouts/ModalLayouts";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { Typography } from "../../../../../components/Typography";
import { TASK_TYPE } from "../../../../../constants";

type Props = {
  data: TaskType[];
};

type TaskTypeTable = {
  _id: string;
  title: string;
  cohort: string;
  submissionType: string;
  taskType: TASK_TYPE;
  numberOfSubmissions: number;
  status: string;
};

function TaskTable({ data }: Props) {
  const { showModal } = useModal();

  const filteredData = data.map((task) => {
    return {
      _id: task._id,
      title: task.title,
      cohort: task.cohort.cohortName,
      submissionType: task.submissionType,
      taskType: task.taskType,
      numberOfSubmissions: task.taskCompletion.length,
      status: task.isUpdated ? "Scheduled" : "Not Scheduled",
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
    {
      label: "Edit Task",
      onClick: (row: TaskTypeTable) =>
        showModal(MODAL_ID.EDIT_TASK, {
          taskId: row._id,
        }),
    },
    {
      label: "View Submissions",
      onClick: (row: TaskTypeTable) =>
        showModal(MODAL_ID.VIEW_TASK_SUBMISSION, {
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
