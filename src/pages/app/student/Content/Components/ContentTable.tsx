import { ContentType } from "../../../../../types";
import Table from "../../../../../components/Table";
import { MODAL_ID } from "../../../../../Layouts/ModalLayouts";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { Typography } from "../../../../../components/Typography";

type Props = {
  data: ContentType[];
};

type ContentTypeTable = {
  _id: string;
  title: string;
  cohortName: string;
  // contentUrl: string;
  contentType: string;
};

function ContentTable({ data }: Props) {
  const { showModal } = useModal();

  const filteredData = data.map((content) => {
    return {
      _id: content._id,
      title: content.title,
      cohortName: content.cohort.cohortName,
      // contentUrl: content.content,
      contentType: content.contentType,
    };
  });

  const actions = [
    {
      label: "View Details",
      onClick: (row: ContentTypeTable) =>
        showModal(MODAL_ID.CONTENT_DETAILS, {
          contentId: row._id,
        }),
    },
    {
      label: "Edit Content",
      onClick: (row: ContentTypeTable) =>
        showModal(MODAL_ID.EDIT_CONTENT, {
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

export default ContentTable;
