import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { fetchData } from "../../../../../Utils/fetch";
import { AxiosQuizType } from "../../../../../types";
import { setReload } from "../../../../../redux/slices/uiActions.slice";
import TaskSkeleton from "./TaskSkeleton";
import { Typography } from "../../../../../components/Typography";
import Pagination from "../../../../../components/Pagination";
import QuizTable from "./QuizTable";
import SearchAdminQuiz from "../SearchQuiz";

function QuizDiv() {
  const [quiz, setQuiz] = useState<AxiosQuizType | null>(null);

  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const { reload } = useSelector((state: RootState) => state.uiActions);

  useEffect(() => {
    const getCourses = async () => {
      try {
        const response = await Promise.all([
          fetchData<AxiosQuizType>(`/quiz?page=${currentPage}`),
        ]);

        setQuiz(response[0].data || null);
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
          Showing {quiz?.data.length}/{quiz?.totalItems}
        </Typography>
        <div className="flex flex-col mt-3 md:mt-0 md:flex-row">
          <div className="flex flex-col mt-3 md:mt-0 md:flex-row">
            <SearchAdminQuiz
              page={currentPage}
              setData={(data: AxiosQuizType | null) => setQuiz(data || null)}
            />
          </div>
        </div>
      </div>
      <div>
        <QuizTable data={quiz?.data || []} />
      </div>
      {quiz?.data.length ? (
        <div>
          <Pagination
            totalPages={quiz?.totalPages || 0}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      ) : null}
    </>
  );
}

export default QuizDiv;
