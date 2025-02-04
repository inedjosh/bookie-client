import { MiniClassType } from "../../../../../types";
import Table from "../../../../../components/Table";
import { MODAL_ID } from "../../../../../Layouts/ModalLayouts";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { readableDate } from "../../../../../Utils/Helpers";
import { Typography } from "../../../../../components/Typography";

type Props = {
  data: MiniClassType[];
};

type MiniClassTypeTable = {
  _id: string;
  topic: string;
  cohort: string;
  scheduledDate: string;
  status: string;
  instructor: string;
};

function MiniClassTable({ data }: Props) {
  const { showModal } = useModal();

  const filteredData = data.map((miniClass) => {
    return {
      _id: miniClass._id,
      topic: miniClass.topic,
      cohort: miniClass.cohort.cohortName,
      scheduledDate: readableDate(new Date(miniClass.date)),
      status: miniClass.status,
      instructor: `${miniClass.instructors[0].firstName} ${miniClass.instructors[0].lastName}`,
    };
  });

  const actions = [
    {
      label: "View Details",
      onClick: (row: MiniClassTypeTable) =>
        showModal(MODAL_ID.CONTENT_DETAILS, {
          contentId: row._id,
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
