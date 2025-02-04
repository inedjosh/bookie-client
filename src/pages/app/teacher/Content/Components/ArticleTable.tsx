import { ArticleType } from "../../../../../types";
import Table from "../../../../../components/Table";
import { MODAL_ID } from "../../../../../Layouts/ModalLayouts";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { Typography } from "../../../../../components/Typography";
import { readableDate } from "../../../../../Utils/Helpers";

type Props = {
  data: ArticleType[];
};

type ArticleTypeTable = {
  _id: string;
  topic: string;
  courseName: string;
  createdAt: string;
};

function ArticleTable({ data }: Props) {
  const { showModal } = useModal();

  const filteredData = data.map((data) => {
    return {
      _id: data._id,
      topic: data.topic,
      courseName: data.course.name,
      createdAt: readableDate(data.createdAt),
    };
  });

  const actions = [
    {
      label: "View Details",
      onClick: (row: ArticleTypeTable) =>
        showModal(MODAL_ID.VIEW_ARTICLE_DETAILS, {
          articleId: row._id,
        }),
    },
    {
      label: "Edit Article",
      onClick: (row: ArticleTypeTable) =>
        showModal(MODAL_ID.EDIT_ARTICLE, {
          articleId: row._id,
        }),
    },
    {
      label: "Delete Article",
      onClick: (row: ArticleTypeTable) =>
        showModal(MODAL_ID.DELETE_ARTICLE, {
          articleId: row._id,
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

export default ArticleTable;
