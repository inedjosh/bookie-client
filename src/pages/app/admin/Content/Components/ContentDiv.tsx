import { useEffect, useState } from "react";
import { Typography } from "../../../../../components/Typography";
import SearchContent from "./SearchContent";
import { AxiosContentType } from "../../../../../types";
import { RootState } from "../../../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setReload } from "../../../../../redux/slices/uiActions.slice";
import ContentTable from "./ContentTable";
import Pagination from "../../../../../components/Pagination";
import { fetchData } from "../../../../../Utils/fetch";
import CourseSkeleton from "../../../admin/Courses/Components/CourseSkeleton";

function ContentDiv() {
  const [contents, setContent] = useState<AxiosContentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const { reload } = useSelector((state: RootState) => state.uiActions);

  useEffect(() => {
    const getContent = async () => {
      try {
        const response = await fetchData<AxiosContentType>(
          `/course-content?page=${currentPage}`
        );

        setContent(response.data || null);
      } finally {
        setLoading(false);
        dispatch(setReload(false));
      }
    };

    getContent();
  }, [currentPage, reload]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <CourseSkeleton />;
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <Typography variant="subheading2">
          Showing {contents?.data.length}/{contents?.totalItems}
        </Typography>
        <div className="flex flex-col mt-3 md:mt-0 md:flex-row">
          <div className="flex flex-col mt-3 md:mt-0 md:flex-row">
            <SearchContent
              page={currentPage}
              setData={(data: AxiosContentType | null) =>
                setContent(data || null)
              }
            />
          </div>
        </div>
      </div>
      <div>
        <ContentTable data={contents?.data || []} />
      </div>
      {contents?.data.length ? (
        <div>
          <Pagination
            totalPages={contents?.totalPages || 0}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      ) : null}
    </>
  );
}

export default ContentDiv;
