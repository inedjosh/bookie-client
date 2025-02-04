import { useFormik } from "formik";
import Modal from "../../../../../components/Modal/Modal";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { Input } from "../../../../../components/Inputs/TextInput";
import { SelectInput } from "../../../../../components/Inputs/SelectInput";
import { Button } from "../../../../../components/Buttons";
import { Editor } from "../../../../../components/Inputs/Editor";
import { useDispatch } from "react-redux";
import { setReload } from "../../../../../redux/slices/uiActions.slice";
import { createContentSchema } from "../../../../../schema";
import { fetchData, updateData } from "../../../../../Utils/fetch";
import { useEffect, useState } from "react";
import { ContentType } from "../../../../../types";
import EditContentSkeleton from "../Components/EditContentSkeleton";

interface ModalComponentProps {
  modalId: string;
}

function EditContentModal({ modalId }: ModalComponentProps) {
  const { hideModal, modalStates } = useModal();
  const contentId = modalStates[modalId]?.props?.contentId;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const getCourse = async () => {
      try {
        setLoading(true);
        const response = await fetchData<ContentType>(
          `/course-content/${contentId}`
        );

        setValues({
          ...values,
          title: response.data?.title || "",
          // description: response.data?.description || "",
          // contentUrl: response.data?.contentUrl || "",
          contentType: response.data?.contentType || "",
        });
      } finally {
        setLoading(false);
      }
    };

    if (modalStates[modalId]?.isOpen) getCourse();
  }, [contentId, modalStates[modalId]?.isOpen]);

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
      title: "",
      description: "",
      contentUrl: "",
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
    <Modal modalId={modalId} title="Edit Content">
      <div className="w-full h-[700px] overflow-visible md:w-[500px]">
        {loading ? (
          <EditContentSkeleton />
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="py-2">
              <Input
                value={values.title}
                name="title"
                handleBlur={handleBlur}
                error={errors.title}
                onChange={handleChange}
                label="Course title"
                touched={touched.title}
                placeholder="Enter content title"
                type="text"
              />
            </div>
            <div className="py-2">
              <Input
                value={values.contentUrl}
                name="contentUrl"
                handleBlur={handleBlur}
                error={errors.contentUrl}
                onChange={handleChange}
                label="Content URL"
                touched={touched.contentUrl}
                placeholder="Enter content URL"
                type="text"
              />
            </div>
            <div className="py-2">
              <Editor
                value={values.description}
                name="description"
                error={errors.description}
                onChange={handleChange}
                label="Course description"
                touched={touched.description}
                placeholder="Enter content description"
                onBlur={handleBlur}
              />
            </div>

            <div className="py-2">
              <SelectInput
                value={values.contentType}
                name="contentType"
                handleBlur={handleBlur}
                error={errors.contentType}
                onChange={handleChange}
                label="Content category"
                touched={touched.contentType}
                options={[
                  { key: "pdf", value: "PDF" },
                  { key: "video", value: "VIDEO" },
                  { key: "slide", value: "SLIDE" },
                  { key: "audio", value: "AUDIO" },
                  { key: "text", value: "TEXT" },
                  { key: "image", value: "IMAGE" },
                  { key: "article", value: "ARTICLE" },
                  { key: "link", value: "LINK" },
                  { key: "quiz", value: "QUIZ" },
                  { key: "code", value: "CODE" },
                  { key: "document", value: "DOCUMENT" },
                  { key: "ebook", value: "EBOOK" },
                  { key: "infographic", value: "INFOGRAPHIC" },
                  { key: "spreadsheet", value: "SPREADSHEET" },
                  { key: "animation", value: "ANIMATION" },
                  { key: "other", value: "OTHER" },
                ]}
              />
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
