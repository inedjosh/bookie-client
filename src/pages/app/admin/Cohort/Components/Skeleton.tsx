import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export function EditCourseSkeleton() {
  return (
    <div className="p-10">
      <Skeleton height={50} width={50} className="py-2" />
      <Skeleton height={20} width="100%" className="py-2" />
      <Skeleton height={20} width="100%" className="py-2" />
      <Skeleton height={20} width="100%" className="py-2" />
      <Skeleton height={20} width="100%" className="py-2" />
      <Skeleton height={20} width="100%" className="py-2" />
    </div>
  );
}

export function CohortDetailsSkeleton() {
  return (
    <div className="p-10">
      <Skeleton height={30} width={200} />
      <Skeleton height={200} width="100%" className="mt-5" />
      <Skeleton height={300} width="100%" className="mt-5" />
    </div>
  );
}

export function AssignTeacherSkeleton() {
  return (
    <div className="p-10">
      <Skeleton height={200} width="100%" className="mt-5" />
      <Skeleton height={200} width="100%" className="mt-5" />
      <Skeleton height={200} width="100%" className="mt-5" />
    </div>
  );
}
