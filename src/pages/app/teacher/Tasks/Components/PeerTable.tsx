import { PeerType } from "../../../../../types";
import Table from "../../../../../components/Table";
import { MODAL_ID } from "../../../../../Layouts/ModalLayouts";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { readableDate } from "../../../../../Utils/Helpers";
import { Typography } from "../../../../../components/Typography";

type Props = {
  data: PeerType[];
};

type PeerTypeTable = {
  _id: string;
  topic: string;
  peer: string;
  createdAt: string;
};

function PeerTable({ data }: Props) {
  const { showModal } = useModal();

  const filteredData = data.map((data) => {
    return {
      _id: data._id,
      topic: data.topic,
      peer: `${data.peer.firstName} ${data.peer.lastName} `,
      createdAt: readableDate(new Date(data.createdAt)),
    };
  });

  const actions = [
    // {
    //   label: "View Peer",
    //   onClick: (row: PeerTypeTable) =>
    //     showModal(MODAL_ID.VIEW_PEER, {
    //       peerId: row._id,
    //     }),
    // },
    {
      label: "Edit Peer",
      onClick: (row: PeerTypeTable) =>
        showModal(MODAL_ID.EDIT_PEER, {
          peerId: row._id,
        }),
    },
    {
      label: "Delete Peer",
      onClick: (row: PeerTypeTable) =>
        showModal(MODAL_ID.DELETE_PEER, {
          peerId: row._id,
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

export default PeerTable;
