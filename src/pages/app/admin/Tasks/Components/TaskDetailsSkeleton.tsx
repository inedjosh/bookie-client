import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function TaskDetailsSkeleton() {
  return (
    <div className="p-10">
      <Skeleton height={30} width={200} />
      <Skeleton height={200} width="100%" className="mt-5" />
      <Skeleton height={300} width="100%" className="mt-5" />
    </div>
  );
}

export default TaskDetailsSkeleton;
