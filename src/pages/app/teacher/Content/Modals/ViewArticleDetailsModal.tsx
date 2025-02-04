import Modal from "../../../../../components/Modal/Modal";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { fetchData } from "../../../../../Utils/fetch";
import { useEffect, useState } from "react";
import { VideoType } from "../../../../../types";
import EditContentSkeleton from "../Components/EditContentSkeleton";
import ModalHeader from "../../../../../components/Modal/ModalHeader";
import { Typography } from "../../../../../components/Typography";
import { readableDate } from "../../../../../Utils/Helpers";

interface ModalComponentProps {
  modalId: string;
}

function ViewArticleDetailsModal({ modalId }: ModalComponentProps) {
  const { modalStates } = useModal();
  const articleId = modalStates[modalId]?.props?.articleId;
  const [loading, setLoading] = useState(false);
  const [article, setArticle] = useState<VideoType | null>();

  useEffect(() => {
    const getCourse = async () => {
      try {
        setLoading(true);
        const response = await fetchData<VideoType>(`/article/${articleId}`);
        setArticle(response.data || null);
      } finally {
        setLoading(false);
      }
    };

    if (modalStates[modalId]?.isOpen) getCourse();
  }, [articleId, modalStates[modalId]?.isOpen]);

  return (
    <Modal modalId={modalId}>
      {article ? (
        <ModalHeader modalId={modalId}>
          <Typography variant="subheading">{article.topic}</Typography>
          <Typography variant="caption" color="muted-alt">
            {readableDate(new Date(article.createdAt))}
          </Typography>
        </ModalHeader>
      ) : null}
      <div className="w-full h-[700px] px-5 md:px-10 mt-10 overflow-visible md:w-[800px]">
        {loading ? (
          <EditContentSkeleton />
        ) : (
          <div>
            <div className="mt-10">
              {article ? (
                <Typography>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: article.description,
                    }}
                  />
                </Typography>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default ViewArticleDetailsModal;
