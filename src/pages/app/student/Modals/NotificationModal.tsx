import { useEffect, useState } from "react";
import Modal from "../../../../components/Modal/Modal";
import { EditCourseSkeleton } from "../../admin/Cohort/Components/Skeleton";
import ModalHeader from "../../../../components/Modal/ModalHeader";
import { Typography } from "../../../../components/Typography";
import { useModal } from "../../../../components/Modal/ModalProvider";
import { fetchData, updateData } from "../../../../Utils/fetch";
import { NotificationType } from "../../../../types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { formatTimeAgo } from "../../../../Utils/Helpers";
import { ClipLoader } from "react-spinners";
import { setUser } from "../../../../redux/slices/auth.slice";

interface ModalComponentProps {
  modalId: string;
}

function NotificationModal({ modalId }: ModalComponentProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(false);
  const [loadingMarkAll, setLoadingMarkAll] = useState(false);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const dispatch = useDispatch();

  const { modalStates } = useModal();

  useEffect(() => {
    const getNotifications = async () => {
      try {
        setLoading(true);
        const notifications = await fetchData<NotificationType[]>(
          `notifications/user/${user._id}`
        );

        const sortedNotifications =
          notifications.data?.length &&
          notifications.data.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        setNotifications(sortedNotifications || []);
      } finally {
        setLoading(false);
      }
    };

    if (modalStates[modalId]?.isOpen) getNotifications();
  }, [modalStates[modalId]?.isOpen]);

  const readAllNotifications = async () => {
    try {
      setLoadingMarkAll(true);
      const notifications = await updateData<NotificationType[]>(
        `notifications/${user._id}/all`,
        {}
      );

      setNotifications(notifications.data || []);
      dispatch(setUser({ ...user, unreadNotifications: 0 }));
    } finally {
      setLoadingMarkAll(false);
    }
  };

  return (
    <Modal modalId={modalId} title="Update Course">
      <div className="w-full h-[700px] overflow-visible md:w-[700px]">
        {loading ? (
          <EditCourseSkeleton />
        ) : (
          <div className="w-full">
            <ModalHeader modalId={modalId}>
              <div className="w-full ">
                <Typography variant="subheading" as="h2">
                  Notifications
                </Typography>
              </div>
            </ModalHeader>
            <div className="overflow-auto">
              <div className="flex w-full px-5 py-7 border-b border-border justify-between items-center">
                <div className="flex items-center">
                  <div className="flex items-center">
                    <Typography
                      variant="caption"
                      color="primary"
                      className="font-bold"
                    >
                      All
                    </Typography>
                    <div className="bg-primary flex w-5 ml-2 items-center justify-center  rounded-[5px]">
                      <Typography
                        variant="caption"
                        color="white"
                        as="h2"
                        className="font-bold"
                      >
                        {notifications.length}
                      </Typography>
                    </div>
                  </div>
                  <div className="h-5 border-2 mx-5 border-border" />
                  <div className="flex  items-center">
                    <Typography
                      variant="caption"
                      className="text-[#BABABA] font-bold"
                    >
                      Opened
                    </Typography>
                    <div className="bg-[#E6E6E6] flex w-5 ml-2 items-center justify-center  rounded-[5px]">
                      <Typography
                        variant="caption"
                        as="h2"
                        className="font-bold text-[#BABABA]"
                      >
                        {notifications.length - user.unreadNotifications}
                      </Typography>
                    </div>
                  </div>
                </div>
                <div onClick={readAllNotifications} className="">
                  {loadingMarkAll ? (
                    <ClipLoader color="#25326a" size="20px" />
                  ) : (
                    <Typography
                      variant="caption"
                      className="font-bold text-[#999999]"
                    >
                      Mark all as read
                    </Typography>
                  )}
                </div>
              </div>
              {notifications.map((notification) => (
                <div className="p-5 flex items-center justify-between border-b border-border">
                  <div className="flex-[.1]">
                    <div className="w-20 h-20  rounded-[100px] bg-[#D9D9D9]" />
                  </div>{" "}
                  <div className="flex-[.75]">
                    <Typography
                      variant="subheading"
                      as="h3"
                      className="font-bold text-[#999999]"
                    >
                      {notification.title}
                    </Typography>
                    <Typography variant="caption" className="font-bold">
                      {notification.description}
                    </Typography>
                  </div>
                  <div className="flex-[.1] flex flex-col items-end h-16 justify-between">
                    <div className="bg-[#E8F1FB] flex justify-center items-center h-5 w-5 rounded-full">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          notification.read ? "bg-[#D8E9FB]" : "bg-[#4198FB]"
                        }`}
                      />
                    </div>
                    <Typography
                      variant="xSmall"
                      color="accent"
                      className="font-bold"
                    >
                      {notification.createdAt
                        ? formatTimeAgo(new Date(notification.createdAt))
                        : "N/A"}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default NotificationModal;
