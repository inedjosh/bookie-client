import Modal from "../../../../../components/Modal/Modal";
import { Typography } from "../../../../../components/Typography";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { useEffect, useState } from "react";
import { fetchData } from "../../../../../Utils/fetch";
import ContentDetailsSkeleton from "../Components/ContentDetailsSkeleton";
import { HiOutlineExternalLink } from "react-icons/hi";
import ModalHeader from "../../../../../components/Modal/ModalHeader";
import { ArticleType, ContentType, VideoType } from "../../../../../types";
import { ContentTypeList } from "../../../../../constants";

interface ModalComponentProps {
  modalId: string;
}

function ViewContentDetailsModal({ modalId }: ModalComponentProps) {
  const { modalStates } = useModal();
  const contentId = modalStates[modalId]?.props?.contentId;
  const [content, setContent] = useState<ContentType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getContentDetails = async () => {
      try {
        setLoading(true);
        const response = await fetchData<ContentType>(
          `/course-content/${contentId}`
        );
        setContent(response.data);
      } finally {
        setLoading(false);
      }
    };

    if (modalStates[modalId]?.isOpen) getContentDetails();
  }, [contentId, modalStates[modalId]?.isOpen]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString();

  const renderVideoContent = (video: VideoType) => (
    <section>
      <Typography variant="subheading2" className="py-2">
        Video Content:
      </Typography>
      <Typography variant="body">
        <strong>Topic:</strong> {video.topic}
      </Typography>
      <Typography variant="body">
        <strong>Description:</strong>
      </Typography>
      <div
        dangerouslySetInnerHTML={{
          __html: video.description,
        }}
      />

      <Typography variant="body">
        <strong>Created At:</strong> {formatDate(video.createdAt)}
      </Typography>
      <a
        href={video.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-blue-600 underline"
      >
        Watch Video <HiOutlineExternalLink />
      </a>
    </section>
  );

  const renderArticleContent = (article: ArticleType) => (
    <section>
      <Typography variant="subheading2" className="py-2">
        Article Content:
      </Typography>
      <Typography variant="body">
        <strong>Topic:</strong> {article.topic}
      </Typography>
      <Typography variant="body">
        <strong>Description:</strong>
      </Typography>
      <div
        dangerouslySetInnerHTML={{
          __html: article.description,
        }}
      />
      <Typography variant="body">
        <strong>Article:</strong>
      </Typography>
      <div
        dangerouslySetInnerHTML={{
          __html: article.article,
        }}
      />

      <Typography variant="body">
        <strong>Created At:</strong> {formatDate(article.createdAt)}
      </Typography>
    </section>
  );

  return (
    <Modal modalId={modalId}>
      {loading || !content ? (
        <ContentDetailsSkeleton />
      ) : (
        <>
          {" "}
          <ModalHeader modalId={modalId}>
            <Typography>{`Content Details - ${content.title}`}</Typography>
            <Typography
              color="muted-alt"
              variant="caption"
              className="uppercase"
            >
              {content.contentType}
            </Typography>
          </ModalHeader>
          <section className="w-full h-[500px] mt-10 px-5 md:px-10 overflow-visible md:w-[700px]">
            <Typography variant="body">
              <strong>Cohort:</strong> {content.cohort.cohortName}
            </Typography>
            <Typography variant="body">
              <strong>Week:</strong> {content.weekNumber}, Day:{" "}
              {content.dayNumber}
            </Typography>
            <Typography variant="body">
              <strong>Last Updated:</strong> {content.isUpdated ? "Yes" : "No"}
            </Typography>
            {content.contentType === ContentTypeList.VIDEO &&
              renderVideoContent(content.content as VideoType)}
            {content.contentType === ContentTypeList.ARTICLE &&
              renderArticleContent(content.content as ArticleType)}
            <section>
              <Typography variant="subheading2" className="py-2">
                Participation:
              </Typography>
              {content.participation.map((participant) => (
                <div key={participant.studentId} className="mb-2">
                  <Typography variant="body">
                    <strong>Student ID:</strong> {participant.studentId}
                  </Typography>
                  <Typography variant="body">
                    <strong>Status:</strong> {participant.status}
                  </Typography>
                  <Typography variant="body">
                    <strong>Points:</strong> {participant.point}
                  </Typography>
                </div>
              ))}
            </section>
          </section>
        </>
      )}
    </Modal>
  );
}

export default ViewContentDetailsModal;
