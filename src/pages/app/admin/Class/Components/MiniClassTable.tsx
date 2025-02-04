import { MiniClassType } from "../../../../../types";
import Table from "../../../../../components/Table";
import { MODAL_ID } from "../../../../../Layouts/ModalLayouts";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { readableDate, readableDateTime } from "../../../../../Utils/Helpers";
import { Typography } from "../../../../../components/Typography";
import { ClassTypeList } from "../../../../../constants";

type Props = {
  data: MiniClassType[];
};

type MiniClassTypeTable = {
  _id: string;
  topic: string;
  cohort: string;
  scheduledDate: string;
  status: ClassTypeList;
  instructor: string;
  totalStudents: number;
  date: string;
  activity: string;
  teamLead: string;
  isScheduled: string;
};

function MiniClassTable({ data }: Props) {
  const { showModal } = useModal();

  const filteredData = data.map((miniClass) => {
    return {
      _id: miniClass._id,
      topic: miniClass.topic,
      cohort: miniClass.cohort.cohortName,
      scheduledDate: readableDate(new Date(miniClass.date)),
      teamLead: `${miniClass.lead.firstName} ${miniClass.lead.lastName}`,
      totalStudents: miniClass.cohort.totalStudentEnrollment,
      isScheduled: miniClass.isScheduled ? "Schedule" : "Not Scheduled",
      activity: miniClass.activity,
      status: miniClass.status,
      date: `${readableDateTime(miniClass.startTime).date} ${
        readableDateTime(miniClass.startTime).time
      } `,
      instructor: `${
        miniClass?.instructors[0]?.firstName
          ? miniClass?.instructors[0]?.firstName
          : ""
      } ${
        miniClass?.instructors[0]?.lastName
          ? miniClass?.instructors[0]?.lastName
          : ""
      }`,
    };
  });

  const actions = [
    {
      label: "View Details",
      onClick: (row: MiniClassTypeTable) =>
        showModal(MODAL_ID.VIEW_MINI_CLASS, {
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

export default MiniClassTable;
