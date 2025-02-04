import { AssignmentType } from "../../../../../types";
import Table from "../../../../../components/Table";
import { MODAL_ID } from "../../../../../Layouts/ModalLayouts";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { readableDate } from "../../../../../Utils/Helpers";
import { Typography } from "../../../../../components/Typography";

type Props = {
  data: AssignmentType[];
};

type AssignmentTypeTable = {
  _id: string;
  topic: string;
  courseName: string;
  createdAt: string;
};

function AssignmentTable({ data }: Props) {
  const { showModal } = useModal();

  const filteredData = data.map((data) => {
    return {
      _id: data._id,
      topic: data.topic,
      courseName: data.course.name,
      createdAt: readableDate(new Date(data.createdAt)),
    };
  });

  const actions = [
    {
      label: "View Details",
      onClick: (row: AssignmentTypeTable) =>
        showModal(MODAL_ID.VIEW_ASSIGNMENT, {
          assignmentId: row._id,
        }),
    },
    {
      label: "Edit Assignment",
      onClick: (row: AssignmentTypeTable) =>
        showModal(MODAL_ID.EDIT_ASSIGNMENT, {
          assignmentId: row._id,
        }),
    },
    {
      label: "Delete Assignment",
      onClick: (row: AssignmentTypeTable) =>
        showModal(MODAL_ID.DELETE_ASSIGNMENT, {
          assignmentId: row._id,
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

export default AssignmentTable;
