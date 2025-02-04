import { useFormik } from "formik";
import Modal from "../../../../../components/Modal/Modal";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { SelectInput } from "../../../../../components/Inputs/SelectInput";
import { Button } from "../../../../../components/Buttons";
import { useDispatch, useSelector } from "react-redux";
import { setReload } from "../../../../../redux/slices/uiActions.slice";
import { createContentSchema } from "../../../../../schema";
import { fetchData, updateData } from "../../../../../Utils/fetch";
import { useEffect, useState } from "react";
import { ArticleType, ContentType, VideoType } from "../../../../../types";
import EditContentSkeleton from "../Components/EditContentSkeleton";
import ModalHeader from "../../../../../components/Modal/ModalHeader";
import { Typography } from "../../../../../components/Typography";
import { RootState } from "../../../../../redux/store";
import { CONTENT_TYPE } from "../../../../../constants";

interface ModalComponentProps {
  modalId: string;
}

function EditContentModal({ modalId }: ModalComponentProps) {
  const { hideModal, modalStates } = useModal();
  const contentId = modalStates[modalId]?.props?.contentId;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { cohort } = useSelector((state: RootState) => state.auth);
  const [articleList, setArticleList] = useState<
    { key: string; value: string }[]
  >([]);
  const [videoList, setVideoList] = useState<{ key: string; value: string }[]>(
    []
  );

  useEffect(() => {
    const getCourse = async () => {
      if (!cohort?.course._id || !contentId) return;

      try {
        setLoading(true);

        const [contentResponse, videosResponse, articlesResponse] =
          await Promise.all([
            fetchData<ContentType>(`/course-content/${contentId}`),
            fetchData<VideoType[]>(`/video/${cohort.course._id}/course`),
            fetchData<ArticleType[]>(`/article/${cohort.course._id}/course`),
          ]);

        const { data: contentData } = contentResponse;
        const { data: videoData } = videosResponse;
        const { data: articleData } = articlesResponse;

        setValues((prevValues) => ({
          ...prevValues,
          content: contentData?.content?._id || "",
          contentType: contentData?.contentType || "",
        }));

        const articleArr =
          articleData?.map(({ topic, _id }) => ({
            key: topic,
            value: _id,
          })) || [];

        const videoArr =
          videoData?.map(({ topic, _id }) => ({
            key: topic,
            value: _id,
          })) || [];

        setArticleList(articleArr);
        setVideoList(videoArr);
      } catch (error) {
        console.error("Error fetching course data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (modalStates[modalId]?.isOpen) {
      getCourse();
    }
  }, [cohort?.course?._id, contentId, modalStates[modalId]?.isOpen]);

  const {
    handleSubmit,
    isSubmitting,

    touched,
    values,
    resetForm,
    handleBlur,
    setValues,
    handleChange,
    errors,
  } = useFormik({
    initialValues: {
      content: "",
      contentType: "",
    },
    validationSchema: createContentSchema,
    onSubmit: () => submit(),
  });

  const submit = async () => {
    try {
      await updateData(`course-content/${contentId}`, values);
    } finally {
      resetForm();
      dispatch(setReload(true));
      hideModal(modalId);
    }
  };

  return (
    <Modal modalId={modalId}>
      <ModalHeader modalId={modalId}>
        <Typography variant="subheading">Edit Content </Typography>
      </ModalHeader>
      <div className="w-full h-[400px] px-5 md:px-10 mt-10 overflow-visible md:w-[800px]">
        {loading ? (
          <EditContentSkeleton />
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="py-2">
              <SelectInput
                value={values.contentType}
                name="contentType"
                handleBlur={handleBlur}
                error={errors.contentType}
                onChange={handleChange}
                label="Content Type"
                touched={touched.contentType}
                options={[
                  { key: "Article", value: "Article" },
                  { key: "Video", value: "Video" },
                ]}
              />
            </div>

            <div className="py-2">
              {values.contentType &&
              values.contentType === CONTENT_TYPE.ARTICLE ? (
                <SelectInput
                  value={values.content}
                  name="content"
                  handleBlur={handleBlur}
                  error={errors.content}
                  onChange={handleChange}
                  label="Select Content"
                  touched={touched.content}
                  options={articleList}
                />
              ) : (
                <SelectInput
                  value={values.content}
                  name="content"
                  handleBlur={handleBlur}
                  error={errors.content}
                  onChange={handleChange}
                  label="Select Content"
                  touched={touched.content}
                  options={videoList}
                />
              )}
            </div>

            <div className="pb-20 mt-10 w-full">
              <Button
                type="submit"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Update
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}

export default EditContentModal;
