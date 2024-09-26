import { Typography } from "../components/Typography";

const PageLoader = () => {
  return (
    <div className="h-svh w-full flex justify-center items-center">
      <div className="flex items-center space-x-2 relative py-6 animate-pulse">
        <Typography variant={"heading"} color={"black"}>
          Bookie{" "}
        </Typography>
      </div>
    </div>
  );
};
export default PageLoader;
