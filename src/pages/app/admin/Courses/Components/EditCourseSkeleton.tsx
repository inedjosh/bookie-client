import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function EditCourseSkeleton() {
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

export default EditCourseSkeleton;
