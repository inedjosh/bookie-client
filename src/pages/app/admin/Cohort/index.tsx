import { useEffect, useState } from "react";
import Container from "../../../../components/Container";
import Pagination from "../../../../components/Pagination";
import { Typography } from "../../../../components/Typography";
import { MODAL_ID } from "../../../../Layouts/ModalLayouts";
import { useModal } from "../../../../components/Modal/ModalProvider";
import CohortSkeleton from "./Components/CohortSkeleton";
import { setReload } from "../../../../redux/slices/uiActions.slice";
import { fetchData } from "../../../../Utils/fetch";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { AxiosCohortType } from "../../../../types";
import { Button } from "../../../../components/Buttons";
import CohortTable from "./Components/CohortTable";
import SearchCohort from "./Components/SearchCohort";

function Cohort() {
  const { showModal } = useModal();
  const [cohorts, setCohorts] = useState<AxiosCohortType | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const { reload } = useSelector((state: RootState) => state.uiActions);

  useEffect(() => {
    const getCohort = async () => {
      try {
        const response = await fetchData<AxiosCohortType>(
          `/cohort?page=${currentPage}`
        );

        setCohorts(response.data || null);
      } finally {
        setLoading(false);
        dispatch(setReload(false));
      }
    };

    getCohort();
  }, [currentPage, reload]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <CohortSkeleton />;
  }
  return (
    <Container className="">
      <div className="flex md:justify-end flex-col md:flex-row">
        <div className="w-[200px]">
          {" "}
          <Button
            onClick={() =>
              showModal(MODAL_ID.CREATE_COHORT, {
                reload: () => setReload(true),
              })
            }
            variant="default"
          >
            Create Cohort
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <Typography variant="subheading2">
          Showing {cohorts?.data.length}/{cohorts?.totalItems}
        </Typography>
        <div className="flex flex-col mt-3 md:mt-0 md:flex-row">
          <div className="flex flex-col mt-3 md:mt-0 md:flex-row">
            <SearchCohort
              page={currentPage}
              setData={(data: AxiosCohortType | null) =>
                setCohorts(data || null)
              }
            />
          </div>
        </div>
      </div>
      <div>
        <CohortTable data={cohorts?.data || []} />
      </div>
      {cohorts?.data.length ? (
        <div>
          <Pagination
            totalPages={cohorts?.totalPages || 0}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      ) : null}
    </Container>
  );
}
export default Cohort;
