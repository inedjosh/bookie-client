import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function ProfileSkeleton() {
  return (
    <div className="p-10">
      <Skeleton height={150} width="100%" />
      <Skeleton height={150} className="mt-10" width={200} />
      <div className="flex mt-10 justify-between">
        <Skeleton height={600} width="70%" />
        <Skeleton height={600} width="30%" />
      </div>
    </div>
  );
}

export default ProfileSkeleton;
