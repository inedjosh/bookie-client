import { useEffect, useState } from "react";
import Modal from "../../../../../components/Modal/Modal";
import ModalHeader from "../../../../../components/Modal/ModalHeader";
import { Typography } from "../../../../../components/Typography";
import EditCourseSkeleton from "../../../admin/Courses/Components/EditCourseSkeleton";
import { ContentType } from "../../../../../types";
import { fetchData } from "../../../../../Utils/fetch";
import { useModal } from "../../../../../components/Modal/ModalProvider";

type Props = {
  modalId: string;
};
function ViewContentModal({ modalId }: Props) {
  const [loading, setLoading] = useState(false);
  const { modalStates } = useModal();
  const contentId = modalStates[modalId]?.props?.contentId;
  const [content, setContent] = useState<ContentType | null>(null);

  useEffect(() => {
    const getContent = async () => {
      try {
        setLoading(true);
        const response = await fetchData<ContentType>(
          `course-content/${contentId}`
        );
        console.log({ response });
        setContent(response.data);
      } finally {
        setLoading(false);
      }
    };

    if (modalStates[modalId]?.isOpen) getContent();
  }, [modalStates[modalId]?.isOpen]);

  return (
    <Modal modalId={modalId} title="Update Course">
      <div className="w-full h-[800px] overflow-visible md:w-[1000px]">
        {loading ? (
          <EditCourseSkeleton />
        ) : (
          <div>
            <ModalHeader modalId={modalId}>
              <div className="flex items-center">
                <Typography variant="subheading" as="h3">
                  {content?.title}
                </Typography>
                <Typography variant="caption" className="ml-3" color="accent">
                  {content?.contentType}
                </Typography>
              </div>
            </ModalHeader>
            <div className="w-[100%] px-5 md:px-10 h-[400px]">
              <div className="border h-full">{/* <Video /> */}</div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default ViewContentModal;
