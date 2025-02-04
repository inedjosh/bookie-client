import { useEffect, useState } from "react";
import Container from "../../../../components/Container";
import Pagination from "../../../../components/Pagination";
import { Typography } from "../../../../components/Typography";
import { AxiosClassType, AxiosMiniClassType } from "../../../../types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { fetchData } from "../../../../Utils/fetch";
import { setReload } from "../../../../redux/slices/uiActions.slice";
import TaskSkeleton from "./Components/TaskSkeleton";

import ClassActions from "./Components/ClassAction";
import { CLASS_TYPES } from "../../../../constants";
import ClassTable from "./Components/ClassTable";
import MiniClassTable from "./Components/MiniClassTable";
import SearchClass from "./Components/SearchClass";
import SearchMiniClass from "./Components/SearchMiniClass";

function Class() {
  const [classes, setClasses] = useState<AxiosClassType | null>(null);
  const [miniClasses, setMiniClasses] = useState<AxiosMiniClassType | null>(
    null
  );

  const [classType, setClassType] = useState(CLASS_TYPES.CLASS);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const { reload } = useSelector((state: RootState) => state.uiActions);

  useEffect(() => {
    const getCourses = async () => {
      try {
        const response = await Promise.all([
          fetchData<AxiosClassType>(`/class?page=${currentPage}`),
          fetchData<AxiosMiniClassType>(`/mini-class?page=${currentPage}`),
        ]);

        console.log(response[1]);
        setClasses(response[0].data || null);
        setMiniClasses(response[1].data || null);
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
  console.log({ miniClasses });
  if (loading) {
    return <TaskSkeleton />;
  }

  return (
    <Container className="">
      {/* <TaskOverview
        totalTask={tasks?.totalItems || 0}
        totalSubmittedTask={analytics.totalSubmittedTask}
        totalCompletedTask={analytics.totalCompletedTask}
        totalEnrolledStudents={analytics.totalEnrolledStudents}
      /> */}
      <ClassActions
        setClass={(classType: CLASS_TYPES) => setClassType(classType)}
      />
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        {classType === CLASS_TYPES.CLASS ? (
          <Typography variant="subheading2">
            Showing {classes?.data.length}/{classes?.totalItems}
          </Typography>
        ) : (
          <Typography variant="subheading2">
            Showing {miniClasses?.data ? miniClasses?.data?.length : "0"}/
            {miniClasses?.totalItems}
          </Typography>
        )}
        <div className="flex flex-col mt-3 md:mt-0 md:flex-row">
          <div className="flex flex-col mt-3 md:mt-0 md:flex-row">
            {classType === CLASS_TYPES.CLASS ? (
              <SearchClass
                page={currentPage}
                setData={(data: AxiosClassType | null) =>
                  setClasses(data || null)
                }
              />
            ) : (
              <SearchMiniClass
                page={currentPage}
                setData={(data: AxiosMiniClassType | null) =>
                  setMiniClasses(data || null)
                }
              />
            )}
          </div>
        </div>
      </div>
      <div>
        {classType === CLASS_TYPES.CLASS ? (
          <ClassTable data={classes?.data || []} />
        ) : (
          <MiniClassTable data={miniClasses?.data || []} />
        )}
      </div>

      {classType === CLASS_TYPES.CLASS ? (
        classes?.data && (
          <div>
            <Pagination
              totalPages={classes?.totalPages || 0}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        )
      ) : miniClasses?.data && miniClasses?.data.length ? (
        <Pagination
          totalPages={miniClasses?.totalPages || 0}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      ) : null}
    </Container>
  );
}
export default Class;
