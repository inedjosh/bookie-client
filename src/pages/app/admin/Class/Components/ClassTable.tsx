import { ClassType } from "../../../../../types";
import Table from "../../../../../components/Table";
import { MODAL_ID } from "../../../../../Layouts/ModalLayouts";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { readableDateTime } from "../../../../../Utils/Helpers";
import { Typography } from "../../../../../components/Typography";
import { ClassTypeList } from "../../../../../constants";

type Props = {
  data: ClassType[];
};

type ClassTypeTable = {
  _id: string;
  week: number;
  cohort: string;
  lectureDate: string;
  topic: string;
  isScheduled: string;
  status: ClassTypeList;
};

function ClassTable({ data }: Props) {
  const { showModal } = useModal();

  const filteredData = data.map((schedule) => {
    return {
      _id: schedule._id,
      week: schedule.weekNumber,
      cohort: schedule.cohort.cohortName,
      topic: schedule.topic,
      lectureDate: `${readableDateTime(schedule.lectureStartDate).date} - ${
        readableDateTime(schedule.lectureStartDate).time
      } `,
      isScheduled: schedule.isScheduled ? "Scheduled" : "Not Scheduled",
      status: schedule.status,
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
