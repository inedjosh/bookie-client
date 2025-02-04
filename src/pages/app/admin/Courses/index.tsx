import { useEffect, useState } from "react";
import Container from "../../../../components/Container";
import Pagination from "../../../../components/Pagination";
import { Typography } from "../../../../components/Typography";
import { AxiosCourseType } from "../../../../types";
import { fetchData } from "../../../../Utils/fetch";
import CourseSkeleton from "./Components/CourseSkeleton";
import CourseTable from "./Components/CourseTable";
import SearchCourses from "./Components/SearchCourses";
import CourseOverviewCard from "./Components/CourseOverviewCard";
import { Button } from "../../../../components/Buttons";
import { useModal } from "../../../../components/Modal/ModalProvider";
import { MODAL_ID } from "../../../../Layouts/ModalLayouts";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { setReload } from "../../../../redux/slices/uiActions.slice";

function Courses() {
  const { showModal } = useModal();
  const [courses, setCourses] = useState<AxiosCourseType | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const { reload } = useSelector((state: RootState) => state.uiActions);

  useEffect(() => {
    const getCourses = async () => {
      try {
        const response = await fetchData<AxiosCourseType>(
          `/admin/course?page=${currentPage}`
        );

        setCourses(response.data || null);
      } finally {
        setLoading(false);
        dispatch(setReload(false));
      }
    };

    getCourses();
  }, [currentPage, reload]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <CourseSkeleton />;
  }

  return (
    <Container className="">
      <div className="flex md:justify-end flex-col md:flex-row">
        <div className="w-[200px]">
          {" "}
          <Button
            onClick={() =>
              showModal(MODAL_ID.CREATE_COURSE, {
                reload: () => setReload(true),
              })
            }
            variant="default"
          >
            Create Course
          </Button>
        </div>
      </div>
      <CourseOverviewCard
        totalCourses={courses?.data.length || 0}
        totalEnrollment={0}
        completionRate={0}
      />
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <Typography variant="subheading2">
          Showing {courses?.data.length}/{courses?.totalItems}
        </Typography>
        <div className="flex flex-col mt-3 md:mt-0 md:flex-row">
          <SearchCourses
            page={currentPage}
            setData={(data: AxiosCourseType | null) => setCourses(data || null)}
          />
        </div>
      </div>
      <div>
        <CourseTable data={courses?.data || []} />
      </div>
      {courses?.data.length ? (
        <div>
          <Pagination
            totalPages={courses?.totalPages || 0}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      ) : null}
    </Container>
  );
}

export default Courses;
