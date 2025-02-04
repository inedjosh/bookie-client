import { useEffect, useState } from "react";
import { Typography } from "../../../../../components/Typography";
import { AxiosArticleType } from "../../../../../types";
import { RootState } from "../../../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setReload } from "../../../../../redux/slices/uiActions.slice";
import Pagination from "../../../../../components/Pagination";
import { fetchData } from "../../../../../Utils/fetch";
import CourseSkeleton from "../../../admin/Courses/Components/CourseSkeleton";
import ArticleTable from "./ArticleTable";
import SearchArticles from "./SearchArticle";

function ArticleDiv() {
  const [articles, setArticles] = useState<AxiosArticleType | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const { reload } = useSelector((state: RootState) => state.uiActions);

  useEffect(() => {
    const getContent = async () => {
      try {
        const response = await fetchData<AxiosArticleType>(
          `/article?page=${currentPage}`
        );

        setArticles(response.data || null);
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
          Showing {articles?.data.length}/{articles?.totalItems}
        </Typography>
        <div className="flex flex-col mt-3 md:mt-0 md:flex-row">
          <div className="flex flex-col mt-3 md:mt-0 md:flex-row">
            <SearchArticles
              page={currentPage}
              setData={(data: AxiosArticleType | null) =>
                setArticles(data || null)
              }
            />
          </div>
        </div>
      </div>
      <div>
        <ArticleTable data={articles?.data || []} />
      </div>
      {articles?.data.length ? (
        <div>
          <Pagination
            totalPages={articles?.totalPages || 0}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      ) : null}
    </>
  );
}

export default ArticleDiv;
