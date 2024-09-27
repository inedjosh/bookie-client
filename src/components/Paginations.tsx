import React from "react";
import { GrPrevious, GrNext } from "react-icons/gr";
import { useDispatch } from "react-redux";
import {
  setAuthorsPagination,
  setBooksPagination,
} from "../redux/slices/library.slice";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  page: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  page,
}) => {
  const dispatch = useDispatch();

  const handlePrevClick = () => {
    if (currentPage > 1) {
      page === "book"
        ? dispatch(
            setBooksPagination({ currenPage: currentPage - 1, totalPages })
          )
        : dispatch(
            setAuthorsPagination({ currenPage: currentPage - 1, totalPages })
          );
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      page === "book"
        ? dispatch(
            setBooksPagination({ currenPage: currentPage - 1, totalPages })
          )
        : dispatch(
            setAuthorsPagination({ currenPage: currentPage - 1, totalPages })
          );
    }
  };

  return (
    <div className="flex justify-end fixed  w-full h-[80px] bottom-14 bg-background py-2 md:bottom-0 right-0">
      <div className=" flex w-[200px] justify-between mr-4 md:mr-20">
        <div className="w-[40px]  h-[40px]">
          <button
            className="border w-full flex justify-center items-center h-full  p-3 border-primary"
            onClick={handlePrevClick}
            disabled={currentPage === 1}
          >
            <GrPrevious color="black" size="20px" />
          </button>
        </div>
        <div className="w-[40px] mx-5  h-[40px]">
          <div className="border flex justify-center items-center w-full h-full  p-3 border-primary">
            {currentPage}
          </div>
        </div>
        <div className="w-[40px] h-[40px]">
          <button
            className="border p-3 w-full flex justify-center items-center h-full  border-primary"
            onClick={handleNextClick}
            disabled={currentPage === totalPages}
          >
            <GrNext className="black" size="20px" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
