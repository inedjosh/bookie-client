import { UserType } from "../../../../../types";
import Table from "../../../../../components/Table";
import { MODAL_ID } from "../../../../../Layouts/ModalLayouts";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { readableDate } from "../../../../../Utils/Helpers";
import { Typography } from "../../../../../components/Typography";

type Props = {
  data: UserType[];
};

type UserTableType = {
  _id: string;
  firstName: string;
  lastName: string;
  country: string;
  phoneNumber: string;
  role: string;
  accountActive: string;
  lastLoginDate: string;
};

function UsersTable({ data }: Props) {
  const { showModal } = useModal();

  const filteredData = data.map((user) => {
    return {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      country: user.country,
      phoneNumber: user.phoneNumber,
      role: user.role,
      accountActive: user.accountActive ? "Active" : "InActive",
      lastLoginDate: readableDate(new Date(user.lastLoginDate)),
    };
  });

  const actions = [
    {
      label: "View User",
      onClick: (row: UserTableType) =>
        showModal(MODAL_ID.USER_DETAILS, {
          userId: row._id,
        }),
    },
    // {
    //   label: "Disable User",
    //   onClick: (row: UserTableType) =>
    //     showModal(MODAL_ID.DISABLE_USER, { userId: row._id }),
    // },
  ];
  return filteredData.length ? (
    <Table data={filteredData} actions={actions} hiddenFields={["_id"]} />
  ) : (
    <div className="w=full h-[300px] flex justify-center items-center">
      <Typography>No data found</Typography>
    </div>
  );
}

export default UsersTable;
