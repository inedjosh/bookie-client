import { useFormik } from "formik";
import Modal from "../../../../../components/Modal/Modal";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { Input } from "../../../../../components/Inputs/TextInput";
import { Button } from "../../../../../components/Buttons";
import { Editor } from "../../../../../components/Inputs/Editor";
import { useDispatch } from "react-redux";
import { setReload } from "../../../../../redux/slices/uiActions.slice";
import { updateVideoSchema } from "../../../../../schema";
import { fetchData, updateData } from "../../../../../Utils/fetch";
import { useEffect, useState } from "react";
import { VideoType } from "../../../../../types";
import EditContentSkeleton from "../Components/EditContentSkeleton";
import ModalHeader from "../../../../../components/Modal/ModalHeader";
import { Typography } from "../../../../../components/Typography";

interface ModalComponentProps {
  modalId: string;
}

function EditVideoModal({ modalId }: ModalComponentProps) {
  const { hideModal, modalStates } = useModal();
  const videoId = modalStates[modalId]?.props?.videoId;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const getCourse = async () => {
      try {
        setLoading(true);
        const response = await fetchData<VideoType>(`/video/${videoId}`);

        setValues({
          ...values,
          topic: response.data?.topic || "",
          description: response.data?.description || "",
          url: response.data?.url || "",
        });
      } finally {
        setLoading(false);
      }
    };

    if (modalStates[modalId]?.isOpen) getCourse();
  }, [videoId, modalStates[modalId]?.isOpen]);

  const {
    handleSubmit,
    isSubmitting,
    touched,
    values,
    resetForm,
    handleBlur,
    handleChange,
    setValues,
    errors,
  } = useFormik({
    initialValues: {
      topic: "",
      description: "",
      url: "",
    },
    validationSchema: updateVideoSchema,
    onSubmit: () => submit(),
  });

  const submit = async () => {
    try {
      await updateData(`video/${videoId}`, values);
    } finally {
      resetForm();
      dispatch(setReload(true));
      hideModal(modalId);
    }
  };

  return (
    <Modal modalId={modalId}>
      <ModalHeader modalId={modalId}>
        <Typography variant="subheading">Edit Video</Typography>
      </ModalHeader>
      <div className="w-full h-[700px] px-5 md:px-10 mt-10 overflow-visible md:w-[800px]">
        {loading ? (
          <EditContentSkeleton />
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="py-2">
              <Input
                value={values.topic}
                name="topic"
                handleBlur={handleBlur}
                error={errors.topic}
                onChange={handleChange}
                label="Video topic"
                touched={touched.topic}
                placeholder="Enter video topic"
                type="text"
              />
            </div>
            <div className="py-2">
              <Input
                value={values.url}
                name="url"
                handleBlur={handleBlur}
                error={errors.url}
                onChange={handleChange}
                label="Video URL"
                touched={touched.url}
                placeholder="Enter video URL"
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

export default EditVideoModal;
