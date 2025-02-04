import { CourseType } from "../../../../../types";
import Table from "../../../../../components/Table";
import { MODAL_ID } from "../../../../../Layouts/ModalLayouts";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { readableDate } from "../../../../../Utils/Helpers";
import { Typography } from "../../../../../components/Typography";

type Props = {
  data: CourseType[];
};

type CourseTableType = {
  _id: string;
  title: string;
  durationInMonths: number;
  category: string;
  language: string;
  courseCode: string;
  createdAt: string;
};

function CourseTable({ data }: Props) {
  const { showModal } = useModal();

  const filteredData = data.map((course) => {
    return {
      _id: course._id,
      title: course.title,
      durationInMonths: course.durationInMonths,
      category: course.category,
      language: course.language,
      courseCode: course.courseCode,
      createdAt: readableDate(new Date(course.createdAt)),
    };
  });

  const actions = [
    {
      label: "View Details",
      onClick: (row: CourseTableType) =>
        showModal(MODAL_ID.COURSE_DETAILS_MODAL, {
          courseId: row._id,
        }),
    },
    {
      label: "Edit Course",
      onClick: (row: CourseTableType) =>
        showModal(MODAL_ID.EDIT_COURSE, { courseId: row._id }),
    },
    {
      label: "Delete Course",
      onClick: (row: CourseTableType) =>
        showModal(MODAL_ID.DELETE_COURSE, { courseId: row._id }),
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

export default CourseTable;
