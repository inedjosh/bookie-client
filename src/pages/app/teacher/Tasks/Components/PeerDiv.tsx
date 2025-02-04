import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { fetchData } from "../../../../../Utils/fetch";
import { AxiosPeerType } from "../../../../../types";
import { setReload } from "../../../../../redux/slices/uiActions.slice";
import TaskSkeleton from "./TaskSkeleton";
import { Typography } from "../../../../../components/Typography";
import Pagination from "../../../../../components/Pagination";
import PeerTable from "./PeerTable";
import SearchPeer from "./SearchPeer";

function PeerDiv() {
  const [peers, setPeers] = useState<AxiosPeerType | null>(null);

  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const { reload } = useSelector((state: RootState) => state.uiActions);
  const { cohort } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const getCourses = async () => {
      try {
        const response = await Promise.all([
          fetchData<AxiosPeerType>(
            `/peer/${cohort?.course._id}/course?page=${currentPage}`
          ),
        ]);

        setPeers(response[0].data || null);
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
          Showing {peers?.data.length}/{peers?.totalItems}
        </Typography>
        <div className="flex flex-col mt-3 md:mt-0 md:flex-row">
          <div className="flex flex-col mt-3 md:mt-0 md:flex-row">
            <SearchPeer
              page={currentPage}
              setData={(data: AxiosPeerType | null) => setPeers(data || null)}
              courseId={cohort?.course._id || ""}
            />
          </div>
        </div>
      </div>
      <div>
        <PeerTable data={peers?.data || []} />
      </div>
      {peers?.data.length ? (
        <div>
          <Pagination
            totalPages={peers?.totalPages || 0}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      ) : null}
    </>
  );
}

export default PeerDiv;
