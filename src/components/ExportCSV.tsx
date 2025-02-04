import { TbFileExport } from "react-icons/tb";
import { Button } from "./Buttons";
import { Typography } from "./Typography";

type Props = {
  action: () => void;
};
function ExportCSV({ action }: Props) {
  return (
    <div className="w-[60px] md:w-[180px]">
      <Button onClick={action}>
        <TbFileExport />
        <Typography variant="subheading2" className="pl-4 hidden md:block">
          Export CSV
        </Typography>{" "}
      </Button>
    </div>
  );
}

export default ExportCSV;
