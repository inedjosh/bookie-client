import { ClassType } from "../../../../../types";
import Table from "../../../../../components/Table";
import { MODAL_ID } from "../../../../../Layouts/ModalLayouts";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { readableDateTime } from "../../../../../Utils/Helpers";
import { Typography } from "../../../../../components/Typography";

type Props = {
  data: ClassType[];
};

type ClassTypeTable = {
  _id: string;
  week: number;
  cohort: string;
  lectureDate: string;
  content: string;
  task: string;
};

function ClassTable({ data }: Props) {
  const { showModal } = useModal();

  const filteredData = data.map((schedule) => {
    return {
      _id: schedule._id,
      week: schedule.weekNumber,
      cohort: schedule.cohort.cohortName,
      lectureDate: `${
        readableDateTime(new Date(schedule.lectureStartDate)).date
      } ${readableDateTime(new Date(schedule.lectureStartDate)).time}`,
      content: schedule.content.title,
      task: schedule.task.title,
    };
  });

  const actions = [
    {
      label: "View Details",
      onClick: (row: ClassTypeTable) =>
        showModal(MODAL_ID.VIEW_CLASS, {
          classId: row._id,
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

export default ClassTable;
