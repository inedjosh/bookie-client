import { CohortType } from "../../../../../types";
import Table from "../../../../../components/Table";
import { MODAL_ID } from "../../../../../Layouts/ModalLayouts";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { Typography } from "../../../../../components/Typography";
import { readableDate } from "../../../../../Utils/Helpers";

type Props = {
  data: CohortType[];
};

type CohortTableType = {
  _id: string;
  cohortName: string;
  cohortCode: string;
  lectureDayOne: string;
  lectureDayTwo: string;
  duration: string;
  course: string;
  teachers: string;
  status: string;
  scheduled: string;
};

function CohortTable({ data }: Props) {
  const { showModal } = useModal();

  const filteredData = data.map((cohort) => ({
    _id: cohort._id,
    cohortName: cohort.cohortName,
    cohortCode: cohort.cohortCode,
    lectureDayOne: `${cohort?.lectures[0]?.day} ${cohort?.lectures[0]?.time}`,
    lectureDayTwo: cohort.lectures[1]
      ? `${cohort?.lectures[1]?.day} ${cohort?.lectures[1]?.time}`
      : "N/A",
    duration: `${readableDate(new Date(cohort.startDate))}  - ${readableDate(
      new Date(cohort.endDate)
    )}`,
    course: cohort.course.title,
    teachers: cohort.teachers[0]
      ? `${cohort?.teachers[0]?.firstName} ${cohort?.teachers[0]?.lastName}`
      : "N/A",
    status: cohort.status,
    scheduled: cohort.hasSchedule ? "Created" : "Pending",
  }));

  const getActions = (row: CohortTableType) => {
    return [
      {
        label: "View Details",
        onClick: () =>
          showModal(MODAL_ID.COHORT_DETAILS, { cohortId: row._id }),
        visible: true, // Always show
      },
      {
        label: "Edit Cohort",
        onClick: () => showModal(MODAL_ID.EDIT_COHORT, { cohortId: row._id }),
        visible: row.status === "active", // Show only if cohort is active
      },
      {
        label: "Assign Teacher",
        onClick: () =>
          showModal(MODAL_ID.ASSIGN_TEACHER, { cohortId: row._id }),
        visible: row.teachers == "N/A", // Show if no teacher is assigned
      },
      {
        label: "Create Schedule",
        onClick: () =>
          showModal(MODAL_ID.CREATE_SCHEDULE, { cohortId: row._id }),
        visible: row.scheduled === "Pending", // Show if no teacher is assigned
      },
      {
        label: "Create Mini Classes",
        onClick: () =>
          showModal(MODAL_ID.CREATE_MINI_CLASS, { cohortId: row._id }),
        visible: true, // Show if no teacher is assigned
      },
      {
        label: "Start Cohort",
        onClick: () => showModal(MODAL_ID.START_COHORT, { cohortId: row._id }),
        visible: row.status !== "active", // Hide if cohort is archived
      },
      {
        label: "Delete Cohort",
        onClick: () => showModal(MODAL_ID.DELETE_COHORT, { cohortId: row._id }),
        visible: row.status == "active", // Hide if cohort is archived
      },
    ].filter((action) => action.visible); // Filter out invisible actions
  };

  return filteredData.length ? (
    <Table data={filteredData} getActions={getActions} hiddenFields={["_id"]} />
  ) : (
    <div className="w-full h-[300px] flex justify-center items-center">
      <Typography>No data found</Typography>
    </div>
  );
}

export default CohortTable;
