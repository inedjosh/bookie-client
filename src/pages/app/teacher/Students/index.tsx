import Container from "../../../../components/Container";
import { Typography } from "../../../../components/Typography";
import Pagination from "../../../../components/Pagination";
import { useEffect, useState } from "react";
import { AxiosUserType } from "../../../../types";
import { useDispatch, useSelector } from "react-redux";
import { setReload } from "../../../../redux/slices/uiActions.slice";
import { RootState } from "../../../../redux/store";
import { fetchData } from "../../../../Utils/fetch";
import UsersSkeleton from "./Components/UserSkeleton";
import SearchUsers from "./Components/SearchUsers";
import UsersTable from "./Components/UserTable";

function Students() {
  const [users, setUsers] = useState<AxiosUserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const { reload } = useSelector((state: RootState) => state.uiActions);
  const { cohort } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const getCourses = async () => {
      try {
        const response = await fetchData<AxiosUserType>(
          `/user/${cohort?._id}/cohort?page=${currentPage}`
        );

        setUsers(response.data || null);
      } finally {
        setLoading(false);
        dispatch(setReload(false));
      }
    };

    getCourses();
  }, [currentPage, reload]);
  console.log(users);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <UsersSkeleton />;
  }

  return (
    <Container className="">
      {/* <UserOverview
        totalUsers={users?.data.length || 0}
        verifiedUsers={0}
        enrolledStudents={0}
        isStudent={userRole === ACCOUNT_TYPES.STUDENT}
      /> */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <Typography variant="subheading2">
          Showing {users?.data.length}/{users?.totalItems}
        </Typography>
        <div className="flex flex-col mt-3 md:mt-0 md:flex-row">
          <SearchUsers
            page={currentPage}
            setData={(data: AxiosUserType | null) => setUsers(data || null)}
            cohortId={cohort?._id || ""}
          />
        </div>
      </div>
      <div>
        <UsersTable data={users?.data || []} />
      </div>
      {users?.data.length ? (
        <div>
          <Pagination
            totalPages={20}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      ) : null}
    </Container>
  );
}

export default Students;
