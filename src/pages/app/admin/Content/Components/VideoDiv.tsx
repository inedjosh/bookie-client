import { useEffect, useState } from "react";
import { Typography } from "../../../../../components/Typography";
import { AxiosVideoType } from "../../../../../types";
import { RootState } from "../../../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setReload } from "../../../../../redux/slices/uiActions.slice";
import Pagination from "../../../../../components/Pagination";
import { fetchData } from "../../../../../Utils/fetch";
import CourseSkeleton from "../../../admin/Courses/Components/CourseSkeleton";
import VideoTable from "./VideoTable";
import SearchVideos from "./SearchVideos";

function VideoDiv() {
  const [videos, setVideos] = useState<AxiosVideoType | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const { reload } = useSelector((state: RootState) => state.uiActions);

  useEffect(() => {
    const getContent = async () => {
      try {
        const response = await fetchData<AxiosVideoType>(
          `/video?page=${currentPage}`
        );
        console.log(response.data);
        setVideos(response.data || null);
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
          Showing {videos?.data.length}/{videos?.totalItems}
        </Typography>
        <div className="flex flex-col mt-3 md:mt-0 md:flex-row">
          <div className="flex flex-col mt-3 md:mt-0 md:flex-row">
            <SearchVideos
              page={currentPage}
              setData={(data: AxiosVideoType | null) => setVideos(data || null)}
            />
          </div>
        </div>
      </div>
      <div>
        <VideoTable data={videos?.data || []} />
      </div>
      {videos?.data.length ? (
        <div>
          <Pagination
            totalPages={videos?.totalPages || 0}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      ) : null}
    </>
  );
}

export default VideoDiv;
