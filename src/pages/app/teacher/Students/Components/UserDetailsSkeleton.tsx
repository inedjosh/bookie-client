import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function UserDetailsSkeleton() {
  return (
    <div className="p-10">
      <Skeleton height={100} width={100} className="my-5 rounded-full" />
      <Skeleton height={40} width="100%" className="my-5" />
      <Skeleton height={40} width="100%" className="my-5" />
      <Skeleton height={40} width="100%" className="my-5" />
      <Skeleton height={40} width="100%" className="my-5" />
      <Skeleton height={50} width="100%" className="my-5" />
    </div>
  );
}

export default UserDetailsSkeleton;
