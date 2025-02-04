import { useFormik } from "formik";
import Modal from "../../../../../components/Modal/Modal";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { Input } from "../../../../../components/Inputs/TextInput";
import { Button } from "../../../../../components/Buttons";
import { Editor } from "../../../../../components/Inputs/Editor";
import { useDispatch } from "react-redux";
import { setReload } from "../../../../../redux/slices/uiActions.slice";
import { updateArticleSchema } from "../../../../../schema";
import { fetchData, updateData } from "../../../../../Utils/fetch";
import { useEffect, useState } from "react";
import { ArticleType } from "../../../../../types";
import EditContentSkeleton from "../Components/EditContentSkeleton";
import ModalHeader from "../../../../../components/Modal/ModalHeader";
import { Typography } from "../../../../../components/Typography";

interface ModalComponentProps {
  modalId: string;
}

function EditArticleModal({ modalId }: ModalComponentProps) {
  const { hideModal, modalStates } = useModal();
  const articleId = modalStates[modalId]?.props?.articleId;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const getCourse = async () => {
      try {
        setLoading(true);
        const response = await fetchData<ArticleType>(`/article/${articleId}`);

        setValues({
          ...values,
          topic: response.data?.topic || "",
          description: response.data?.description || "",
        });
      } finally {
        setLoading(false);
      }
    };

    if (modalStates[modalId]?.isOpen) getCourse();
  }, [articleId, modalStates[modalId]?.isOpen]);

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
    },
    validationSchema: updateArticleSchema,
    onSubmit: () => submit(),
  });

  console.log(errors);

  const submit = async () => {
    try {
      await updateData(`article/${articleId}`, values);
    } finally {
      resetForm();
      dispatch(setReload(true));
      hideModal(modalId);
    }
  };

  return (
    <Modal modalId={modalId}>
      <ModalHeader modalId={modalId}>
        <Typography variant="subheading">Create Article </Typography>
      </ModalHeader>
      <div className="w-full h-[500px] px-5 md:px-10 mt-10 overflow-visible md:w-[800px]">
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
              <Editor
                value={values.description}
                name="description"
                error={errors.description}
                onChange={handleChange}
                label="Article article"
                touched={touched.description}
                placeholder="Enter content article"
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

export default EditArticleModal;
