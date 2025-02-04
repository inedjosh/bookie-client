import { VideoType } from "../../../../../types";
import Table from "../../../../../components/Table";
import { MODAL_ID } from "../../../../../Layouts/ModalLayouts";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { Typography } from "../../../../../components/Typography";

type Props = {
  data: VideoType[];
};

type VideoTypeTable = {
  _id: string;
  topic: string;
  url: string;
  courseName: string;
};

function VideoTable({ data }: Props) {
  const { showModal } = useModal();

  const filteredData = data.map((data) => {
    return {
      _id: data._id,
      topic: data.topic,
      courseName: data.course.name,
      url: data.url,
    };
  });

  const actions = [
    {
      label: "View Details",
      onClick: (row: VideoTypeTable) =>
        showModal(MODAL_ID.VIEW_VIDEO_DETAILS, {
          videoId: row._id,
        }),
    },
    {
      label: "Edit Video",
      onClick: (row: VideoTypeTable) =>
        showModal(MODAL_ID.EDIT_VIDEO, {
          videoId: row._id,
        }),
    },
    {
      label: "Delete Video",
      onClick: (row: VideoTypeTable) =>
        showModal(MODAL_ID.DELETE_VIDEO, {
          videoId: row._id,
        }),
    },
  ];
  return filteredData.length ? (
    <Table data={filteredData} actions={actions} hiddenFields={["_id"]} />
  ) : (
    <div className="w=full h-[300px] flex justify-center items-center">
      <Typography>No data found</Typography>
    </div>
  );
}

export default VideoTable;
