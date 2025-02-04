import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { fetchData } from "../../../../../Utils/fetch";
import { AxiosAssignmentType } from "../../../../../types";
import { setReload } from "../../../../../redux/slices/uiActions.slice";
import TaskSkeleton from "./TaskSkeleton";
import { Typography } from "../../../../../components/Typography";
import Pagination from "../../../../../components/Pagination";
import AssignmentTable from "./AssignmentTable";
import SearchAdminAssignments from "./SearchAssignment";

function AssignmentDiv() {
  const [assignments, setAssignments] = useState<AxiosAssignmentType | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const { reload } = useSelector((state: RootState) => state.uiActions);

  useEffect(() => {
    const getCourses = async () => {
      try {
        const response = await Promise.all([
          fetchData<AxiosAssignmentType>(`/assignment?page=${currentPage}`),
        ]);

        setAssignments(response[0].data || null);
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
          Showing {assignments?.data.length}/{assignments?.totalItems}
        </Typography>
        <div className="flex flex-col mt-3 md:mt-0 md:flex-row">
          <div className="flex flex-col mt-3 md:mt-0 md:flex-row">
            <SearchAdminAssignments
              page={currentPage}
              setData={(data: AxiosAssignmentType | null) =>
                setAssignments(data || null)
              }
            />
          </div>
        </div>
      </div>
      <div>
        <AssignmentTable data={assignments?.data || []} />
      </div>
      {assignments?.data.length ? (
        <div>
          <Pagination
            totalPages={assignments?.totalPages || 0}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      ) : null}
    </>
  );
}

export default AssignmentDiv;
