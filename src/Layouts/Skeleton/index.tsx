import Skeleton from "react-loading-skeleton";

export const StudentOverviewSkeleton = () => {
  return (
    <div className="p-10">
      <div className="flex items-center justify-between">
        <Skeleton height={150} width="50%" />
        <Skeleton height={200} width="50%" />
      </div>
      <div className="flex my-5 justify-between">
        <Skeleton height={500} width="70%" />
        <Skeleton height={500} width="28%" />
      </div>
    </div>
  );
};
