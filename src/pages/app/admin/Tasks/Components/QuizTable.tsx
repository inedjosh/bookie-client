import { QuizType } from "../../../../../types";
import Table from "../../../../../components/Table";
import { MODAL_ID } from "../../../../../Layouts/ModalLayouts";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { readableDate } from "../../../../../Utils/Helpers";
import { Typography } from "../../../../../components/Typography";

type Props = {
  data: QuizType[];
};

type QuizTypeTable = {
  _id: string;
  topic: string;
  courseName: string;
  createdAt: string;
};

function QuizTable({ data }: Props) {
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
      label: "View Quiz",
      onClick: (row: QuizTypeTable) =>
        showModal(MODAL_ID.VIEW_QUIZ, {
          quizId: row._id,
        }),
    },

    {
      label: "Delete Quiz",
      onClick: (row: QuizTypeTable) =>
        showModal(MODAL_ID.DELETE_QUIZ, {
          quizId: row._id,
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

export default QuizTable;
