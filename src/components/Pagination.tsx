import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Button } from "./Buttons";
import { Typography } from "./Typography";

interface PaginationProps {
  totalPages: number; // Total number of pages
  currentPage: number; // Current active page
  onPageChange: (page: number) => void; // Callback for page change
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
}) => {
  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="flex items-center justify-center gap-2 p-4">
      <div className="w-[60px]">
        {" "}
        <Button
          variant="default"
          className={`p-2  ${
            currentPage === 1
              ? "text-gray-400"
              : "text-gray-800 hover:bg-border"
          } `}
          onClick={handlePrev}
          disabled={currentPage === 1}
        >
          <FiChevronLeft size={20} color="#fff" />
        </Button>
      </div>

      <div className="px-5">
        <Typography>{currentPage}</Typography>
      </div>

      <div className="w-[60px]">
        {" "}
        <Button
          variant="default"
          className={`p-2 rounded-md ${
            currentPage === totalPages
              ? "text-border"
              : "text-inputBg hover:bg-border"
          }`}
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          <FiChevronRight size={20} />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
