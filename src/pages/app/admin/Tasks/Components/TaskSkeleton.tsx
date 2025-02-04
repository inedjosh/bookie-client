import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function TaskSkeleton() {
  return (
    <div className="p-10">
      <Skeleton height={150} width="100%" />
      <div className="flex my-5 justify-between">
        <Skeleton height={30} width={300} />
        <div className="flex justify-between">
          <Skeleton height={30} width={100} />
          <Skeleton height={30} width={100} />
          <Skeleton height={30} width={300} />
        </div>
      </div>
      <Skeleton height={500} width="100%" />
    </div>
  );
}

export default TaskSkeleton;
