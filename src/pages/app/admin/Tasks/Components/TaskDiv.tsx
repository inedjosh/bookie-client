import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { fetchData } from "../../../../../Utils/fetch";
import { AxiosTaskType } from "../../../../../types";
import { setReload } from "../../../../../redux/slices/uiActions.slice";
import TaskSkeleton from "./TaskSkeleton";
import { Typography } from "../../../../../components/Typography";
import SearchTask from "./SearchTask";
import TaskTable from "./TaskTable";
import Pagination from "../../../../../components/Pagination";

function TaskDiv() {
  const [tasks, setTasks] = useState<AxiosTaskType | null>(null);

  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const { reload } = useSelector((state: RootState) => state.uiActions);

  useEffect(() => {
    const getCourses = async () => {
      try {
        const response = await Promise.all([
          fetchData<AxiosTaskType>(`/task?page=${currentPage}`),
          //   fetchData<AxiosAnalyticsType>(`/task/${cohort?._id}/analytics`),
        ]);

        setTasks(response[0].data || null);
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
    return <TaskSkeleton />;
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <Typography variant="subheading2">
          Showing {tasks?.data.length}/{tasks?.totalItems}
        </Typography>
        <div className="flex flex-col mt-3 md:mt-0 md:flex-row">
          <div className="flex flex-col mt-3 md:mt-0 md:flex-row">
            <SearchTask
              page={currentPage}
              setData={(data: AxiosTaskType | null) => setTasks(data || null)}
              //   cohortId={cohort?._id || ""}
            />
          </div>
        </div>
      </div>
      <div>
        <TaskTable data={tasks?.data || []} />
      </div>
      {tasks?.data.length ? (
        <div>
          <Pagination
            totalPages={tasks?.totalPages || 0}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      ) : null}
    </>
  );
}

export default TaskDiv;
