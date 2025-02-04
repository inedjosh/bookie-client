import { useEffect, useState } from "react";
import Modal from "../../../../../components/Modal/Modal";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { AxiosSingleUserType } from "../../../../../types";
import { fetchData } from "../../../../../Utils/fetch";
import UserDetailsSkeleton from "../Components/UserDetailsSkeleton";
import { Typography } from "../../../../../components/Typography";
import { readableDate } from "../../../../../Utils/Helpers";
import ModalHeader from "../../../../../components/Modal/ModalHeader";

interface ModalComponentProps {
  modalId: string;
}

function UserDetailsModal({ modalId }: ModalComponentProps) {
  const { modalStates } = useModal();
  const userId = modalStates[modalId]?.props?.userId;
  const [user, setUser] = useState<AxiosSingleUserType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getCourse = async () => {
      try {
        setLoading(true);
        const response = await fetchData<AxiosSingleUserType>(
          `/user/${userId}`
        );
        console.log(response);

        setUser(response.data || null);
      } finally {
        setLoading(false);
      }
    };

    if (modalStates[modalId]?.isOpen) getCourse();
  }, [userId, modalStates[modalId]?.isOpen]);

  return (
    <Modal modalId={modalId} title={"User Details"}>
      <div className="w-full h-[500px] overflow-visible md:w-[500px]">
        {loading ? (
          <UserDetailsSkeleton />
        ) : user ? (
          <div>
            <ModalHeader modalId={modalId}>
              <Typography variant="subheading">User Details </Typography>
            </ModalHeader>
            <div className="w-full h-[500px] px-5 md:px-10 mt-10 overflow-visible md:w-[800px]">
              <Typography variant="subheading2" className="my-3">
                <span className="text-muted-alt"> Name:</span>
                {user.user.firstName} {user.user.lastName}
              </Typography>
              <Typography variant="subheading2" className="my-3">
                <span className="text-muted-alt"> Email:</span>{" "}
                {user.user.email}
              </Typography>
              <Typography variant="subheading2" className="my-3">
                <span className="text-muted-alt"> Country:</span>{" "}
                {user.user.country}
              </Typography>
              <Typography variant="subheading2" className="my-3">
                <span className="text-muted-alt"> Phone Number: </span>
                {user.user.phoneNumber}
              </Typography>
              <Typography variant="subheading2" className="my-3">
                <span className="text-muted-alt"> Last Login Date: </span>
                {readableDate(new Date(user.user.lastLoginDate))}
              </Typography>
              <Typography variant="subheading2" className="my-3">
                <span className="text-muted-alt"> Cohort: </span>
                {user.cohort.cohortName}
              </Typography>
            </div>
          </div>
        ) : null}
      </div>
    </Modal>
  );
}

export default UserDetailsModal;
